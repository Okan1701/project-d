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
import PopUpComponent from "../Misc/PopUpComponent";
import {IMatch, ISportEvent} from "../../data/interfaces";


const abi: any = require("../../contracts/RouletteContract");

interface IState {
    onCreate: boolean,
    isCreating: boolean,
}

interface IProps {
    web3: Web3,
    sportEvent: ISportEvent,
    show?: boolean
}

class MatchCreateForm extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            onCreate: false,
            isCreating: false,
        };
        this.closePopup = this.closePopup.bind(this);
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
        const wei: BN = web3utils.toWei(form[1].value);
        const title: string = form[0].value;

        this.createMatch(title, wei).then(
            () => console.log("Match has been created!"),
            (reason: string) => {
                alert(reason);
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
     */
    private async createMatch(title: string, wei: BN): Promise<void> {

        // Get the user accounts that are available in MetaMask
        const accounts: string[] = await this.props.web3.eth.getAccounts();
        // Create the contract object that we will use to deploy and interact with the contract
        const contract = new this.props.web3.eth.Contract(abi.abi);

        // Deploy a new instance of the contract and send a transaction to it containing the bet value
        // The new instance will be stored in contractInstance
        let tx: any = contract.deploy({data: abi.bytecode, arguments: []});
        let contractInstance: Contract = await tx.send({
            from: accounts[0], // Account of the sender
            value: wei.toString() // The bet value in wei
        });

        // Create a new match entry in the database
        let match: IMatch = {
            title: title,
            contract_address: contractInstance.options.address,
            start_date: "2019-05-05",
            end_date: "2019-05-05",
            active: true
        };
        await database.createMatchEntry(match);
        this.setState({onCreate: true, isCreating: false});

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

    /**
     * Hides the confirmation popup that is shown when match is created
     * This is done by setting onCreate of the state to false
     */
    public closePopup(): void {
        this.setState({onCreate: false})
    }

    public render(): React.ReactNode {
        if (!this.props.show) return null;

        return <div>

            <PopUpComponent title="Confirmation" message="Your match has been created!" onClose={this.closePopup}
                            show={this.state.onCreate}/>
            <Card>
                <Card.Body>
                    <Card.Title>Enter new match details</Card.Title>
                    <strong>Selected sport: </strong>{`${this.props.sportEvent.strEvent} (${this.props.sportEvent.dateEvent} ${this.props.sportEvent.strTime})`}
                    <br/><br/>
                    <Form onSubmit={(e: FormEvent<HTMLFormElement>) => this.onSubmit(e)}>
                        <Form.Group>
                            <Form.Label>Match Title:</Form.Label>
                            <Form.Control type="text" placeholder="Enter match title here..." required/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Your bet</Form.Label>
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
                    </Form>
                </Card.Body>
            </Card>
        </div>;
    }
}

export default MatchCreateForm;
