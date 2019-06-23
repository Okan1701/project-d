import {ISportEvent} from "./interfaces";
import {getStrValueWithLeadingZero} from "../utils";

const API_URL = "https://www.thesportsdb.com";

/**
 * @description Get all the sport events of the MLB league from a specific date
 * @WARNING: The league parameter is currently hardcoded in the url (l=MLB)
 * @param date: string representation of the date that the matches belong to (YYYY-MM-DD)
 * @returns an array containing objects of type ISportEvent
 */
export async function getEventsAtDate(date: Date): Promise<ISportEvent[]> {
    // The public API breaks if the day/month value do not have a leading 0 when the value is under 10
    // So we will use getStrValueWithLeadingZero which returns the string version with a leading 0
    let dateString: string = `${date.getFullYear()}-${getStrValueWithLeadingZero(date.getMonth() + 1)}-${getStrValueWithLeadingZero(date.getDate())}`; // Example: 2019-05-20

    let response: Response = await fetch(`https://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=${dateString}&s=Soccer`);
    // The sport events are located in the events object of the response JSON
    return (await response.json()).events;
}

/**
 * Just like with getEventsAtDate we get all matches, but this time from a date range instead of specific date
 * it will include the matches between dateStart and dateEnd
 * @param dateStart: the start date of the range
 * @param dateEnd: the end date of the range
 */
export async function getEventsFromDateRange(dateStart: Date, dateEnd: Date): Promise<ISportEvent[]> {
    // We want to compare the date itself, not the time
    dateStart.setHours(0,0,0,0);
    dateEnd.setHours(0,0,0,0);

    let events: ISportEvent[] = [];

    // For each date in the range, we will call getEventsAtDate and merge it results with the events array
    while (dateStart <= dateEnd) {
        let res: ISportEvent[] = await getEventsAtDate(dateStart);

        // If the current date returned no events, then we can skip this date
        if (res == null) {
            dateStart.setDate(dateStart.getDate() + 1);
            continue;
        }

        // An ugly null check so we can make sure all objects have the needed data
        for (let i = 0; i < res.length; i++) {
            if (res[i].idEvent == null) continue;
            if (res[i].strLeague == null) continue;
            if (res[i].strEvent == null) continue;
            if (res[i].strTime == null) continue;
            if (res[i].dateEvent == null) continue;
            if (res[i].strAwayTeam == null) continue;
            if (res[i].strTime == null) continue;
            if (res[i].strHomeTeam == null) continue;
            events.push(res[i]);
        }

        // Advance to the next day when this loop iteration is done
        dateStart.setDate(dateStart.getDate() + 1);
    }

    return events;
}

/**
 * Get a specific event using it's event ID
 * @param id: represents the unique ID of the sport event
 */
export async function getEventFromId(id: number): Promise<ISportEvent> {
    let response: Response = await fetch(API_URL + `/api/v1/json/1/lookupevent.php?id=${id}`);

    if (!response.ok) {
        throw new Error(`Failed to fetch sport event with ID ${id} (${response.status})`);
    }

    return (await response.json()).events[0];
}