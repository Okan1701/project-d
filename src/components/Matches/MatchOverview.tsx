import React, {Component} from "react";
import {IMatch, MatchStatusCode, MatchWinningTeam} from "../../data/interfaces";
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
import Swal from "sweetalert2";
import Alert from "react-bootstrap/Alert";

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

    /**
     * Get the name of the host player by gettings its address and checking the teams
     * No database call is made here.
     * @param hostPlayerAddr: the address of the host player
     */
    private getHostPlayerName(hostPlayerAddr: string): string {
        if (this.props.match.contract_data === undefined) return "N/A";

        const allPlayers: IContractPlayer[] = this.props.match.contract_data.homeTeamPlayers.concat(this.props.match.contract_data.awayTeamPlayers);

        for (let i = 0; i < allPlayers.length; i++) {
            if (allPlayers[i].address === hostPlayerAddr) return allPlayers[i].name;
        }

        // if code reaches here, it means it failed to find host player name
        Swal.fire({title: "An error occured!", text: "Failed to load name of host player! Host player is not part of match", type: "error"});
        throw new Error("Failed loading host player name. Host address is not part of any contract team");
    }

    private renderWinningTeamText(winningTeam: MatchWinningTeam): string {
        switch (winningTeam) {
            case MatchWinningTeam.None:
                return "No team has won yet";
            case MatchWinningTeam.HomeTeam:
                return "Home team has won!";
            case MatchWinningTeam.AwayTeam:
                return "Away team has won!";
            case MatchWinningTeam.All:
                return "Both teams have won! (Draw)";
            default:
                return MatchWinningTeam[winningTeam];
        }
    }

    private renderIsArchivedAlert() {
        if (!this.props.match.active) {
            return <Alert variant="secondary">This match is archived</Alert>
        }
    }

    public render() {

        if (this.props.match.sport_event_data === undefined || this.props.match.contract_data === undefined) {
            return <ErrorCard title="Failed to load match!"
                              msg={"An unknown error occured that led to match data being incomplete"} show={true}/>;
        }

        return (
            <Card.Body>
                {this.renderIsArchivedAlert()}
                <h3>{this.props.match.title}</h3>
                <p>Here you can see additional details of this betting match along with options to participate if
                    possible</p>
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <strong>Created by: </strong>{this.getHostPlayerName(this.props.match.owner)}<br/>
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
                                <strong>Status: </strong>{MatchStatusCode[this.props.match.status_code]}<br/>
                                <strong>Winning team: </strong>{this.renderWinningTeamText(this.props.match.winning_team)}
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