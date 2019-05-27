import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import {getPlayer} from "../data/database";
import * as web3utils from 'web3-utils';
import Web3 from "web3";
import {IPlayer} from "../data/interfaces";

interface IState {
    player: IPlayer,
    loaded: boolean
}

interface IProps {
    web3: Web3
}

class ProfileAreaComponent extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            player: {
                address: "Loading...",
                name: "Loading...",
                wins: 0,
                losses: 0,
                earnings: 0
            },
            loaded: false
        };
    }

    public componentDidMount(): void {
        this.loadProfile().catch((e: Error) => alert(e));
    }

    private async loadProfile(): Promise<void> {
        let accounts: string[] = await this.props.web3.eth.getAccounts();
        let player: IPlayer = await getPlayer(accounts[0]);

        this.setState({player: player, loaded: true});
    }

    private renderEarnings() {
        let earningsTxt = web3utils.fromWei(this.state.player.earnings.toString());

        if (this.state.player.earnings >= 0) {
            earningsTxt = "+ " + earningsTxt;
            return <p className="text-success">Earnings: {earningsTxt} Ether</p>
        } else {
            return <p className="text-danger">Earnings: {earningsTxt} Ether</p>
        }

    }

    public render() {
        if (this.state.loaded) {
            return (
                <Card>
                    <Card.Header>Profile</Card.Header>
                    <Card.Body>
                        <Card.Title>{this.state.player.name}</Card.Title>
                        <strong>Statistics:</strong><br/><br/>
                        <p>Wins: {this.state.player.wins}</p>
                        <p>Losses: {this.state.player.losses}</p>
                        {this.renderEarnings()}
                    </Card.Body>
                </Card>
            );
        } else {
            return <strong>Loading...</strong>;
        }
    }
}

export default ProfileAreaComponent;