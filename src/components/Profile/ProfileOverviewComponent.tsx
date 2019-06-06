import React, {Component} from "react";
import {IPlayer} from "../../data/interfaces";
import Web3 from "web3";
import * as web3utils from "web3-utils";
import Card from "react-bootstrap/Card";

interface IProps {
    web3: Web3
    player: IPlayer
}

class ProfileOverviewComponent extends Component<IProps> {

    /**
     * Take the player earnings from props and format it nicely
     * Example: "- 3.5 Ether" or "+ 5.67 Ether"
     */
    private renderEarnings() {
        let earningsTxt = web3utils.fromWei(this.props.player.earnings.toString());

        if (this.props.player.earnings >= 0) {
            earningsTxt = "+ " + earningsTxt;
            return <p className="text-success">Earnings: {earningsTxt} Ether</p>
        } else {
            return <p className="text-danger">Earnings: {earningsTxt} Ether</p>
        }

    }
    
    public render() {
        return (
            <Card.Body>
                <Card.Title>{this.props.player.name}</Card.Title>
                <strong>Statistics:</strong><br/><br/>
                <p>Wins: {this.props.player.wins}</p>
                <p>Losses: {this.props.player.losses}</p>
                {this.renderEarnings()}
            </Card.Body>
        );
    }
}

export default ProfileOverviewComponent;