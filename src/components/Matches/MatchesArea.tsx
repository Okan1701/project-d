import React, {Component} from "react";
import {IWeb3Prop} from "../Routing";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import {IMatch, ISportEvent} from "../../data/interfaces";
import * as database from "../../data/database";
import * as sports from "../../data/sports";
import Alert from 'sweetalert2'
import LoadingCard from "../Misc/LoadingCard";
import MatchesList from "./MatchesList";
import MatchOverview from "./MatchOverview";
import * as web3utils from 'web3-utils';

const rouletteContractAbi = require("../../contracts/RouletteContract");

enum MatchesAreaSelection {
    AvailableMatches,
    MyMatches,
    MatchOverview
}

interface IState {
    selectedArea: MatchesAreaSelection
    allMatches: IMatch[],
    myMatches: IMatch[]
    isLoading: boolean
    selectedMatch?: IMatch
}

class MatchesArea extends Component<IWeb3Prop, IState> {
    constructor(props: IWeb3Prop) {
        super(props);
        this.state = {
            selectedArea: MatchesAreaSelection.AvailableMatches,
            allMatches: [],
            myMatches: [],
            isLoading: true
        };
    }

    /**
     * Load all the active matches from database
     * For each match, we will also get it's sport event id and load the sport data
     */
    private async getAllMatches(): Promise<void> {
        let matches: IMatch[] = await database.getActiveMatches();
        let account: string = (await this.props.web3.eth.getAccounts())[0];

        let ownedMatches: IMatch[] = [];

        for (let i = 0; i < matches.length; i++) {
            matches[i].sport_event_data = await sports.getEventFromId(matches[i].sport_event_id);
            if (matches[i].owner === account) {
                ownedMatches.push(matches[i]);
            }
        }

        this.setState({
            allMatches: matches,
            myMatches: ownedMatches,
            isLoading: false
        });
    }

    /**
     * Loads the contract details of a specific match using it's contract address
     * Once loaded, it will switch to the 'Match overview' tab on UI
     * @param match: the IMatch object containing valid address
     */
    private async getMatchDetails(match: IMatch) {
        // Display loading screen
        this.setState({isLoading: true});

        // Get current selected account in MetaMask
        const accounts: string[] = await this.props.web3.eth.getAccounts();
        // Get the specific contract instance that belongs to this match using its address
        const contractInstance: any = new this.props.web3.eth.Contract(rouletteContractAbi.abi, match.contract_address);

        // Get the needed data from the smart contract and store it in these fields
        const homePlayersAddr: string[] = await contractInstance.methods.getHomeTeamPlayers().call({from: accounts[0]});
        const awayPlayersAddr: string[] = await contractInstance.methods.getAwayTeamPlayers().call({from: accounts[0]});
        const betValueWei: string = await contractInstance.methods.getTotalBetValue().call({from: accounts[0]});
        const betValueEther: string = await web3utils.fromWei(web3utils.toBN(betValueWei));

        let homePlayers: IContractPlayer[] = [];
        let awayPlayers: IContractPlayer[] = [];

        // The players array only contain their addressed, we wanna replace that with their profile names and bet value
        for (let i = 0; i < homePlayersAddr.length; i++) {
            try {
                homePlayers.push({
                    address: homePlayersAddr[i],
                    name: (await database.getPlayer(homePlayersAddr[i])).name,
                    betValue: await contractInstance.methods.getPlayerBet(homePlayersAddr[i]).call({from: accounts[0]})
                });
            } catch (e) {
                console.log(e);
            }
        }
        for (let i = 0; i < awayPlayersAddr.length; i++) {
            try {
                awayPlayers.push({
                    address: awayPlayersAddr[i],
                    name: (await database.getPlayer(awayPlayersAddr[i])).name,
                    betValue: await contractInstance.methods.getPlayerBet(awayPlayersAddr[i]).call({from: accounts[0]})
                });
            } catch (e) {
                console.log(e);
            }
        }

        // The data will be stored in a object which will be assigned to the match object
        const contractData: IContractData = {
            playerCount: homePlayers.length + awayPlayers.length,
            totalBetValue: betValueEther,
            homeTeamPlayers: homePlayers,
            awayTeamPlayers: awayPlayers
        };

        match.contract_data = contractData;

        this.setState({
            selectedMatch: match,
            selectedArea: MatchesAreaSelection.MatchOverview,
            isLoading: false
        })
    }

