import { Base } from "../base";
import { EventsBaseURL } from "../index";
export declare class EVENTS extends Base {
    constructor(apiKey: string, baseUrl: EventsBaseURL);
    createEvent(events: {
        game_id: string;
        event_type: string;
        event: Object;
    }[]): Promise<{
        message: string;
    }>;
    createUAEvent(events: {
        event_type: string;
        event: Object;
    }[]): Promise<{
        message: string;
    }>;
}
