import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import {ISportEvent} from "../../data/interfaces";
import {PaginatedArray} from "../../utils";

interface IState {
    pageNumber: number
}

interface IProps {
    sportEvents: PaginatedArray<ISportEvent>,
    show: boolean,
    onSelectCallBackFn?: (event: ISportEvent) => void
}

class MatchCreateSportsList extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            pageNumber: 1
        };
    }

    /**
     * This is called by the HTML table in render() when user clicks on a table row
     * It will use the callback function onSelectCallBackFn to notify parent component that user has selected a match
     * The callback function is optional. If not defined, then nothing will happen
     * @param event: the sport event object that represented the row that was clicked
     */
    private onTableRowClick(event: ISportEvent): void {
        if (this.props.onSelectCallBackFn !== undefined) {
            this.props.onSelectCallBackFn(event);
        }
    }

    public render() {
        if (!this.props.show) return null;

        return (
            <Card>
                <Card.Header>Current available sport events</Card.Header>
                <Card.Body>
                    <Table hover={true}>
                        <thead>
                        <tr>
                            <th>Event name</th>
                            <th>Category</th>
                            <th>League name</th>
                            <th>Event date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.sportEvents.getPageItems(this.state.pageNumber).map((event: ISportEvent) => (
                            <tr onClick={() => this.onTableRowClick(event)}>
                                <td>{event.strEvent}</td>
                                <td>Baseball</td>
                                <td>MLB</td>
                                <td>{event.dateEvent + " " + event.strTime}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );
    }
}

export default MatchCreateSportsList;