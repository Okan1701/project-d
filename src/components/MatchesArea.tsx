import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import * as database from "../data/database";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import MatchOverview from "./MatchOverview";
import Web3 from "web3"
import {IMatch} from "../data/interfaces";

// Define properties of the component Props
interface IProps {
    web3: Web3
}

// Define the properties of the component State
interface IState {
    matches: IMatch[],
    selectedMatch?: IMatch,
    displayMatchDetails: boolean
}

class MatchesArea extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            matches: [],
            selectedMatch: undefined,
            displayMatchDetails: false
        };
    }
    
    public componentDidMount(): void {
        // Get the matches from database
        database.getActiveMatches().then(
            (matches: IMatch[]) => {
                this.setState({
                    matches: matches,
                });
            },
            (reason: string) => {
                console.log("Failed loading list: " + reason);
                this.setState({
                });
            }
        );
    }

    /**
     * Called when user clicks on the View button of a match in the list
     * @param match: the selected match object
     */
    private onMatchSelected(match: IMatch): void {
        this.setState({
            displayMatchDetails: true,
            selectedMatch: match
        });
    }

    /**
     * Will display the match details if a current match is selected
     */
    private displayMatchDetails(): React.ReactNode {
        if (this.state.displayMatchDetails) {
            return <MatchOverview match={(this.state.selectedMatch as IMatch)} web3={this.props.web3}/>
        } else {
            return (
                <Card>
                    <Card.Body>
                        <Card.Title>Match details</Card.Title>
                        <p>Select a match in order to see more details and options!</p>
                    </Card.Body>
                </Card>
            );
        }
    }


    public render(): React.ReactNode {
        return (
            <div>
                <Row>
                    <Col md="3">
                        <Card>
                            <Card.Header>Matches</Card.Header>
                            <Card.Body>
                                {this.state.matches.map((match) => (
                                    <div>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>{match.title}</Card.Title>
                                                <strong>Started on: </strong>{match.start_date}
                                                <br/>
                                                <Button onClick={() => (this.onMatchSelected(match))}>View</Button>
                                            </Card.Body>
                                        </Card>
                                        <br/>
                                    </div>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="9">
                        {this.displayMatchDetails()}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default MatchesArea;