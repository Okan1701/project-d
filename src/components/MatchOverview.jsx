import React, {Component} from "react";
import Card from "./MatchesArea";
import LoadingCard from "./LoadingCard";
import rouletteContractAbi from "../contracts/RouletteContract";
import * as database from "../database";

class MatchOverview extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            loadingState: 0
        }
    }

    componentDidMount() {
        console.log(this.props.match.contract_address);
        this.props.web3.eth.getAccounts().then((accounts) => {
            // Get the specific contract instance that belongs to this match using its address
            const contractInstance = new this.props.web3.eth.Contract(rouletteContractAbi.abi, "0xC1708E020F3424090fA10A6AC8707DAa8812885E");
            contractInstance.options.address = "0xC1708E020F3424090fA10A6AC8707DAa8812885E";
            
            // Call the getPlayers() of the contract.
            // Last parameter is the callback function when done
            contractInstance.methods.getPlayers().call({from: accounts[0]}, (error, result) => {
                console.log(result);
            })
            

        });
        
    }

    render() {
        if (this.state.loadingState === 0) {
            return <LoadingCard text="Loading match data..." show={true}/>
        }


        return (
            <Card>
                <Card.Body>
                    <Card.Title>Match details</Card.Title>
                    <p>Here in the match overview, you can see additionel details like the amount of players, the total
                        bet value and options for you to place your own bet!</p>
                    <br/><h3>{this.props.match.title}</h3>
                    <strong>Amount of players: </strong><br/>
                    <strong>Total Bet Amount: </strong><br/>
                    <strong>Started on: </strong>{this.props.match.start_date}

                </Card.Body>
            </Card>
        );
    }
}

export default MatchOverview;