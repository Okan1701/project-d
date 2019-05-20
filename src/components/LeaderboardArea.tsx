import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import LoadingCard from "./LoadingCard";
import * as database from "../data/database";
import {IPlayer} from "../data/interfaces";

enum SortMode {
    ByWins = "by wins",
    ByLosses = "by losses",
    ByEarnings = "by earnings"
}

interface IState {
    isLoading: boolean,
    players: IPlayer[],
    sortTitle: string
}

interface IProps {
}

class LeaderboardArea extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
            players: [],
            sortTitle: SortMode.ByWins
        };
    }

    public componentDidMount(): void {
        this.populateTable(SortMode.ByWins).catch((e: Error) => alert(e));
    }

    /**
     * Get all the players from backend, sort it depending on the input and then update state
     * It is called by the onClick event of the 'sort by' buttons at the top of the table
     * @param sortMode: enum value that controls how the data will be sorted
     */
    private async populateTable(sortMode: SortMode): Promise<void> {
        this.setState({isLoading: true});

        let players: IPlayer[] = await database.getAllPlayers();

        // See: https://www.w3schools.com/js/js_array_sort.asp for more info about sorting function
        switch (sortMode) {
            case SortMode.ByWins:
                players.sort(function (p: IPlayer, b: IPlayer) {
                    return b.wins - p.wins
                });
                break;
            case SortMode.ByLosses:
                players.sort(function (p: IPlayer, b: IPlayer) {
                    return b.losses - p.losses
                });
                break;
            case SortMode.ByEarnings:
                players.sort(function (p: IPlayer, b: IPlayer) {
                    return b.earnings - p.earnings
                });
                break;
        }
        this.setState({
            isLoading: false,
            players: players,
            sortTitle: sortMode
        });
    }

    /**
     * Renders the leaderboard table containing the data.
     * If the component is still loading data, we will display a loadingcard instead
     */
    private renderTable() {
        if (this.state.isLoading) {
            return <LoadingCard text={"Loading leaderboard data..."} show={true}/>;
        }

        return (
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Username</th>
                    <th>Wins</th>
                    <th>Losses</th>
                    <th>Earnings</th>
                </tr>
                </thead>
                <tbody>
                {this.state.players.map((player: IPlayer) => (
                    <tr>
                        <td>{player.name}</td>
                        <td>{player.wins}</td>
                        <td>{player.losses}</td>
                        <td>{player.earnings}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        );
    }

    public render() {
        return (
            <div>
                <h1>Leaderboard</h1>
                <hr/>
                <p>On this page, you can access the online leaderboard where you can see the top players per score
                    type!</p>
                <Card>
                    <Card.Header>Leaderboard</Card.Header>
                    <Card.Body>
                        <Card.Title>Top players {this.state.sortTitle}</Card.Title>
                        <div className="d-flex flex-column">
                            <ButtonGroup>
                                <Button
                                    onClick={() => this.populateTable(SortMode.ByWins).catch((e: Error) => alert(e))}>Sort
                                    by wins</Button>
                                <Button
                                    onClick={() => this.populateTable(SortMode.ByLosses).catch((e: Error) => alert(e))}>Sort
                                    by losses</Button>
                                <Button
                                    onClick={() => this.populateTable(SortMode.ByEarnings).catch((e: Error) => alert(e))}>Sort
                                    by earnings</Button>
                            </ButtonGroup>
                        </div>
                        <br/>
                        {this.renderTable()}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default LeaderboardArea;