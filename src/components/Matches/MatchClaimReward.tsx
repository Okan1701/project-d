import React, {Component} from "react";
import {IMatch, MatchWinningTeam} from "../../data/interfaces";
import Alert from "sweetalert2";
import Web3 from "web3";
import Button from "react-bootstrap/Button";

const rouletteContractAbi = require("../../contracts/RouletteContract");

interface IState {
    isLoading: boolean,
    canClaimReward: boolean
}

interface IProps {
    web3: Web3,
    match: IMatch,
    refreshMatchFn: (m: IMatch) => void
}

class MatchClaimReward extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            isLoading: true,
            canClaimReward: false
        };
    }

    /**
     * Checks if the player is eligable for rewards.
     * If player address is not found within the winning team, then permission is denied
     */
    private async checkIfRewardCanBeClaimed(): Promise<void> {
        if (this.props.match.contract_data === undefined) {
            throw new ReferenceError("Contract data is not defined!");
        }

        const homeTeam: IContractPlayer[] = this.props.match.contract_data.homeTeamPlayers;
        const awayTeam: IContractPlayer[] = this.props.match.contract_data.awayTeamPlayers;
        const accountAddr: string = (await this.props.web3.eth.getAccounts())[0];

        let canClaim;

        if (this.props.match.winning_team === MatchWinningTeam.HomeTeam) {
            canClaim = this.isInTeam(accountAddr, homeTeam);
        } else {
            canClaim = this.isInTeam(accountAddr, awayTeam);
        }

        this.setState({
            isLoading: false,
            canClaimReward: canClaim
        });
    }

    /**
     * Loops through a given contract team to see if the target address is part of that team
     * @param addr: the address that we need to check
     * @param team: the team that we will be checking
     */
    private isInTeam(addr: string, team: IContractPlayer[]): boolean {
        for (let i = 0; i < team.length; i++) {
            if (team[i].address === addr) return true;
        }
        return false;
    }

    private async onButtonClick(): Promise<void> {
        // Get the specific contract instance that belongs to this match using its address
        const contractInstance: any = new this.props.web3.eth.Contract(rouletteContractAbi.abi, this.props.match.contract_address);

        const account: string = (await this.props.web3.eth.getAccounts())[0];

        let method = contractInstance.methods.getReward(this.props.match.winning_team);
        await method.send({from: account});
        await Alert.fire({
            title: "Done!",
            text: "Your reward has been claimed!",
            type: "success"
        });
        this.props.refreshMatchFn(this.props.match);

    }

    public componentDidMount(): void {
        this.checkIfRewardCanBeClaimed().catch((e: Error) => Alert.fire({
                title: e.name,
                text: e.message,
                type: "error"
            })
        );
    }


    public render() {
        if (this.state.isLoading) return <strong>Loading...</strong>;
        if (!this.state.canClaimReward) return <strong>You cannot claim any rewards because you either aren't part of
            this match or your chosen team lost!</strong>;

        return (
            <div>
                <strong>Your chosen team has won! Press the button below to claim your rewards!</strong>
                <br/><br/>
                <Button onClick={() => this.onButtonClick().catch((e: Error) => Alert.fire({title: e.name, text: e.message, type: "error"}))}>Claim reward</Button>
            </div>
        );
    }
}

export default MatchClaimReward;