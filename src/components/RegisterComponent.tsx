import React, {Component, FormEvent} from "react";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import * as database from "../data/database";
import {IPlayer} from "../data/interfaces";
import Alert from 'sweetalert2'

interface IState {
    showInfo: boolean
}

interface IProps {
    accounts: string[],
    onRegisteredCallback: () => void
}

class RegisterComponent extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            showInfo: true
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    /**
     * Called when the user submits the registration form
     * It will handle the input and create a new player record in the backend database
     * @param event: FormEvent that is created by the HTML onClick
     */
    private onFormSubmit(event: FormEvent<HTMLFormElement>): void {
        // Stop default behavior
        event.preventDefault();
        event.stopPropagation();

        // Get the input from form
        const form: EventTarget = event.target;
        const inputName: string = form[0].value;
        const inputPassword: string = form[1].value;
        const inputPasswordRepeat: string = form[2].value;

        // Check if user repeated the password correctly
        if (inputPassword !== inputPasswordRepeat) {
            Alert.fire({
                title: "Invalid password!",
                text: "The passwords that you entered do not match!",
                type: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }

        // Register the new user
        const player: IPlayer = {
            address: this.props.accounts[0],
            name: inputName,
            wins: 0,
            game_count: 0,
            earnings: 0
        };
        database.registerPlayer(player).then(
            () => {
                Alert.fire({
                    title: 'Success!',
                    text: "Your account has been successfully created!",
                    type: 'success',
                    confirmButtonText: 'Ok'
                }).then(() => {
                    this.props.onRegisteredCallback();
                })

            },
            (e: Error) => {
                Alert.fire({
                    title: e.name,
                    text: e.message,
                    type: 'error',
                    confirmButtonText: 'Ok'
                });
                console.log(e);
            }
        );
    }


    /**
     * This will render the information portion of the registratrion phase
     * It will show some info to the user about making an account
     */
    private renderInfo() {
        return (<div className="register-form">
                <Card>
                    <Card.Body>
                        <Card.Title>Welcome!</Card.Title>
                        <p>
                            The current ethereum account that you have selected in MetaMask is not associated with an
                            Easybet profile.
                            In order to use this website, you must create a Easybet profile that consist of a profile
                            name and password
                        </p>
                        <strong>This profile account is needed for the following:</strong><br/>
                        <ul>
                            <li>Create and view betting matches</li>
                            <li>Participate in other matches</li>
                            <li>View the online leaderboard</li>
                        </ul>
                        <br/>
                        <strong>Please keep in mind that the following information will be visible to other players
                            through the leaderboards:</strong>
                        <ul>
                            <li>The amount of ether that you have won in total through matches</li>
                            <li>The amount of lost bets</li>
                            <li>The amount of won bets</li>
                        </ul>
                        <br/>
                        <p>If you agree to the above, please click 'Continue'</p>
                        <Button onClick={() => this.setState({showInfo: false})}>Continue</Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    /**
     * Display the registration form. This is displayed after the user has clicked continue in the info portion
     */
    private renderForm() {
        return (
            <div className="register-form">
                <Card>
                    <Card.Body>
                        <Card.Title>Registration</Card.Title>
                        <p>Please fill in the following form in order to register!</p>
                        <strong>Your address: </strong>{this.props.accounts[0]}
                        <br/><br/>
                        <Form onSubmit={this.onFormSubmit}>
                            <Form.Group>
                                <Form.Label>Profile name</Form.Label>
                                <Form.Control placeholder="Enter profile name here..."/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter password here..."/>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Repeat your password here</Form.Label>
                                <Form.Control type="password" placeholder="Repeat your password here..."/>
                            </Form.Group>
                            <ButtonGroup>
                                <Button onClick={() => this.setState({showInfo: true})}>Go back</Button>
                                <Button type="submit">Register</Button>
                            </ButtonGroup>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        );
    }

    public render() {
        if (this.state.showInfo) {
            return this.renderInfo()
        } else {
            return this.renderForm();
        }
    }
}

export default RegisterComponent;