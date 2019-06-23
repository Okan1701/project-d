/// <reference types="react-scripts" />
import Web3 = require("web3");
import {TransactionObject} from "web3/eth/types";

interface IWindowEthereum {
    enable() : void
}

declare global {
    interface Window extends Window {
        web3: Web3,
        ethereum: IWindowEthereum
    }

    interface EventTarget extends EventTarget {
        [key: number]: any
    }

    interface IContractData {
        playerCount: number,
        totalBetValue: string,
        homeTeamPlayers: IContractPlayer[],
        awayTeamPlayers: IContractPlayer[],
    }

    interface IContractPlayer {
        address: string
        name: string,
        betValue: string
    }

}
