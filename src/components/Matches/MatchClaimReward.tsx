import React, {Component} from "react";
import {IMatch, MatchWinningTeam} from "../../data/interfaces";
import Alert from "sweetalert2";
import Web3 from "web3";

interface IState {
    isLoading: boolean,
    canClaimReward: boolean
}

interface IProps {
    web3: Web3
    match: IMatch
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
    }
}

export default MatchClaimReward;