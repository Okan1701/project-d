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