/// <reference types="react-scripts" />
import Web3 = require("web3");

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
}
