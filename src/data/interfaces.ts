// Defines a match object
export interface IMatch {
    id?: number
    title: string,
    contract_address: string,
    start_date: string,
    active: boolean,
    sport_event_id: number,
    sport_event_data?: ISportEvent, // Optional, used for convenience
    status_code: MatchStatusCode,
    winning_team: MatchWinningTeam,
    contract_data?: IContractData // Optional, used for convenience
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
    strLeague: string
    dateEvent: string,
    strTime: string
    strHomeTeam: string,
    strAwayTeam: string,
}

export enum MatchStatusCode {
    WaitingForMatchDate = 0,
    Pending = 1,
    CanClaimRewards = 2,
    RewardsClaimed = 3
}

export enum MatchWinningTeam {
    None = -1,
    HomeTeam = 0,
    AwayTeam = 1,
    All = 2
}