import React, {Component} from "react";
import {IMatch, MatchStatusCode, MatchWinningTeam} from "../../data/interfaces";
import Button from "react-bootstrap/Button";
import * as database from "../../data/database";
import Alert from "sweetalert2";

interface IProps {
    match: IMatch
    refreshMatchFn: (m: IMatch) => void
}

class MatchDebugOptions extends Component<IProps, any> {

    private async makeTeamWin(team: MatchWinningTeam) {
        this.props.match.winning_team = team;
        this.props.match.status_code = MatchStatusCode.CanClaimRewards;
        this.props.match.active = false;
        await database.updateMatch(this.props.match);
        await Alert.fire({
            title: "Done!",
            text: MatchWinningTeam[team] + " is now the winner!",
            type: "success"
        });
        this.props.refreshMatchFn(this.props.match);

    }

    public render() {
        if (this.props.match.status_code === MatchStatusCode.WaitingForMatchDate) {
            return (
                <div>
                    <strong>Debug options:</strong>
                    <br/>
                    <Button onClick={() => this.makeTeamWin(MatchWinningTeam.HomeTeam)}>Make home team win</Button>
                    <Button onClick={() => this.makeTeamWin(MatchWinningTeam.AwayTeam)} style={{marginLeft: "10px"}}>Make away team win</Button>
                    <Button onClick={() => this.makeTeamWin(MatchWinningTeam.All)} style={{marginLeft: "10px"}}>Make all teams win</Button>
                </div>
            );
        }
        return null;
    }
}

export default MatchDebugOptions;