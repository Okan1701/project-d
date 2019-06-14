import React, {Component} from "react";
import Card from "react-bootstrap/Card";
import Web3 from "web3";
import Nav from "react-bootstrap/Nav";
import ProfileOverviewComponent from "./ProfileOverviewComponent";
import {IPlayer} from "../../data/interfaces";
import {getPlayer} from "../../data/database";
import ProfileDeleteComponent from "./ProfileDeleteComponent";
import ProfileMyMatches from "./ProfileMyMatches";

enum ProfileArea {
    Overview,
    MyMatches,
    DeleteProfile
}

interface IState {
    selectedProfileArea: ProfileArea,
    player: IPlayer,
    playerLoaded: boolean
}

interface IProps {
    web3: Web3
}

class ProfileAreaComponent extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            selectedProfileArea: ProfileArea.Overview,
            player: {
                address: "Loading...",
                name: "Loading...",
                wins: 0,
                game_count: 0,
                earnings: 0
            },
            playerLoaded: false
        };
    }

    /**
     * Called when user clicks on a tab option
     * Will update the currently selected profile area enum in the state with the new value
     * @param selectedprofileArea: The profile area tab that the user selected
     */
    private onTabClick(selectedprofileArea: ProfileArea): void {
        this.setState({selectedProfileArea: selectedprofileArea});
    }

    /**
     * Render the body of the Profile card by checking what area is currently selected
     * It will then render it's component.
     */
    private renderCardBody() {
        switch (this.state.selectedProfileArea) {
            case ProfileArea.Overview:
                return <ProfileOverviewComponent web3={this.props.web3} player={this.state.player}/>;
            case ProfileArea.MyMatches:
                return <ProfileMyMatches web3={this.props.web3} />;
            case ProfileArea.DeleteProfile:
                return <ProfileDeleteComponent player={this.state.player}/>
        }
    }

    /**
     * Load the player profile by getting the wallet address from web3 and using it to load the profile from db
     */
    private async loadProfile(): Promise<void> {
        let accounts: string[] = await this.props.web3.eth.getAccounts();
        let player: IPlayer = await getPlayer(accounts[0]);

        this.setState({player: player, playerLoaded: true});
    }
    
    public componentDidMount(): void {
        this.loadProfile().catch((e: Error) => alert(e));
    }

    public render() {
        if (this.state.playerLoaded) {
            return (
                <Card>
                    <Card.Header>
                        <Nav variant="tabs" defaultActiveKey={ProfileArea.Overview}>
                            <Nav.Item style={{marginRight: "12px", paddingTop: "0.5rem", paddingLeft: "1.0rem"}}>
                                My Profile
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={ProfileArea.Overview} onClick={() => this.onTabClick(ProfileArea.Overview)}>Overview</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={ProfileArea.MyMatches} onClick={() => this.onTabClick(ProfileArea.MyMatches)}>My Matches</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={ProfileArea.DeleteProfile} onClick={() => this.onTabClick(ProfileArea.DeleteProfile)}>Delete Profile</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Card.Header>
                    {this.renderCardBody()}
                </Card>
            );
        } else {
            return <strong>Loading...</strong>;
        }
    }
}

export default ProfileAreaComponent;