import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Web3 from "web3";
import * as sports from "../../data/sports";
import {ISportEvent} from "../../data/interfaces";
import ErrorCard from "../Misc/ErrorCard";
import LoadingCard from "../Misc/LoadingCard";
import MatchCreateSportsList from "./MatchCreateSportsList";


enum DisplayState {
    Loading,
    SportsList,
    CreateForm,
    Error
}

interface IState {
    displayState: DisplayState,
    sportEvents: ISportEvent[]
}

interface IProps {
    web3: Web3
}

class MatchCreateArea extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            displayState: DisplayState.Loading,
            sportEvents: []
        };
    }

    public componentDidMount(): void {
        let dateRangeStart = new Date();
        let dateRangeEnd = new Date();
        dateRangeEnd.setDate(dateRangeStart.getDate() + 7);

        sports.getEventsFromDateRange(dateRangeStart, dateRangeEnd).then(
            (events: ISportEvent[]) => {
                this.setState({
                    displayState: DisplayState.SportsList,
                    sportEvents: events
                });
            },
            (e: Error) => {
                alert(e);
                this.setState({
                    displayState: DisplayState.Error
                });
            }
        );
    }

    public render() {
        return (
            <div>
                <h1>Match creation</h1>
                <hr/>
                <p>On this page, you can create a new betting match that other players can participate in! First you will need to select the sport event that you want to start a new bet on.
                    From there you can define your starting bet. Once the date of the sport event has passed, the winners will recieve their rewards.
                </p>
                <ErrorCard title="Error!" msg="An error has occured while proccesing your request. Please try again later!" show={this.state.displayState === DisplayState.Error}/>
                <LoadingCard text={"Loading data, please wait..."} show={this.state.displayState === DisplayState.Loading}/>
                <MatchCreateSportsList sportEvents={this.state.sportEvents} display={this.state.displayState === DisplayState.SportsList}/>
            </div>
        );
    }
}

export default MatchCreateArea