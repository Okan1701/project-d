import React, {Component} from "react";
import LoadingCard from "./LoadingCard";
import rouletteContractAbi from "../contracts/RouletteContract";
import * as database from "../database";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import * as web3utils from 'web3-utils';
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

class MatchOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingState: 0,
            totalBetValue: null,
            players: null,
            contract: null,
            account: null,
            isSendingBet: false,
            disableFormSubmit: false,
            sendBetResultMsg: ""
        }
    }

    componentDidMount() {
        console.log("Address: " + this.props.match.contract_address);
        this.props.web3.eth.getAccounts().then((accounts) => {
            // Get the specific contract instance that belongs to this match using its address
            const contractInstance = new this.props.web3.eth.Contract(rouletteContractAbi.abi, this.props.match.contract_address);

            // Call the getPlayers() of the contract.
            // Last parameter is the callback function when done
            contractInstance.methods.getPlayers().call({from: accounts[0]}).then((result) => {
                console.log("players: " + result);
                this.setState({players: result});

                // Call the getTotalBetValue() of the contract.
                // Last parameter is the callback function when done
                contractInstance.methods.getTotalBetValue().call({from: accounts[0]}).then((result) => {
                    console.log("bet value: " + result);
                    this.setState({
                        totalBetValue: `${web3utils.fromWei(result)} Ether`,

                        // Store some stuff that we'll need later
                        contract: contractInstance,
                        account: accounts[0],
                        loadingState: 1
                    });
                });
            });

        });

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        /*
        componentDidMount is apparently not called again when user chooses a new match in MatchesArea. 
        So we have to manually check each component update and call componentDidMount ourselves if needed.
         */
        if (prevProps.match.id !== this.props.match.id) {
            this.setState({loadingState: 0}); // Display loading screen again!
            this.componentDidMount();
        }
    }

    onBetSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        // Prevent user from submitting again
        this.setState({
            isSendingBet: true,
            disableFormSubmit: true
        });

        // The bet value that was entered in the form
        const betValue = event.target[0].value;
        // Convert the bet value into wei which is used for the contract
        const wei = web3utils.toWei(event.target[0].value);

        // Get the addPlayer method ref and send a transaction to it
        this.state.contract.methods.addPlayer().send({
            from: this.state.account,
            value: wei
        }).then((result) => {
            this.componentDidMount();
        }, (reason) => {
            this.setState({
                sendBetResultMsg: "ERROR: " + reason,
                disableFormSubmit: true,
                isSendingBet: false
            })
        })
    }

    makeMeWinner() {
        let method = this.state.contract.methods.win();
        method.send({from: this.state.account}).then(
            (res) => {
                console.log(res);
            }
        )
    }
    
    displayForm() {
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
                <Form onSubmit={(e) => this.onBetSubmit(e)}>
                    <Form.Group>
                        <Form.Label>You can participate in this match by betting your own ether:</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="inputGroupPrepend">ETH</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control type="number" placeholder="Enter bet value here..." required/>
                        </InputGroup>
                        <br/>
                        <Button type="submit" disabled={this.state.disableFormSubmit === true}>{loadingElement}Submit bet!</Button>
                    </Form.Group>
                </Form>
            );
        }
    }
    
    render() {
        if (this.state.loadingState === 0) {
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