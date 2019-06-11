import React, {Component} from "react";
import {IMatch, ISportEvent, MatchStatusCode} from "../../data/interfaces";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import {PaginatedArray} from "../../utils";
import Pagination from "react-bootstrap/Pagination";

interface IState {
    paginatedMatches: PaginatedArray<IMatch>
    pageNumber: number
}

interface IProps {
    title: string
    matches: IMatch[],
    onMatchSelectCallbackFn?: (match: IMatch) => void
}

class MatchesList extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            paginatedMatches: new PaginatedArray<IMatch>(this.props.matches, 10),
            pageNumber: 1
        };
    }

    private getEventName(event: ISportEvent | undefined): string {
        if (event === undefined) return "No info available";
        return (event as ISportEvent).strEvent;
    }

    /**
     * The parent component can supply a function as prop that should be called when match is clicked on
     * This method will make sure that callback function is called if defined
     * @param m: the match object that the user selected
     */
    private onMatchSelected(m: IMatch): void {
        if (this.props.onMatchSelectCallbackFn !== undefined) {
            this.props.onMatchSelectCallbackFn(m);
        }
    }

    /**
     * The row should only have the click mouse cursor and colored highlight if the callback function is defined
     */
    private getRowClassName(): string {
        if (this.props.onMatchSelectCallbackFn !== undefined) {
            return "cursor-pointer";
        }
        return "";
    }

    private renderPageButtons(): React.ReactNodeArray {
        let items: React.ReactNodeArray = [];
        let totalPages = this.state.paginatedMatches.getTotalPages();

        for (let i = 1; i <= totalPages; i++) {
            items.push(<Pagination.Item onClick={() => this.setState({pageNumber: i})}
                                        active={i === this.state.pageNumber}>{i}</Pagination.Item>);
        }

        return items;
    }

    public render() {
        return (
            <Card.Body>
                <Card.Title>{this.props.title}</Card.Title>
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
                        <tr onClick={() => this.onMatchSelected(m)} className={this.getRowClassName()}>
                            <td>{m.id}</td>
                            <td>{m.title}</td>
                            <td>{this.getEventName(m.sport_event_data)}</td>
                            <td>{m.start_date}</td>
                            <td>{MatchStatusCode[m.status_code]}</td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Pagination>
                    <Pagination.Prev onClick={() => this.setState({pageNumber: this.state.pageNumber - 1})}
                                     disabled={this.state.pageNumber <= 1}>Prev</Pagination.Prev>
                    {this.renderPageButtons()}
                    <Pagination.Next onClick={() => this.setState({pageNumber: this.state.pageNumber + 1})}
                                     disabled={this.state.pageNumber >= this.state.paginatedMatches.getTotalPages()}>Next</Pagination.Next>
                </Pagination>
            </Card.Body>
        );
    }
}

export default MatchesList;