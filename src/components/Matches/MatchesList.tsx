import React, {Component} from "react";
import {IMatch, ISportEvent, MatchStatusCode} from "../../data/interfaces";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";

interface IProps {
    matches: IMatch[],
    onMatchSelectCallbackFn: (match: IMatch) => void
}

class MatchesList extends Component<IProps, any> {

    private getEventName(event: ISportEvent | undefined): string {
        if (event === undefined) return "No info available";
        return (event as ISportEvent).strEvent;
    }

    public render() {
        return (
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Event name</th>
                        <th>Created on</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.matches.map((m: IMatch) => (
                        <tr onClick={() => this.props.onMatchSelectCallbackFn(m)}  className="cursor-pointer">
                            <td>{m.id}</td>
                            <td>{m.title}</td>
                            <td>{this.getEventName(m.sport_event_data)}</td>
                            <td>{m.start_date}</td>
                            <td>{MatchStatusCode[m.status_code]}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        );
    }
}

export default MatchesList;