import React, {Component} from "react";

class MainArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            account: "Loading..."
        }
    }


    componentDidMount() {
        this.props.web3.eth.getAccounts().then((accounts) => {
            this.setState({account: accounts[0].toString()})
        });
    }


    render() {
        return (
            <div>
                <h1>Main Area</h1>
                <hr/>
                <p>Welcome to the website. This site is used to participate in betting matches with Ether as
                    currency.
                </p>
                <strong>Current wallet address: </strong>{this.state.account}
            </div>
        );

    }
}

export default MainArea;