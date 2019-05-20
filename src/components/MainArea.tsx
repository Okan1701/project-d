import React, {Component} from "react";
import Web3 from "web3"

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
                <h1><img src="https://www.pix123.com/racingbase-au//201812/Dec11/20181211121538_205.PNG" width="800"
                         height="300" alt="Logo brand"/></h1>
                <hr/>
                <p>Welcome to EasyBet. This site is used to participate in betting matches with Ether as
                    currency.
                </p>
                <strong>Current wallet address: </strong>{this.state.account}
            </div>
        );

    }
}

export default MainArea;