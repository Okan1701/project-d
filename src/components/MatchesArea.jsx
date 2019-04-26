import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import * as database from "../database";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import MatchOverview from "./MatchOverview";

class MatchesArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: [],
            selectedMatch: null,
            listState: 0, // 0 = loading, 1 = loaded, 2 = failed
            displayMatchDetails: false
        };
    }

    componentDidMount() {
        database.getMatches().then(
            (matches) => {
                this.setState({
                    matches: matches,
                    listState: 1
                });
            },
            (reason) => {
                console.log("Failed loading list: " + reason);
                this.setState({
                    listState: 2
                });
            }
        );
    }

    onMatchSelected(match) {
        this.setState({
            displayMatchDetails: true,
            selectedMatch: match
        });
    }

    displayMatchDetails() {
        if (this.state.displayMatchDetails) {
            return <MatchOverview match={this.state.selectedMatch} web3={this.props.web3}/>
        }
        else {
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
    
    
    render() {
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