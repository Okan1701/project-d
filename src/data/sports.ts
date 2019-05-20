import {ISportEvent} from "./interfaces";

/**
 * @description Get all the sport events of the MLB league from a specific date
 * @WARNING: The league parameter is currently hardcoded in the url (l=MLB)
 * @param date: string representation of the date that the matches belong to (YYYY-MM-DD)
 * @returns an array containing objects of type ISportEvent
 */
export async function getEventsAtDate(date: string): Promise<ISportEvent[]> {
    let response: Response = await fetch(`https://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=${date}&l=MLB`);
    // The sport events are located in the events object of the response JSON
    return (await response.json()).events;
}