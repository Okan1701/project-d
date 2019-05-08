import React, {Component} from "react";
import Card from "react-bootstrap/Card";

interface IProps {
    title: string,
    msg: string
    show: boolean
}

class ErrorCard extends Component<IProps, any> {

    public render(): React.ReactNode {
        if (this.props.show) {
            return (
                <Card className="text-center">
                    <Card.Body>
                        <div className="align-content-center">
                            <Card.Title><strong>{this.props.title}</strong></Card.Title>
                            <br/><br/>
                            <strong>{this.props.msg}</strong>
                        </div>
                    </Card.Body>
                </Card>
            );
        } else {
            return (null);
        }
    }
}

export default ErrorCard;