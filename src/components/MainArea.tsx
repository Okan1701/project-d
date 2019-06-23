import React, {Component} from "react";
import Web3 from "web3"
import Carousel from "react-bootstrap/Carousel";
import Card from "react-bootstrap/Card";

const imgCarousel0 = require("../images/carousel-0.png");
const imgCarousel1 = require("../images/carousel-1.png");
const imgCarousel2 = require("../images/carousel-2.png");
const imgCarousel3 = require("../images/carousel-3.png");


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
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={imgCarousel2}
                                    alt="First slide"
                                />
                                <Carousel.Caption>
                                    <h3>Choose from many sport events to bet on!</h3>
                                    <p>When creating a new bet, you can choose which sport event that you want to bet
                                        on!</p>
                                </Carousel.Caption>
                            </Carousel.Item>
                            <Carousel.Item>
                                <img
                                    className="d-block w-100"
                                    src={imgCarousel3}
                                    alt="First slide"
                                />
                                <Carousel.Caption>
                                    <h3>Become the top betting player!</h3>
                                    <p>We offer a leaderboard page where users can see who the top betting players are based on their earnings, wins and losses!</p>
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
                        <p>Easy! All you have to do is click on 'Create Match' on the navigation bar at the top! You
                            will be presented with a list of currently available sport events and will be asked to
                            choose the sport event that you wanna bet on.
                            <br/><br/>Once you click on one, you will be taken to a form where you can give your match a
                            name, select which team YOU will be betting on and define your own starting bet. After that,
                            just hit 'Create' and your match will be created!<br/>
                            <br/>When created, other players will be able to view your match and participate by placing
                            their own bets!</p>
                        <br/><strong>How does participating in other people's betting matches work?</strong>
                        <p>
                            Betting matches that have been created by other user's are visible to anyone. <br/>When you
                            go to the Matches page, you can see all the betting matches that are currently active. Each
                            one of those matches is created by a player.<br/>
                            You can click on a match in order to see more details like the current amount of
                            participants, the total bet value so far and the name of the sport event that the
                            participants are betting on.<br/><br/>
                            When you click on a match, you can also see a form which allows you to participate in that
                            betting match as well!
                        </p>
                    </Card.Body>
                </Card>
                <br/><strong>Current wallet address: </strong>{this.state.account}
            </div>
        );

    }
}

export default MainArea;