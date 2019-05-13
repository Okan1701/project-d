import React, {Component, FormEvent} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

interface IProps {
  Title : string
  Message: string
  show: boolean
  onClose: () => void

}

class PopUpComponent extends Component<IProps,any> {

  render() {
    return <div>
      <Modal show={this.props.show} onHide={this.props.onClose}>
        <Modal.Header closeButton >
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your match has been Created!</Modal.Body>
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
