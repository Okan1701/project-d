import React, {Component} from "react";
import MainArea from "./MainArea";
import {Route, Router, Switch} from "react-router-dom";
import MatchCreateArea from "./MatchCreateArea";

class Routing extends Component {
    render() {
        return (
            <div className="page-content">
                <Switch>
                    <Route exact path="/" render={(props) => <MainArea web3={this.props.web3} />}/>
                    <Route path="/create" render={(props) => <MatchCreateArea web3={this.props.web3} />}/>
                </Switch>
            </div>
        );
    }
}

export default Routing;