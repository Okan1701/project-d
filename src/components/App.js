import React, {Component} from 'react';
import '../App.css';
import SiteNavbar from "./SiteNavbar";
import Web3 from "web3";
import Routing from "./Routing";
import {BrowserRouter, Router} from "react-router-dom";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingState: "detectProvider",
            web3: null
        };
    }

    componentDidMount() {
        let web3Provider;

        // Check if a provider like MetaMask is active
        if (typeof window.web3 === "undefined" && typeof window.ethereum === "undefined") {
            this.setState({loadingState: "noProvider"});
            return;
        } else {
            web3Provider = new Web3(window.web3.currentProvider);
            this.setState({
                loadingState: "awaitAuth",
                web3: web3Provider
            });
        }

        // Get Account
        this.setState({loadingState: "awaitAuth"});
        window.ethereum.enable();
        web3Provider.eth.getAccounts().then(accounts => {
            console.log(accounts);
            if (accounts.length === 0) {
                this.setState({loadingState: "noAuth"});
            } else {
                this.setState({loadingState: "loaded"});
            }
        }).catch((reason) => {
            console.log(reason);
        });


    }

    render() {
        switch (this.state.loadingState) {
            case "detectProvider":
                return <strong>Detecting Web3 provider...</strong>;
            case "noProvider":
                return <strong>No web3 provider found!</strong>;
            case "awaitAuth":
                return <strong>Awaiting permission from MetaMask</strong>;
            case "noAuth":
                return <strong>You are not logged in MetaMask!</strong>;
            case "loaded":
                return (
                    <BrowserRouter>
                        <SiteNavbar/>
                        <br/>
                        <Routing web3={this.state.web3}/>
                    </BrowserRouter>
                );
        }
    }
}

export default App;