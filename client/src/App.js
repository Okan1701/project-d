import getWeb3 from './utils/getWeb3.js';
import {Container, Row, Col, Button} from 'react-bootstrap';
//import TeamA from './components/TeamA.jsx';
//import TeamB from './components/TeamB.jsx';
import React, {Component} from 'react';
import logo from './logo.svg';
import "./App.css";

class App extends Component {

    constructor() {
        super(); //This is needed in every constructor to allow the use of 'this'

        //We define the two variables we need in the state of our component, so they can be updated
        this.state = {
            web3: '',
            address: '',
        };
    }


    componentDidMount() {
        getWeb3.then(results => {
            /*After getting web3, we save the informations of the web3 user by
            editing the state variables of the component */
            results.web3.eth.getAccounts((error, acc) => {
                //this.setState is used to edit the state variables
                this.setState({
                    address: acc[0],
                    web3: results.web3
                })
            });
        }).catch(() => {
            //If no web3 provider was found, log it in the console
            console.log('Error finding web3.')
        })
    }

    render() {
        return (
            <div className="App">

                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Bet-eth</h1>
                </header>
                <div>
                    Welcome on my Ethereum Betting website <br/>
                    Your Wallet address is {this.state.address}
                </div>
                <Container>
                    {/*corresponding to class="row"*/}
                    <Row>
                        {/* we define the two columns. The bootstrap grid is divided by 12
            parts so if we want two columns, they will take 6 parts each */}
                        <Col xs={6} sm={6}>A {/*We will import Team A component here */}</Col>
                        <Col xs={6} sm={6}>B {/*We will import Team B component here */}</Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default App;