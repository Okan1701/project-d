import React, {Component, FormEvent} from "react";
import LoadingCard from "./LoadingCard";
import * as database from "../database";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import * as web3utils from 'web3-utils';
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Contract from "web3/eth/contract";
import Web3 from "web3"

const rouletteContractAbi = require("../contracts/RouletteContract");

enum LoadingState {
    Loading,
    Loaded
}

interface IState {
    loadingState: LoadingState,
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
    match: database.IMatch
}

class MatchOverview extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            loadingState: LoadingState.Loading,
            totalBetValue: "",
            players: [],
            contract: undefined,
            account: "",
            isSendingBet: false,
            disableFormSubmit: false,
            sendBetResultMsg: ""
        }
    }

    public componentDidMount(): void {
        console.log("Address: " + this.props.match.contract_address);
        // noinspection JSIgnoredPromiseFromCall
        this.getMatchDetails();

    }

    /**
     * Get the match details by retrieving data from the relevant contract instance
     */
    private async getMatchDetails(): Promise<void> {
        const accounts: string[] = await this.props.web3.eth.getAccounts();
        
        // Get the specific contract instance that belongs to this match using its address
        const contractInstance: Contract = new this.props.web3.eth.Contract(rouletteContractAbi.abi, this.props.match.contract_address);
        
        let players: string[] = await contractInstance.methods.getPlayers().call({from: accounts[0]});
        let betValue: string = await contractInstance.methods.getTotalBetValue().call({from: accounts[0]});
        
        this.setState({
            players: players,
            totalBetValue: `${web3utils.fromWei(betValue)} Ether`,
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
    private onBetSubmit(event: FormEvent<HTMLFormElement>): void {
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
        this.state.contract.methods.addPlayer().send({
            from: this.state.account,
            value: wei.toString()
        }).then((result) => {
            this.componentDidMount();
        }, (reason: string) => {
            this.setState({
                sendBetResultMsg: "ERROR: " + reason,
                disableFormSubmit: true,
                isSendingBet: false
            })
        })
    }


    /**
     * Make the currently logged in user win the match
     * This will call 'win()' on the smart contract 
     */
    private makeMeWinner(): void {
        if (this.state.contract === undefined) return;
        let method = this.state.contract.methods.win();
        method.send({from: this.state.account}).then(
            (res) => {
                console.log(res);
            }
        )
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
        }
        else {
            // If we are currently sending a bet, then the button will have a loading spinner
            let loadingElement;
            if (this.state.isSendingBet) {
                loadingElement = <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            }
            
            return (
                <Form onSubmit={(e: FormEvent<HTMLFormElement>) => this.onBetSubmit(e)}>
                    <Form.Group>
                        <Form.Label>You can participate in this match by betting your own ether:</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroupPrepend">ETH</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control type="number" placeholder="Enter bet value here..." required/>
                        </InputGroup>
                        <br/>
                        <Button type="submit" disabled={this.state.disableFormSubmit}>{loadingElement}Submit bet!</Button>
                    </Form.Group>
                </Form>
            );
        }
    }
    
    public render(): any {
        if (this.state.loadingState === LoadingState.Loading) {
            return <LoadingCard text="Loading match data..." show={true}/>
        } else {
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