import React, {Component} from "react";
import MainArea from "./MainArea";
import {Route, Router, Switch} from "react-router-dom";
import MatchCreateArea from "./MatchCreateArea";
import MatchesArea from "./MatchesArea";

class Routing extends Component {
    render() {
        return (
            <div className="page-content">
                <Switch>
                    <Route exact path="/" render={() => <MainArea web3={this.props.web3} />}/>
                    <Route path="/matches" render={() => <MatchesArea web3={this.props.web3} />}/>
                    <Route path="/create" render={() => <MatchCreateArea web3={this.props.web3} />}/>
                </Switch>
            </div>
        );
    }
}

export default Routing;