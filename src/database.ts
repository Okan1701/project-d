const API_URL = "http://localhost:8000";

export interface IMatch {
    id?: number
    title: string,
    contract_address: string,
    start_date: string,
    end_date: string
}

export async function createMatchEntry(match: IMatch): Promise<void> {
    let response = await fetch(API_URL + "/api/matches/create", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(match)
    });

    if (!response.ok) {
        throw `Failed to retrieve match data! (${response.status});`
    }
}

export async function getMatches(): Promise<IMatch[]> {
    let response: Response = await fetch(API_URL + "/api/matches/");

    if (!response.ok) {
        throw `Failed to retrieve match data! (${response.status});`
    }

    return await response.json();
}