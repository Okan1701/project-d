import React, {Component} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface IProps {
    title : string
    message: string
    show: boolean
    onClose: () => void

}

/**
 * A simple pop up component
 * It will display a simple dialog message
 */
class PopUpComponent extends Component<IProps,any> {

    render() {
        return <div>
            <Modal show={this.props.show} onHide={this.props.onClose}>
                <Modal.Header closeButton >
                    <Modal.Title>{this.props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.props.message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.props.onClose}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
}

export default  PopUpComponent;
