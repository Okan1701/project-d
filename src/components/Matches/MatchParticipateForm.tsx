import React, {Component, FormEvent} from "react";
import {IMatch, MatchStatusCode} from "../../data/interfaces";
import Alert from 'sweetalert2'
import Web3 from "web3";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import * as web3utils from 'web3-utils';
import Spinner from "react-bootstrap/Spinner";

const rouletteContractAbi = require("../../contracts/RouletteContract");

interface IState {
    address: string,
    isLoading: boolean,
    isSendingBet: boolean
}

interface IProps {
    match: IMatch,
    web3: Web3,
    refreshMatchFn: (m: IMatch) => void
}

class MatchParticipateForm extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            address: "N/A",
            isLoading: true,
            isSendingBet: false
        }
    }

    /**
     * Check if the player is part of the match by comparing its address with the participents
     * If address is found within the home players team and away players team then player is part of match
     * @param addr: the address of the player that we wanna check if its part of match
     * @returns true if part of match, otherwise false
     */
    private matchContainsPlayer(addr: string): boolean {
        if (this.props.match.contract_data === undefined) {
            Alert.fire({
                title: "Error!",
                text: "Contract data object of match was undefined!",
                type: "error"
            });
            return false;
        }

        const homePlayers: IContractPlayer[] = this.props.match.contract_data.homeTeamPlayers;
        const awayPlayers: IContractPlayer[] = this.props.match.contract_data.awayTeamPlayers;
        for (let i = 0; i < awayPlayers.length; i++) {
            if (awayPlayers[i].address === addr) return true;
        }
        for (let i = 0; i < homePlayers.length; i++) {
            if (homePlayers[i].address === addr) return true;
        }
        return false;

    }

    /**
     * Called when user clicks on the Submit button
     * This will submit the entered bet amount
     * @param event: Form submit event containing the form and input
     */
    private async onBetSubmit(event: FormEvent<HTMLFormElement>) {
        // isSendingBet flag will disable the submit button
        this.setState({isSendingBet: true});

        const form: EventTarget = event.target;

        // Prevent default behavior
        event.preventDefault();
        event.stopPropagation();

        // The bet value that was entered in the form
        const selectedTeam: number = form[0].value;
        const betValue: string = form[1].value;
        const wei: string = web3utils.toWei(betValue);

        // Get the specific contract instance that belongs to this match using its address
        const contractInstance: any = new this.props.web3.eth.Contract(rouletteContractAbi.abi, this.props.match.contract_address);

        // Get the bet method and send a transaction to it
        let method = contractInstance.methods.bet(selectedTeam);
        await method.send({
            from: this.state.address,
            value: wei.toString()
        });


        await Alert.fire({title: "Done!", text: "Your bet has been succesfully submitted!", type: "success"});
        this.setState({isSendingBet: false});
        this.props.refreshMatchFn(this.props.match);
    }

    private async onBetSubmitFailed(e: Error): Promise<void> {
        await Alert.fire({title: e.name, text: e.message, type:"error"});
        this.setState({isSendingBet: false});
    }

    private renderSubmitBtn() {
        if (this.state.isSendingBet) {
            return <Button type="submit" disabled><Spinner as="span" animation="grow" size="sm" role="status"
                                                           aria-hidden="true"/> Submitting bet...</Button>;
        } else {
            return <Button type="submit">Submit bet</Button>;
        }
    }

    public componentDidMount(): void {
        this.props.web3.eth.getAccounts().then(
            (res: string[]) => this.setState({
                address: res[0],
                isLoading: false
            }),
            (e: Error) => Alert.fire({
                title: e.name,
                text: e.message,
                type: "error"
            })
        );
    }

    public render() {
        if (this.props.match.sport_event_data === undefined) {
            Alert.fire({
                title: "Error!",
                text: "Sport data is undefined!",
                type: "error"
            });
            return;
        }

        if (this.state.isLoading) return <strong>Loading form...</strong>;

        if (this.matchContainsPlayer(this.state.address)) return <div className="font-italic">You are already part of
            this match!</div>;

        if (this.props.match.status_code !== MatchStatusCode.WaitingForMatchDate) {
            return <div className="font-italic">This matches is now closed for new participants!</div>;
        }

        return (
            <Form onSubmit={(e: FormEvent<HTMLFormElement>) => this.onBetSubmit(e).catch((e: Error) => this.onBetSubmitFailed(e))}>
                <Form.Group>
                    <Form.Label>You can participate in this match by betting your own ether:</Form.Label>
                    <Form.Control as="select">
                        <option value={0}>{this.props.match.sport_event_data.strHomeTeam + " (Home team)"}</option>
                        <option value={1}>{this.props.match.sport_event_data.strAwayTeam + " (Away team)"}</option>
                    </Form.Control><br/>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroupPrepend">ETH</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control type="number" placeholder="Enter bet value here..." required/>
                    </InputGroup>
                    <br/>
                    {this.renderSubmitBtn()}
                </Form.Group>
            </Form>
        );

    }

}

export default MatchParticipateForm