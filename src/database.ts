const API_URL = "http://localhost:8000/api";

// Defines a match object
export interface IMatch {
    id?: number
    title: string,
    contract_address: string,
    start_date: string,
    end_date: string
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
export async function getMatches(): Promise<IMatch[]> {
    let response: Response = await fetch(API_URL + "/matches/");

    if (!response.ok) {
        throw Error(`Failed to retrieve match data! (${response.status})`);
    }

    return await response.json();
}


/**
 * Delete a specific match using the ID parameter
 * @param id: the id of the specific match that we want to delete
 */
export async function deleteMatch(id: number): Promise<void> {
    let response = await fetch(API_URL + "/matches/" + id.toString(), {method: "DELETE"});

    if (!response.ok) {
        throw Error(`Failed to delete match with ID ${id}! (${response.status})`)
    }
}