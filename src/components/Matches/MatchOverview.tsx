import React, {Component, FormEvent} from "react";
import LoadingCard from "../Misc/LoadingCard";
import * as database from "../../data/database";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import * as web3utils from 'web3-utils';
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Contract from "web3/eth/contract";
import Web3 from "web3"
import ErrorCard from "../Misc/ErrorCard";
import {IMatch} from "../../data/interfaces";

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
    sendBetResultMsg: string
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

        let players: string[] = await contractInstance.methods.bet(0).call({from: accounts[0]});
        let betValueWei: string = await contractInstance.methods.getTotalBetValue().call({from: accounts[0]});
        let betValueEther: string = await web3utils.fromWei(web3utils.toBN(betValueWei));

        await this.setState({
            players: players,
            totalBetValue: `${betValueEther} Ether`,
            contract: contractInstance,
            account: accounts[0],
            loadingState: LoadingState.Loaded
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
        const betValue: string = form[0].value;
        const wei: string = web3utils.toWei(betValue);

        // Get the addPlayer method and send a transaction to it
        let method = this.state.contract.methods.addPlayer();
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
    private async makeMeWinner(): Promise<void> {
        if (this.state.contract === undefined) return;
        let method = this.state.contract.methods.win(0);
        await method.send({from: this.state.account});
        await database.setMatchAsArchived(this.props.match.id as number);

        // Update the stats for each player
        // We need to check the address and make sure we do not accidently make the winner lose his earnings stats
        for (let index in this.state.players) {
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
        }
    }

    /**
     * Display the betting form if we meet the requirements
     */
    private displayForm(): null | any {
        // Don't display anything if we don't have the required info
        if (this.state.account === null || this.state.players === null) return null;

        // If account address is already in players array, then account cannot bet!
        if (this.state.players.includes(this.state.account)) {
            return <div className="font-italic">You are already part of this match!</div>
        } else {
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
                        <strong>Amount of players: </strong>{this.state.players.length}<br/>
                        <strong>Total Bet Amount: </strong>{this.state.totalBetValue}<br/>
                        <strong>Started on: </strong>{this.props.match.start_date}
                        <hr/>
                        {this.displayForm()}
                        <hr/>
                        <strong>Debug options:</strong><br/>
                        <Button onClick={() => this.makeMeWinner()}>Make me winner!</Button>
                    </Card.Body>
                </Card>
            );
        }
    }
}

export default MatchOverview;
