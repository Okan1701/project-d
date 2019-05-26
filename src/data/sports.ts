import {ISportEvent} from "./interfaces";
import {getStrValueWithLeadingZero} from "../utils";

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

    let response: Response = await fetch(`https://www.thesportsdb.com/api/v1/json/1/eventsday.php?d=${dateString}&l=MLB`);
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
        events = events.concat(res);
        dateStart.setDate(dateStart.getDate() + 1);
    }

    return events;
}