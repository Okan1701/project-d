import React, {Component} from "react";
import Web3 from "web3"
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";

const imgCarousel0 = require("../images/carousel-0.png");
const imgCarousel1 = require("../images/carousel-1.png");

interface IState {
    account: string
}

interface IProps {
    web3: Web3
}

class MainArea extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            account: "Loading..."
        };
    }


    public componentDidMount(): void {
        this.props.web3.eth.getAccounts().then((accounts: string[]) => {
            this.setState({account: accounts[0]})
        });
    }


    public render(): React.ReactNode {
        return (
            <div>

                <Card>
                    <Card.Body>
                        <Carousel>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={imgCarousel0}
                                    alt="First slide"
                                />
                                <Carousel.Caption>
                                    <h3>Welcome to CryptoBet!</h3>
                                    <p>Scroll down to find out more about this website!</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={imgCarousel1}
                                    alt="First slide"
                                />
                                <Carousel.Caption>
                                    <h3>Create your own betting matches!</h3>
                                    <p>You can choose which sport event you want to bet on and create a match! Other
                                        players can participate as well!</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
                    </Card.Body>
                    <br/>
                    <Card.Body>
                        <Card.Title>Welcome!</Card.Title>
                        <strong>What is this?</strong>
                        <p>CryptoBet is a website that allows users to create and participate in sport betting matches.
                            What makes these betting matches unique is the fact that the currency involved here is
                            Ethereum! We want to provide users with a way to participate in digital betting matches
                            using the Ethereum cryptocurrency without overcomplicating the whole proccess!
                            <br/>Our aim is to become a large betting platform that is centered around Ethereum!
                        </p>
                        <br/><strong>How does creating betting matches work?</strong><br/>
                        <p>Easy! All you have to do is click on 'Create Match' on the navigation bar at the top! You will be presented with a list of currently available sport events and will be asked to choose the sport event that you wanna bet on.
                        <br/><br/>Once you click on one, you will be taken to a form where you can give your match a name, select which team YOU will be betting on and define your own starting bet. After that, just hit 'Create' and your match will be created!<br/>
                        <br/>When created, other players will be able to view your match and participate by placing their own bets!</p>
                    </Card.Body>
                </Card>
                <br/><strong>Current wallet address: </strong>{this.state.account}
            </div>
        );

    }
}

export default MainArea;