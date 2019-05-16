const API_URL = "http://localhost:8000/api";

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
    address: string,
    name: string
    wins: number,
    losses: number
    earnings: number
}


/**
 * Create a new match row in the backend database
 * @param match: the match object of type 'IMatch' that will be sent to db
 */
export async function createMatchEntry(match: IMatch): Promise<void> {
    let response = await fetch(API_URL + "/matches/create", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(match)
    });

    if (!response.ok) {
        throw Error(`Failed to retrieve match data! (${response.status});`);
    }
}

/**
 * Get all the matches that exist in the backend database
 * @returns an IMatch[] array containing the match objects
 */
export async function getActiveMatches(): Promise<IMatch[]> {
    let response: Response = await fetch(API_URL + "/matches/active");

    if (!response.ok) {
        throw Error(`Failed to retrieve match data! (${response.status})`);
    }

    return await response.json();
}


/**
 * Archives a specific match using the ID parameter
 * An archived match still exists in database, but wont be retrieved when calling getActiveMatches
 * @param id: the id of the specific match that we want to delete
 */
export async function setMatchAsArchived(id: number): Promise<void> {
    // Retrieve match first
    let getResponse = await fetch(API_URL + "/matches/" + id.toString());
    if (!getResponse.ok) {
        throw Error(`Failed to fetch match with ID ${id}! (${getResponse.status})`)
    }
    let match: IMatch = await getResponse.json();

    console.log(match);

    // Set match to inactive and send it back to server
    match.active = false;
    let putResponse = await fetch(API_URL + "/matches/" + id.toString(), {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(match)
    });

    if (!putResponse.ok) {
        console.log(await putResponse.json());
        throw Error(`Failed to archive match ID ${id}! (${putResponse.status})`)
    }

}

/**
 * Checks if the user is already registered
 * It is done by attempting to get user info from backend using the address which is the primary key
 * If response is not HTTP 200 then it means the backend could not find any user that matches the address
 * @param address: the ethereum public address that belongs to a account
 * @return boolean: true if account exists, false if not
 */
export async function checkIfUserIsRegistered(address: string): Promise<boolean> {
    let response = await fetch(API_URL + "/players/" + address);
    return response.ok;
}

/**
 * Creates a new player object using the specified address as primary key
 * @param player: object containing the player info. See IPlayer interface!
 */
export async function registerPlayer(player: IPlayer): Promise<void> {
    let response = await fetch(
        API_URL + "/players/create",
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player)
        }
    );

    if (!response.ok) {
        throw Error(`Failed to create new player! (${response.status})`)
    }
}

/**
 * Fetch a specific player using it's wallet address
 * @param address: the wallet address of the player
 */
export async function getPlayer(address: string): Promise<IPlayer> {
    let response: Response = await fetch(API_URL + "/players/" + address);

    if (!response.ok) {
        throw Error(`Failed to fetch player with address ${address}! (${response.status})`)
    }

    let player: IPlayer = await response.json();
    player.earnings = parseInt(player.earnings.toString());
    return player;
}

/**
 * Update a player on the backend. It will overwrite the old player data with the new one
 * @param player: object of IPlayer type that represents the player
 */
export async function updatePlayer(player: IPlayer): Promise<void> {
    let response: Response = await fetch(API_URL + "/players/" + player.address,
        {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player)
        }
    );

    console.log("JSON:" + JSON.stringify(player));

    if (!response.ok) {
        console.log(response);
        console.log(player);
        throw Error(`Failed to update player with address ${player.address}! (${response.status})`)
    }
}

/**
 * Update the win/loss stats of the player.
 * It will first fetch the entire player, update it and then send it back to db.
 * @param address: the string wallet address of the player
 * @param hasWon: boolean representing if it should increment the wins stat or the losses stat
 */
export async function updatePlayerWinLoss(address: string, hasWon: boolean): Promise<void> {
    let player: IPlayer = await getPlayer(address);

    if (hasWon) player.wins++;
    else player.losses++;

    await updatePlayer(player);
}

/**
 * Update the players total earnings. It is similar to updatePlayerWinLoss()
 * WARNING: the ether must be in wei format first or else you'll screw everything up
 * If player is meant to lose ether, then pass the earningsFromMatch param as a negative value
 * @param address: the string wallet address of the player
 * @param earningsFromMatch: the amount of ether that the player has won in wei format
 */
export async function updatePlayerEarnings(address: string, earningsFromMatch: number): Promise<void> {
    let player: IPlayer = await getPlayer(address);
    player.earnings += earningsFromMatch;

    await updatePlayer(player);
}