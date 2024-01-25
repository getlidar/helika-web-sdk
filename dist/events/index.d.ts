import { Base } from "../base";
import { EventsBaseURL } from "../index";
export declare class EVENTS extends Base {
    protected playerId: string;
    constructor(apiKey: string, gameId: string, baseUrl: EventsBaseURL);
    getPlayerId(): string;
    setPlayerId(playerId: string): void;
    startSession(): Promise<any>;
    protected refreshSession(): Promise<any>;
    createEvent(events: {
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
    protected refreshSessionIdFromStorage(): Promise<void>;
}
