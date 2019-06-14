import React, {Component, ReactNode} from 'react';
import '../css/App.css';
import SiteNavbar from "./SiteNavbar";
import Web3 from "web3";
import Routing from "./Routing";
import {BrowserRouter, HashRouter} from "react-router-dom";
import * as database from "../data/database";
import RegisterComponent from "./RegisterComponent";
import {IPlayer} from "../data/interfaces";
import Card from "react-bootstrap/Card";

enum LoadingState {
    detectProvider,
    noProvider,
    awaitProviderAuth,
    providerAuthFailed,
    notRegistered,
    loaded,
    failed
}

interface IState {
    loadingState: LoadingState,
    errorMsg: string
    web3?: Web3,
    accounts: string[],
    player?: IPlayer
}

class App extends Component<any, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loadingState: LoadingState.detectProvider,
            errorMsg: "N/A",
            web3: undefined,
            accounts: [],
        };
    }

    public componentDidMount(): void {
        this.init().catch(this.onInitFailed);

    }

    private onInitFailed(error: Error): void {
        console.log(error);
        this.setState({
            loadingState: LoadingState.failed,
            errorMsg: error.message
        });

    }

    private async init(): Promise<void> {
        let web3Provider: Web3;

        // Check if a provider like MetaMask is active
        if (window.web3 === undefined && window.ethereum === undefined) {
            this.setState({loadingState: LoadingState.noProvider});
            return;
        } else {
            web3Provider = new Web3(window.web3.currentProvider);
            web3Provider.eth.transactionConfirmationBlocks = 1;
            console.log((await web3Provider.eth.net.getNetworkType()));
            this.setState({
                loadingState: LoadingState.awaitProviderAuth,
                web3: web3Provider
            });
        }

        // Get MetaMask Account
        this.setState({loadingState: LoadingState.awaitProviderAuth});
        window.ethereum.enable();
        let accounts: string[] = await web3Provider.eth.getAccounts();
        if (accounts.length === 0) {
            this.setState({loadingState: LoadingState.providerAuthFailed});
            return;
        }

        // Check if user is registered with us
        let userIsRegistered: boolean = await database.checkIfUserIsRegistered(accounts[0]);
        if (!userIsRegistered) {
            this.setState({
                loadingState: LoadingState.notRegistered,
                accounts: accounts
            });
            return;
        }

        const player: IPlayer = await database.getPlayer(accounts[0]);
        this.setState({
            loadingState: LoadingState.loaded,
            player: player
        });
    }

    private onRegistered(): void {
        this.setState({loadingState: LoadingState.loaded});
        database.getPlayer(this.state.accounts[0]).then(
            (player: IPlayer) => this.setState({player: player, loadingState: LoadingState.loaded})
        );
    }

    public render(): ReactNode {
        switch (this.state.loadingState) {
            case LoadingState.detectProvider:
            case LoadingState.noProvider:
              return (
                <div>
                  <HashRouter>
                    <SiteNavbar showContent={true}/>
                  </HashRouter>
                  <div className={"register-form"}>
                    <br/>
                    <Card>
                      <Card.Body>
                        <h3>Welcome to our Ethereum sport betting website!</h3>
                        <br/>
                        <Card.Title>You do not have MetaMask installed</Card.Title>
                        <p>
                          In order to use this website, you are required to install the extension MetaMask. To get this extension go to
                          the add-on store of your preferred browser.
                        </p>
                        <strong>
                          Supported Browsers:
                        </strong>
                        <ul>
                          <li>Chrome</li>
                          <li>Firefox</li>
                          <li>Opera</li>
                          <li>Brave</li>
                        </ul>
                        <p>For more information, visit the official MetaMask website:</p>
                        <a href={"https://metamask.io/"}>https://metamask.io/</a>
                        <br/>
                        <br/>
                        <strong>If you have MetaMask installed, please try to refresh the page</strong>
                        <br/>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              )
            case LoadingState.awaitProviderAuth:
            case LoadingState.providerAuthFailed:
                return (
                  <div>
                    <HashRouter>
                    <SiteNavbar showContent={true}/>
                    </HashRouter>
                    <div className={"register-form"}>
                    <br/>
                  <Card>
                  <Card.Body>
                    <h3>Welcome to our Ethereum sport betting website!</h3>
                    <br/>
                    <Card.Title>You are not logged in to MetaMask</Card.Title>
                    <p>
                      In order to use this website, you are required to log in into MetaMask. You can do so by clicking the MetaMask icon in the top right corner of your browser.
                    </p>
                    <strong>
                      Supported Browsers:
                    </strong>
                    <ul>
                      <li>Chrome</li>
                      <li>Firefox</li>
                      <li>Opera</li>
                      <li>Brave</li>
                    </ul>
                    <p>If you haven't used MetaMask before or need help, visit the official MetaMask website for more information:</p>
                    <a href={"https://metamask.io/"}>https://metamask.io/</a>
                    <br/>
                    <br/>
                    <strong>If you have logged in to MetaMask, please try to refresh the page </strong>
                    <br/>
                  </Card.Body>
                  </Card>
                    </div>
                  </div>
                )
            case LoadingState.notRegistered:
                return (
                    <HashRouter>
                        <SiteNavbar showContent={false}/>
                        <br/>
                        <RegisterComponent accounts={this.state.accounts}
                                           onRegisteredCallback={() => this.onRegistered()}/>
                    </HashRouter>
                );
            case LoadingState.loaded:
                return (
                    <HashRouter>
                        <SiteNavbar showContent={true} player={this.state.player}/>
                        <br/>
                        <Routing web3={this.state.web3 as Web3} player={this.state.player as IPlayer}/>
                    </HashRouter>
                );
            default:
                return <strong>An undefined error occured! State: {this.state.loadingState}</strong>
        }
    }
}

export default App;
