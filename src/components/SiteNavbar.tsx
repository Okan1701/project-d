import React, {Component} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";
import {IPlayer} from "../database";

interface IProps {
    showContent: boolean,
    player?: IPlayer
}

class SiteNavbar extends Component<IProps, any> {

    private renderLinks() {
        if (this.props.showContent) {
            return (
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/matches">Matches</Nav.Link>
                    <Nav.Link as={Link} to="/create">Create Match</Nav.Link>
                </Nav>
            );
        }
    }

    private renderPlayerLink() {
        if (this.props.showContent && this.props.player !== undefined) {
            return (
                <Nav>
                    <Nav.Link as={Link} to="/profile">{this.props.player.name}</Nav.Link>
                </Nav>
            );
        }
    }

    public render(): any {
        return (
            <Navbar variant="dark" expand="lg">
                <Navbar.Brand as={Link} to="/"><img
                    src="https://yt3.ggpht.com/a/AGF-l7-BuJETOnFhNI2w3WJF163XAa1e13BtRP6znQ=s900-mo-c-c0xffffffff-rj-k-no"
                    width="30" height="30" alt="Logo brand"/> EasyBet</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    {this.renderLinks()}
                    {this.renderPlayerLink()}
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default SiteNavbar;