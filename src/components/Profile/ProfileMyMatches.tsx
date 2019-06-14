import React, {Component} from "react";
import {IMatch} from "../../data/interfaces";
import {IWeb3Prop} from "../Routing";
import * as database from "../../data/database";
import Alert from "sweetalert2";
import LoadingCard from "../Misc/LoadingCard";
import MatchesList from "../Matches/MatchesList";
import * as sports from "../../data/sports";

interface IState {
    isLoading: boolean,
    matches: IMatch[]
}

class ProfileMyMatches extends Component<IWeb3Prop, IState> {
    constructor(props: IWeb3Prop) {
        super(props);
        this.state = {
            isLoading: true,
            matches: []
        };
    }

    private async getMyMatches(): Promise<void> {
        const account: string = (await this.props.web3.eth.getAccounts())[0];
        const allMatches: IMatch[] = await database.getMatches(false);
        const myMatches: IMatch[] = [];

        for (let i = 0; i < allMatches.length; i++) {
            if (allMatches[i].owner === account) {
                allMatches[i].sport_event_data = await sports.getEventFromId(allMatches[i].sport_event_id);
                myMatches.push(allMatches[i]);
            }
        }

        this.setState({
            isLoading: false,
            matches: myMatches
        });
    }

    public componentDidMount(): void {
        this.getMyMatches().catch(
            (e: Error) => {
                Alert.fire({
                    title: e.name,
                    text: e.message,
                    type: "error"
                });
                console.log(e);
            }
        );
    }

    public render() {
        if (this.state.isLoading) {
            return <LoadingCard text="Loading data..." show={true}/>
        }

        return (
            <MatchesList title="Your own created matches" matches={this.state.matches}/>
        );
    }
}

export default ProfileMyMatches;