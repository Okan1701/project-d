import React, {Component} from 'react';
import '../App.css';
import SiteNavbar from "./SiteNavbar";
import Web3 from "web3";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingState: "detectProvider"
        };
    }

    componentDidMount() {
        let web3Provider;
        // Check if a provider like MetaMask is active
        if (typeof window.web3 === "undefined" && typeof window.ethereum === "undefined") {
            this.setState({loadingState: "noProvider"});
            return;
        }
        else {
            web3Provider = new Web3(window.web3.currentProvider);
        }

        // Get Account
        this.setState({loadingState: "awaitAuth"});
        window.ethereum.enable();
        web3Provider.eth.getAccounts().then(accounts => { 
            console.log(accounts);
            this.setState({loadingState: "loaded"});
        });



    }

    render() {
        let stateRender;
        switch (this.state.loadingState) {
            case "detectProvider":
                stateRender = <strong>Detecting Web3 provider...</strong>;
                break;
            case "noProvider":
                stateRender = <strong>'No web3 provider found!</strong>;
                break;
            case "awaitAuth":
                stateRender = <strong>Awaiting permission from MetaMask</strong>;
                break;
            case "loaded":
                stateRender = (
                    <div className="App">
                        <SiteNavbar/>
                        <br/>
                        <strong>Web3 is loaded!</strong>
                    </div>

                );
                break;
        }

        return stateRender;
    }
}

export default App;
