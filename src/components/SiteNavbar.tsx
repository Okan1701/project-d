import React, {Component} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";

class SiteNavbar extends Component {
    public render(): any {
        return (
            <Navbar variant="dark" expand="lg">
                <Navbar.Brand as={Link} to="/"><img src="https://yt3.ggpht.com/a/AGF-l7-BuJETOnFhNI2w3WJF163XAa1e13BtRP6znQ=s900-mo-c-c0xffffffff-rj-k-no" width="30" height="30" alt= "Logo brand"/>EasyBet</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/matches">Matches</Nav.Link>
                        <Nav.Link as={Link} to="/create">Create Match</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default SiteNavbar;