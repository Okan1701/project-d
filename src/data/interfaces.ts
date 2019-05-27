// Defines a match object
export interface IMatch {
    id?: number
    title: string,
    contract_address: string,
    start_date: string,
    end_date: string,
    active: boolean
}

// Defines a player object
export interface IPlayer {
    [key: number]: any
    address: string,
    name: string
    wins: number,
    losses: number
    earnings: number
}

export interface ISportEvent {
    idEvent: number,
    strEvent: string,
    dateEvent: string,
    strTime: string
}