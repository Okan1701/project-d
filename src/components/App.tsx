import React, {Component, ReactNode} from 'react';
import '../css/App.css';
import SiteNavbar from "./SiteNavbar";
import Web3 from "web3";
import Routing from "./Routing";
import {BrowserRouter} from "react-router-dom";
import * as database from "../database";
import RegisterComponent from "./RegisterComponent";

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
    player?: database.IPlayer
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


        this.setState({loadingState: LoadingState.loaded});
    }

    private onRegistered(): void {
        this.setState({loadingState: LoadingState.loaded});
        database.getPlayer(this.state.accounts[0]).then(
            (player: database.IPlayer) => this.setState({player: player, loadingState: LoadingState.loaded})
        );
    }

    public render(): ReactNode {
        switch (this.state.loadingState) {
            case LoadingState.detectProvider:
                return <strong>Detecting Web3 provider...</strong>;
            case LoadingState.noProvider:
                return <strong>No web3 provider found!</strong>;
            case LoadingState.awaitProviderAuth:
                return <strong>Awaiting permission from MetaMask</strong>;
            case LoadingState.providerAuthFailed:
                return <strong>You are not logged in MetaMask!</strong>;
            case LoadingState.notRegistered:
                return (
                    <BrowserRouter>
                        <SiteNavbar showContent={false}/>
                        <br/>
                        <RegisterComponent accounts={this.state.accounts}
                                           onRegisteredCallback={() => this.onRegistered()}/>
                    </BrowserRouter>
                );
            case LoadingState.loaded:
                return (
                    <BrowserRouter>
                        <SiteNavbar showContent={true} player={this.state.player}/>
                        <br/>
                        <Routing web3={this.state.web3 as Web3}/>
                    </BrowserRouter>
                );
            default:
                return <strong>An undefined error occured! State: {this.state.loadingState}</strong>
        }
    }
}

export default App;
