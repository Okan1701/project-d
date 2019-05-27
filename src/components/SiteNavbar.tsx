import React, {Component} from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import {Link} from "react-router-dom";
import {IPlayer} from "../data/interfaces";

interface IState {
    selectedNavBtn: number
}

interface IProps {
    showContent: boolean,
    player?: IPlayer
}

class SiteNavbar extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedNavBtn: 0
        };
    }

    private renderLinks() {
        if (this.props.showContent) {
            return (
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/" active={this.state.selectedNavBtn === 0}
                              onClick={() => this.setState({selectedNavBtn: 0})}>Home</Nav.Link>
                    <Nav.Link as={Link} to="/matches" active={this.state.selectedNavBtn === 1}
                              onClick={() => this.setState({selectedNavBtn: 1})}>Matches</Nav.Link>
                    <Nav.Link as={Link} to="/create" active={this.state.selectedNavBtn === 2}
                              onClick={() => this.setState({selectedNavBtn: 2})}>Create Match</Nav.Link>
                    <Nav.Link as={Link} to="/leaderboard" active={this.state.selectedNavBtn === 3}
                              onClick={() => this.setState({selectedNavBtn: 3})}>Leaderboard</Nav.Link>
                </Nav>
            );
        }
    }

    public componentDidMount() {
        window.addEventListener("scroll", this.handleScroll, {passive: true});
    }

    public componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll)
    }

    private handleScroll(): void {
        let navbar: Element = document.getElementsByClassName("navbar")[0];
        if (window.scrollY != 0) {
            navbar.classList.add("navbar-shadow");
        } else {
            navbar.classList.remove("navbar-shadow");
        }
    }

    private renderPlayerLink() {
        if (this.props.showContent && this.props.player !== undefined) {
            return (
                <Nav>
                    <Nav.Link as={Link}
                              to="/profile"
                              active={this.state.selectedNavBtn === 4}
                              onClick={() => this.setState({selectedNavBtn: 4})}>{this.props.player.name}
                    </Nav.Link>
                </Nav>
            );
        }
    }

    public render(): any {
        return (
            <Navbar variant="dark" expand="lg">
                <Navbar.Brand as={Link} to="/" onClick={() => this.setState({selectedNavBtn: 0})}>
                    <img
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