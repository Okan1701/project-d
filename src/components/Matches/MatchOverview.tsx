import React, {Component, FormEvent} from "react";
import LoadingCard from "../Misc/LoadingCard";
import * as database from "../../data/database";
import * as sports from "../../data/sports";
import Card from "react-bootstrap/Card";
import * as web3utils from 'web3-utils';
import Button from "react-bootstrap/Button";
import Contract from "web3/eth/contract";
import Web3 from "web3"
import ErrorCard from "../Misc/ErrorCard";
import {IMatch, ISportEvent, MatchStatusCode, MatchWinningTeam} from "../../data/interfaces";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const rouletteContractAbi = require("../../contracts/RouletteContract");

enum LoadingState {
    Loading,
    Loaded,
    Failed
}

interface IState {
    loadingState: LoadingState,
    errorMessage: string
    totalBetValue: string,
    players: string[],
    contract?: Contract,
    account: string,
    isSendingBet: boolean,
    disableFormSubmit: boolean,
    sendBetResultMsg: string,
    sportEvent?: ISportEvent
}

interface IProps {
    web3: Web3,
    match: IMatch
}

class MatchOverview extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            loadingState: LoadingState.Loading,
            errorMessage: "N/A",
            totalBetValue: "",
            players: [],
            contract: undefined,
            account: "",
            isSendingBet: false,
            disableFormSubmit: false,
            sendBetResultMsg: ""
        };
    }

    public componentDidMount(): void {
        console.log("Address: " + this.props.match.contract_address);
        // noinspection JSIgnoredPromiseFromCall
        this.getMatchDetails().catch(
            (reason: string) => {
                console.log(reason);
            }
        );

    }

    /**
     * Get the match details by retrieving data from the relevant contract instance
     */
    private async getMatchDetails(): Promise<void> {
        const accounts: string[] = await this.props.web3.eth.getAccounts();

        // Get the specific contract instance that belongs to this match using its address
        const contractInstance: any = new this.props.web3.eth.Contract(rouletteContractAbi.abi, this.props.match.contract_address);

        let players: string[] = await contractInstance.methods.getPlayers().call({from: accounts[0]});
        let betValueWei: string = await contractInstance.methods.getTotalBetValue().call({from: accounts[0]});
        let betValueEther: string = await web3utils.fromWei(web3utils.toBN(betValueWei));

        let sportEvent: ISportEvent = await sports.getEventFromId(this.props.match.sport_event_id);

        this.setState({
            players: players,
            totalBetValue: `${betValueEther} Ether`,
            contract: contractInstance,
            account: accounts[0],
            loadingState: LoadingState.Loaded,
            sportEvent: sportEvent
        });
    }

    public componentDidUpdate(prevProps: IProps, prevState: IState, snapshot: any): void {
        /**
         * componentDidMount is apparently not called again when user chooses a new match in MatchesArea.
         * So we have to manually check each component update and call componentDidMount to load new match details.
         */
        if (prevProps.match.id !== this.props.match.id) {
            this.setState({loadingState: LoadingState.Loading}); // Display loading screen again!
            this.componentDidMount();
        }
    }

    /**
     * Called when user clicks on the Submit button
     * This will submit the entered bet amount
     * @param event: Form submit event containing the form and input
     */
    private async onBetSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        const form: EventTarget = event.target;

        // Prevent default behavior
        event.preventDefault();
        event.stopPropagation();

        if (this.state.contract === undefined) return;

        // Prevent user from submitting again
        this.setState({
            isSendingBet: true,
            disableFormSubmit: true
        });

        // The bet value that was entered in the form
        const selectedTeam: number = form[0].value;
        const betValue: string = form[1].value;
        const wei: string = web3utils.toWei(betValue);

        // Get the addPlayer method and send a transaction to it
        let method = this.state.contract.methods.bet(selectedTeam);
        await method.send({
            from: this.state.account,
            value: wei.toString()
        });

        // Reset form and reload match details
        this.setState({
            isSendingBet: false,
            disableFormSubmit: false
        });
        this.componentDidMount();

        alert("Bet has been placed!");
    }

    /**
     * This method is called when the onSubmitBet method throws an error
     * It will log the error to console and update the state in order to display UI feedback
     * @param error: the error object containing details about the error
     */
    private async onBetSubmitFail(error: Error): Promise<void> {
        console.log(error);
        this.setState({
            sendBetResultMsg: `${error.name}: ${error.message}`,
            disableFormSubmit: true,
            isSendingBet: false
        });
    }


    /**
     * Make the currently logged in user win the match
     * This will call 'win()' on the smart contract
     */
    private async claimRewards(winningTeam: MatchWinningTeam): Promise<void> {
        if (this.state.contract === undefined) return;
        let method = this.state.contract.methods.getReward(winningTeam);
        await method.send({from: this.state.account});
        alert("done");
        //await database.setMatchAsArchived(this.props.match.id as number);

        // Update the stats for each player
        // We need to check the address and make sure we do not accidently make the winner lose his earnings stats
/*        for (let index in this.state.players) {
            if (this.state.players[index] === this.state.account) {
                let contractMethod = this.state.contract.methods.getTotalBetValue();
                let wonBetValueWei: number = await contractMethod.call({from: this.state.players[index]});

                await database.updatePlayerWinLoss(this.state.players[index], true);
                await database.updatePlayerEarnings(this.state.players[index], wonBetValueWei);

            } else {
                let contractMethod = this.state.contract.methods.getPlayerBet(this.state.players[index]);
                // We will need to invert lostBetValue to a negative value since player is meant to lose earnings
                let lostBetValueWei: number = await contractMethod.call({from: this.state.players[index]});

                await database.updatePlayerWinLoss(this.state.players[index], false);
                await database.updatePlayerEarnings(this.state.players[index], lostBetValueWei * -1);

            }
        }*/
    }

    /**
     * Display the betting form if we meet the requirements
     */
    private displayForm(): null | any {
        // Don't display anything if we don't have the required info
        if (this.state.account === null || this.state.players === null || this.state.sportEvent === undefined) return null;

        // If account address is already in players array and can't claim rewards yet, then player will not be able to do anything!
        if (this.state.players.includes(this.state.account) && this.props.match.status_code !== MatchStatusCode.CanClaimRewards) {
            return <div className="font-italic">You are already part of this match!</div>
        }

        // If match is already ready to decide winner, then players cannot bet!
        if (!this.state.players.includes(this.state.account) && this.props.match.status_code !== MatchStatusCode.WaitingForMatchDate) {
            return <div className="font-italic">This match is not accepting new players anymore!</div>
        }

        // Display form that allows players to participate if they haven't (while the match is still open to players)
        if (this.props.match.status_code === MatchStatusCode.WaitingForMatchDate) {
            // If we are currently sending a bet, then the button will have a loading spinner
            let loadingElement;
            if (this.state.isSendingBet) {
                loadingElement = <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/>
            }

            return (
                <Form
                    onSubmit={(e: FormEvent<HTMLFormElement>) => this.onBetSubmit(e).catch((ex: Error) => this.onBetSubmitFail(ex))}>
                    <Form.Group>
                        <Form.Label>You can participate in this match by betting your own ether:</Form.Label>
                        <Form.Control as="select">
                            <option value={0}>{this.state.sportEvent.strHomeTeam}</option>
                            <option value={1}>{this.state.sportEvent.strAwayTeam}</option>
                        </Form.Control><br/>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroupPrepend">ETH</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control type="number" placeholder="Enter bet value here..." required/>
                        </InputGroup>
                        <br/>
                        <Button type="submit" disabled={this.state.disableFormSubmit}>{loadingElement}Submit
                            bet!</Button>
                        <p>{this.state.sendBetResultMsg}</p>
                    </Form.Group>
                </Form>
            );
        }

        if (this.props.match.status_code === MatchStatusCode.CanClaimRewards && this.props.match.winning_team !== MatchWinningTeam.None) {
            return (
                <Form>
                    <Form.Group>
                        <Form.Label>Rewards can be claimed! <br/>Click on the button below to claim your rewards. If the team
                            that you bet on lost, then you will not recieve anything</Form.Label><br/>
                        <Button onClick={() => this.claimRewards(this.props.match.winning_team)}>Claim rewards</Button>
                    </Form.Group>
                </Form>
            );
        }
    }

    public render(): any {
        return (
            <div>
                <LoadingCard text="Loading match data..." show={this.state.loadingState === LoadingState.Loading}/>
                <ErrorCard title={"Failed loading match data!"} msg={this.state.errorMessage}
                           show={this.state.loadingState === LoadingState.Failed}/>
                {this.showMainComponent()}
            </div>
        );
    }

    private renderDebugOptions() {
        let updateMatch = async (selectedTeam: MatchWinningTeam) => {
            this.props.match.winning_team = selectedTeam;
            this.props.match.status_code = MatchStatusCode.CanClaimRewards;
            await database.updateMatch(this.props.match);
            this.componentDidMount();
        };

        if (this.props.match.winning_team === MatchWinningTeam.None) {
            return (
                <div>
                    <strong>Debug options:</strong><br/>
                    <Button onClick={() => updateMatch(MatchWinningTeam.HomeTeam)}>Make home team win</Button>
                    <Button onClick={() => updateMatch(MatchWinningTeam.AwayTeam)} style={{marginLeft: "10px"}}>Make
                        away team win</Button>
                </div>
            );
        }

    }

    private showMainComponent() {
        if (this.state.loadingState === LoadingState.Loaded) {
            return (
                <Card>
                    <Card.Header>Match details</Card.Header>
                    <Card.Body>
                        <p>Here in the match overview, you can see additionel details like the amount of players, the
                            total
                            bet value and options for you to place your own bet!</p>
                        <br/><h3>{this.props.match.title}</h3>
                        {
                            (this.state.sportEvent as ISportEvent).strHomeTeam +
                            " vs " +
                            (this.state.sportEvent as ISportEvent).strAwayTeam +
                            " at " + (this.state.sportEvent as ISportEvent).dateEvent + " " + (this.state.sportEvent as ISportEvent).strTime}<br/><br/>
                        <strong>Amount of players: </strong>{this.state.players.length}<br/>
                        <strong>Total Bet Amount: </strong>{this.state.totalBetValue}<br/>
                        <strong>Started on: </strong>{this.props.match.start_date}<br/><br/>
                        <strong>Status: </strong>{MatchStatusCode[this.props.match.status_code]}
                        <hr/>
                        {this.displayForm()}
                        <hr/>
                        {this.renderDebugOptions()}
                    </Card.Body>
                </Card>
            );
        }
    }
}

export default MatchOverview;
