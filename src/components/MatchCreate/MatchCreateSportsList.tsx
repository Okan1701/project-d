import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import {ISportEvent} from "../../data/interfaces";

interface IProps {
    sportEvents: ISportEvent[],
    display: boolean
}

class MatchCreateSportsList extends Component<IProps, any> {
    public render() {
        if (!this.props.display) return null;

        return (
            <Card>
                <Card.Header>Current available sport events</Card.Header>
                <Card.Body>
                    <Table>
                        <thead>
                        <tr>
                            <th>Event name</th>
                            <th>Category</th>
                            <th>League name</th>
                            <th>Event date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.sportEvents.map((event: ISportEvent) => (
                            <tr>
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