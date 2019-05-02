import React, {Component, ReactNode} from 'react';
import '../css/App.css';
import SiteNavbar from "./SiteNavbar";
import Web3 from "web3";
import Routing from "./Routing";
import {BrowserRouter, Router} from "react-router-dom";

enum LoadingState {
    detectProvider,
    noProvider,
    awaitAuth,
    noAuth,
    loaded
}

interface IState {
    loadingState: LoadingState,
    web3?: Web3
}

class App extends Component<any,IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loadingState: LoadingState.detectProvider,
            web3: undefined
        };
    }

    public componentDidMount(): void {
        let web3Provider: Web3;

        // Check if a provider like MetaMask is active
        if (window.web3 === undefined && window.ethereum === undefined) {
            this.setState({loadingState: LoadingState.noProvider});
            return;
        } else {
            web3Provider = new Web3(window.web3.currentProvider);
            this.setState({
                loadingState: LoadingState.awaitAuth,
                web3: web3Provider
            });
        }

        // Get Account
        this.setState({loadingState: LoadingState.awaitAuth});
        window.ethereum.enable();
        web3Provider.eth.getAccounts().then((accounts: string[]) => {
            console.log(accounts);
            if (accounts.length === 0) {
                this.setState({loadingState: LoadingState.noAuth});
            } else {
                this.setState({loadingState: LoadingState.loaded});
            }
        }).catch((reason: string) => {
            console.log(reason);
        });


    }
    
    public render(): ReactNode {
        switch (this.state.loadingState) {
            case LoadingState.detectProvider:
                return <strong>Detecting Web3 provider...</strong>;
            case LoadingState.noProvider:
                return <strong>No web3 provider found!</strong>;
            case LoadingState.awaitAuth:
                return <strong>Awaiting permission from MetaMask</strong>;
            case LoadingState.noAuth:
                return <strong>You are not logged in MetaMask!</strong>;
            case LoadingState.loaded:
                return (
                    <BrowserRouter>
                        <SiteNavbar/>
                        <br/>
                        <Routing web3={this.state.web3 as Web3}/>
                    </BrowserRouter>
                );
        }
    }
}

export default App;
