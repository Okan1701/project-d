import React, {Component} from "react";
import {IMatch, MatchStatusCode} from "../../data/interfaces";
import Card from "react-bootstrap/Card";
import ErrorCard from "../Misc/ErrorCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import * as web3utils from 'web3-utils';
import Web3 from "web3";
import MatchParticipateForm from "./MatchParticipateForm";
import MatchDebugOptions from "./MatchDebugOptions";
import MatchClaimReward from "./MatchClaimReward";

interface IProps {
    match: IMatch,
    web3: Web3
    refreshMatchFn: (m: IMatch) => void
}

class MatchOverview extends Component<IProps, any> {

    private renderPlayerTable(caption: string, players: IContractPlayer[]) {
        let rows = players.map((player: IContractPlayer) => (
            <tr>
                <td>{player.name}</td>
                <td>{web3utils.fromWei(player.betValue.toString()) + " Ether"}</td>
            </tr>
        ));

        return (
            <Table>
                <caption>{caption}</caption>
                <thead>
                <tr>
                    <th>Player Name</th>
                    <th>Bet value</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </Table>
        );
    }

    private renderUserOptions() {
        switch (this.props.match.status_code) {
            case MatchStatusCode.WaitingForMatchDate:
                return <MatchParticipateForm match={this.props.match} web3={this.props.web3} refreshMatchFn={this.props.refreshMatchFn}/>;
            case MatchStatusCode.CanClaimRewards:
                return <MatchClaimReward web3={this.props.web3} match={this.props.match} refreshMatchFn={this.props.refreshMatchFn}/>
            default:
                return <MatchParticipateForm match={this.props.match} web3={this.props.web3} refreshMatchFn={this.props.refreshMatchFn}/>;
        }
    }

    public render() {

        if (this.props.match.sport_event_data === undefined || this.props.match.contract_data === undefined) {
            return <ErrorCard title="Failed to load match!"
                              msg={"An unknown error occured that led to match data being incomplete"} show={true}/>;
        }

        return (
            <Card.Body>
                <h3>{this.props.match.title}</h3>
                <p>Here you can see additional details of this betting match along with options to participate if
                    possible</p>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <strong>Created on: </strong>{this.props.match.start_date}<br/>
                                <strong>Sport event: </strong>{this.props.match.sport_event_data.strEvent}<br/>
                                <strong>End
                                    date: </strong>{this.props.match.sport_event_data.dateEvent + " " + this.props.match.sport_event_data.strTime}
                            </Card.Body>
                        </Card>
                        <br/>
                        {this.renderPlayerTable(this.props.match.sport_event_data.strHomeTeam, this.props.match.contract_data.homeTeamPlayers)}
                    </Col>
                    <Col>
                        <Card>
                            <Card.Body>
                                <strong>Total players: </strong>{this.props.match.contract_data.playerCount}<br/>
                                <strong>Total bet value: </strong>{this.props.match.contract_data.totalBetValue}<br/>
                                <strong>Status: </strong>{MatchStatusCode[this.props.match.status_code]}
                            </Card.Body>
                        </Card>
                        <br/>
                        {this.renderPlayerTable(this.props.match.sport_event_data.strAwayTeam, this.props.match.contract_data.awayTeamPlayers)}
                    </Col>
                </Row>
                <hr/>
                {this.renderUserOptions()}
                <hr/>
                <MatchDebugOptions match={this.props.match} refreshMatchFn={this.props.refreshMatchFn} />
            </Card.Body>
        );
    }
}

export default MatchOverview;