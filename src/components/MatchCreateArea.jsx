import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {FormGroup} from "react-bootstrap";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import abi from "../contracts/RouletteContract";
import web3 from "web3";
import * as web3utils from 'web3-utils';
import * as database from "../database";

class MatchCreateArea extends Component {

    onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        const wei = web3utils.toWei(event.target[1].value);
        const title = event.target[0].value;

        console.log("Deploying");
        console.log(event.target);
        console.log(wei);
        this.props.web3.eth.getAccounts().then((accounts) => {
            const contract = new this.props.web3.eth.Contract(abi.abi);
            contract.deploy({data: abi.bytecode}).send({
                from: accounts[0],
                value: wei
            }).then((contract) => {
                console.log(contract);
                database.createMatchEntry({
                    title: title,
                    contract_address: contract.options.address,
                    start_date: "2019-05-05",
                    end_date: "2019-05-05"
                }).then((res) => {
                    if (res === true) {
                        console.log("Saved to database!");
                    } else {
                        console.log("Failed to save to database!");
                    }
                })
            })

        });
    }

    render() {
        return (
            <div>
                <h1>Match creation</h1>
                <hr/>
                <p>On this page, you can create a new betting match that other players can participate in!
                </p>
                <Card>
                    <Card.Body>
                        <Card.Title>Enter new match details</Card.Title>
                        <Form onSubmit={(e) => this.onSubmit(e)}>
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
                                    <Form.Control type="number" placeholder="Enter bet value here..." required/>
                                </InputGroup>
                            </Form.Group>
                            <p>Once you have created the match, other users will be able to see it and even participate
                                in it with their own ether!</p>
                            <Button type="submit">Create</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default MatchCreateArea;