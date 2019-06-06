import React, {Component} from "react";
import MainArea from "./MainArea";
import {Route, Switch} from "react-router-dom";
import MatchCreateAreaLegacy from "./MatchCreate/MatchCreateAreaLegacy";
import MatchesArea from "./Matches/MatchesArea";
import Web3 from "web3";
import ProfileAreaComponent from "./Profile/ProfileAreaComponent";
import LeaderboardArea from "./LeaderboardArea";
import {IPlayer} from "../data/interfaces";
import MatchCreateArea from "./MatchCreate/MatchCreateArea";

interface IProps {
    web3: Web3,
    player: IPlayer
}

class Routing extends Component<IProps, any> {
    public render(): any {
        return (
            <div className="page-content">
                <Switch>
                    <Route exact path="/" render={() => <MainArea web3={this.props.web3} />}/>
                    <Route path="/matches" render={() => <MatchesArea web3={this.props.web3} />}/>
                    <Route path="/create" render={() => <MatchCreateArea web3={this.props.web3}/>}/>
                    <Route path="/createold" render={() => <MatchCreateAreaLegacy web3={this.props.web3} />}/>
                    <Route path="/profile" render={() => <ProfileAreaComponent web3={this.props.web3}/>}/>
                    <Route path="/leaderboard" render={() => <LeaderboardArea/>}/>
                </Switch>
            </div>
        );
    }
}

export default Routing;