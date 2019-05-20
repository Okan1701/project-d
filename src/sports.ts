
export interface ISportEvent {
    idEvent: number,
    strEvent: string
}

export async function getEventsAtDate(date: string): Promise<ISportEvent[]> {
    let response: Response = await fetch(`https://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=${date}&l=MLB`);
    return (await response.json()).events;
}