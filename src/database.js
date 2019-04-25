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
    
    console.log(await response.request);
    
    return response.ok;
}