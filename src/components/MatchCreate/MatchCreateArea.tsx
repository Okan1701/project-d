import React, {Component} from "react";
import Web3 from "web3";
import * as sports from "../../data/sports";
import {ISportEvent} from "../../data/interfaces";
import ErrorCard from "../Misc/ErrorCard";
import LoadingCard from "../Misc/LoadingCard";
import MatchCreateSportsList from "./MatchCreateSportsList";
import MatchCreateForm from "./MatchCreateForm";
import {PaginatedArray} from "../../utils";


enum DisplayState {
    Loading,
    SportsList,
    CreateForm,
    Error
}

interface IState {
    displayState: DisplayState,
    sportEvents: ISportEvent[],
    selectedSportEvent?: ISportEvent
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

    /**
     * Handles the event when user selects a sport event. The specific event will be saved to state.
     * We will then show the match creation form to the user so that a match can be created from that specific sport event
     * This function will be passed as props to the component MatchCreateSportsList as that handles the sports list
     * @param event: the sport event object that represented the row that was clicked
     */
    private onSportEventSelected(event: ISportEvent): void {
        this.setState({
            displayState: DisplayState.CreateForm,
            selectedSportEvent: event
        });
    }

    public componentDidMount(): void {
        let dateRangeStart = new Date();
        let dateRangeEnd = new Date();
        // The date range will be 7 days
        dateRangeEnd.setDate(dateRangeStart.getDate() + 7);

        // Get all the sport events from the specified date range
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
        // Only include the MatchCreateForm component if selectedSportEvent is actually defined. Else we get error :(
        let createForm;
        if (this.state.selectedSportEvent !== undefined) {
            createForm = <MatchCreateForm web3={this.props.web3} sportEvent={this.state.selectedSportEvent as ISportEvent} show={true}/>
        }

        return (
            <div>
                <h1>Match creation</h1>
                <hr/>
                <p>On this page, you can create a new betting match that other players can participate in! First you will need to select the sport event that you want to start a new bet on.
                    From there you can define your starting bet. Once the date of the sport event has passed, the winners will recieve their rewards.
                </p>
                <ErrorCard title="Error!" msg="An error has occured while proccesing your request. Please try again later!" show={this.state.displayState === DisplayState.Error}/>
                <LoadingCard text={"Loading data, please wait..."} show={this.state.displayState === DisplayState.Loading}/>
                <MatchCreateSportsList sportEvents={new PaginatedArray<ISportEvent>(this.state.sportEvents, 20)} show={this.state.displayState === DisplayState.SportsList} onSelectCallBackFn={(event: ISportEvent) => this.onSportEventSelected(event)}/>
                {createForm}
            </div>
        );
    }
}

export default MatchCreateArea