    /**
     * The default active tab behavior from the Nav elements is not suitable
     * Every Nav Link needs to manually set it's classame correctly by calling this function
     * If the area that the nav link component is linked to is the current selected area, then it will be active
     * @param area: this is the area that the Nav Link is linked to
     */
    private getNavTabBsPrefix(area: MatchesAreaSelection): string {
        if (area === this.state.selectedArea) {
            return "nav-link active";
        }
        return "nav-link";
    }

    /**
     * The 'Match overview' tab should only be rendered if a match is currently selected
     */
    private renderMatchOverviewTab() {
        if (this.state.selectedMatch !== undefined) {
            return (
                <Nav.Item>
                    <Nav.Link bsPrefix={this.getNavTabBsPrefix(MatchesAreaSelection.MatchOverview)}
                              onClick={() => this.setState({selectedArea: MatchesAreaSelection.MatchOverview})}>
                        Selected match
                    </Nav.Link>
                </Nav.Item>
            );
        }
    }

    /**
     * Render the body of the main card.
     * The content that it renders will depend on which area is currently chosen
     * If 'isLoading' flag of state is true then a loading card will be shown instead
     */
    private renderCardBody() {
        if (this.state.isLoading) {
            return (
                <Card.Body>
                    <LoadingCard text={"Loading data. Please wait."} show={true}/>
                </Card.Body>
            );
        }

        switch (this.state.selectedArea) {
            case MatchesAreaSelection.AvailableMatches:
                return <MatchesList matches={this.state.allMatches}
                                    onMatchSelectCallbackFn={(m: IMatch) => this.getMatchDetails(m)}
                                    title="All current betting matches"/>;


            case MatchesAreaSelection.MyMatches:
                return <MatchesList matches={this.state.myMatches}
                                    onMatchSelectCallbackFn={(m: IMatch) => this.getMatchDetails(m)}
                                    title="Matches that have been created by you"/>;


            case MatchesAreaSelection.MatchOverview:
                if (this.state.selectedMatch === undefined) break;
                return <MatchOverview match={this.state.selectedMatch} web3={this.props.web3}
                                      refreshMatchFn={(m: IMatch) => this.getMatchDetails(m)}/>
        }
    }

    public componentDidMount(): void {
        this.getAllMatches().catch(
            (e: Error) => Alert.fire({
                title: e.name,
                text: e.message,
                type: "error"
            })
        );
    }

    public render() {
        return (
            <div>
                <h1>Matches</h1>
                <hr/>
                <p>On this page, you can view all the current available betting matches that have been created by other
                    players!
                    <br/>When browsing through the list, you can view more details of a match along with options such as
                    the ability to participate in it by placing your own bet as well!
                </p>
                <Card>
                    <Card.Header>
                        <div className="match-nav-items">
                            <Nav variant="tabs">
                                <Nav.Item>
                                    <Nav.Link bsPrefix={this.getNavTabBsPrefix(MatchesAreaSelection.AvailableMatches)}
                                              onClick={() => this.setState({selectedArea: MatchesAreaSelection.AvailableMatches})}>
                                        Current Betting Matches
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link bsPrefix={this.getNavTabBsPrefix(MatchesAreaSelection.MyMatches)}
                                              onClick={() => this.setState({selectedArea: MatchesAreaSelection.MyMatches})}>
                                        My matches
                                    </Nav.Link>
                                </Nav.Item>
                                {this.renderMatchOverviewTab()}
                            </Nav>
                        </div>
                    </Card.Header>
                    {this.renderCardBody()}
                </Card>
            </div>
        );
    }
}

export default MatchesArea;