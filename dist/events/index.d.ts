import { Base } from "../base";
import { EventsBaseURL } from "../index";
export declare class EVENTS extends Base {
    protected playerId: string;
    constructor(apiKey: string, gameId: string, baseUrl: EventsBaseURL);
    getPlayerId(): string;
    setPlayerId(playerId: string): void;
    startSession(): Promise<any>;
    protected refreshSession(): Promise<any>;
    createUserEvent(user_id: string, events: {
        event_type: string;
        event: Object;
    }[], user_details: any, event_details: any, store_id?: string, server_version?: string): Promise<{
        message: string;
    }>;
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
