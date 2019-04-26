const API_URL = "http://localhost:8000";

export async function createMatchEntry(match) {
    let response = await fetch(API_URL + "/api/matches/create", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(match)
    });
    
    return response.ok;
}

export async function getMatches() {
    let response = await fetch(API_URL + "/api/matches/");

    if (!response.ok) {
        throw `Failed to retrieve match data! (${response.status});`
    }

    return await response.json();
}