import React, {Component, FormEvent} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Web3 from "web3";
import * as web3utils from 'web3-utils';
import * as database from "../../data/database";
import BN from "bn.js";
import Contract from "web3/eth/contract";
import Spinner from "react-bootstrap/Spinner";
import {IMatch, ISportEvent, MatchStatusCode, MatchWinningTeam} from "../../data/interfaces";
import Alert from 'sweetalert2'


const abi: any = require("../../contracts/RouletteContract");

interface IState {
    isCreating: boolean,
    contract?: Contract,
    account: string,
}

interface IProps {
    web3: Web3,
    sportEvent: ISportEvent,
    onReturnClick?: () => void
    show?: boolean
}

class MatchCreateForm extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isCreating: false,
            account: "",
            contract: undefined,
        };
    }

    /**
     *   This method is run when user clicks on 'Create' button
     *   This will handle form input and create a new match
     *   @param event: The html form event
     */
    private onSubmit(event: FormEvent<HTMLFormElement>): void {
        const form: EventTarget = event.target;
        event.preventDefault();
        event.stopPropagation();

        // Make sure the button is disabled and showing loading icon
        this.setState({isCreating: true});


        // Get the ether that the user inputted and convert to wei
        const wei: BN = web3utils.toWei(form[2].value);
        const team: number = form[1].value;
        const title: string = form[0].value;

        this.createMatch(title, wei, team).then(
            () => console.log("Match has been created!"),
            (e: Error) => {
                Alert.fire({title: e.name, text: e.message, type: "error", confirmButtonText: "Ok"});
                this.setState({isCreating: false});
            }
        )
    }

    /**
     *  This will use the form input to create a new match
     *  First it will get the current account that is logged in and from there it will create a new smart contract
     *  Details of the contract will also be saved to database
     *  @param title: The name of the match. Will be saved to db
     *  @param wei: The amount of ether in 'wei' format
     *  @param selectedTeam: the team that the user selected 0 = home team, 1 = away team
     */
    private async createMatch(title: string, wei: BN, selectedTeam: number): Promise<void> {
        // Get the user accounts that are available in MetaMask
        const accounts: string[] = await this.props.web3.eth.getAccounts();
        // Create the contract object that we will use to deploy and interact with the contract
        const contract = new this.props.web3.eth.Contract(abi.abi);

        // Deploy a new instance of the contract and send a transaction to it containing the bet value
        // The new instance will be stored in contractInstance
        let tx: any = contract.deploy({data: abi.bytecode,arguments: [selectedTeam]});
        let contractInstance: Contract = await tx.send({
            from: accounts[0], // Account of the sender
            value: wei.toString() // The bet value in wei
        });

/*      let method = contract.methods.bet(1);
      await method.send({
        from: accounts[0],
        value: wei.toString()
      });*/

        let date: Date = new Date();
        let formattedDate: string = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}`;
        console.log(formattedDate);

        // Create a new match entry in the database
        let match: IMatch = {
            title: title,
            contract_address: contractInstance.options.address,
            start_date: formattedDate,
            active: true,
            sport_event_id: this.props.sportEvent.idEvent,
            status_code: MatchStatusCode.WaitingForMatchDate,
            winning_team: MatchWinningTeam.None
        };
        await database.createMatchEntry(match);
        this.setState({isCreating: false});
        // noinspection JSIgnoredPromiseFromCall
        Alert.fire({title: "Done!", text: "Match has been sucesfully created!", type: "success", confirmButtonText: "Ok"});

    }

    private createLoadingSpinner() {
        if (this.state.isCreating) {
            return (
                <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                />
            );
        }
        return null;
    }

    public render(): React.ReactNode {
        if (!this.props.show) return null;

        return <div>
            <Card>
                <Card.Body>
                    <Card.Title>Enter new match details</Card.Title>
                    <strong>Selected
                        sport: </strong>{`${this.props.sportEvent.strEvent} (${this.props.sportEvent.dateEvent} ${this.props.sportEvent.strTime})`}
                    <br/><br/>
                    <Form onSubmit={(e: FormEvent<HTMLFormElement>) => this.onSubmit(e)}>
                        <Form.Group>
                            <Form.Label>Match Title:</Form.Label>
                            <Form.Control type="text" placeholder="Enter match title here..." required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Select Team:</Form.Label>
                          
                            <Form.Control as="select">
                              <option value={0}>{this.props.sportEvent.strHomeTeam}</option>
                              <option value={1}>{this.props.sportEvent.strAwayTeam}</option>
                            </Form.Control>
                            <Form.Label>Your bet</Form.Label>
                        </Form.Group>
                      <Form.Group>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="inputGroupPrepend">ETH</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="double" placeholder="Enter bet value here..." pattern="(^-?[0-9.]+)"
                                              required/>
                            </InputGroup>
                        </Form.Group>
                        <p>Once you have created the match, other users will be able to see it and even participate
                            in it with their own ether!</p>
                            <Button type="submit"
                                    disabled={this.state.isCreating}>{this.createLoadingSpinner()} Create</Button>
                            <Button variant="light" style={{marginLeft: "10px"}} onClick={this.props.onReturnClick}>Select another match</Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>;
    }
}

export default MatchCreateForm;
