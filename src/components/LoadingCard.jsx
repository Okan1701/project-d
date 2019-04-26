import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

class LoadingCard extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (this.props.show) {
            return (
                <Card className="text-center">
                    <Card.Body>
                        <div className="align-content-center">
                            <Spinner animation="border" variant="primary" text/>
                            <br/><br/>
                            <Card.Title><strong>{this.props.text}</strong></Card.Title>
                        </div>
                    </Card.Body>
                </Card>
            );
        } else {
            return (null);
        }
    }
}

export default LoadingCard;