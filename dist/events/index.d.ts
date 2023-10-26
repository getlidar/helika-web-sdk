import { Base } from "../base";
import { EventsBaseURL } from "../index";
export declare class EVENTS extends Base {
    constructor(apiKey: string, baseUrl: EventsBaseURL, newSessionId?: boolean);
    startSession(): Promise<any>;
    refreshSession(): Promise<any>;
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
    updateSessionIdAndStorage(): Promise<void>;
}
