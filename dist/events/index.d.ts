import { Base, Config } from "../base";
export declare class EVENTS extends Base {
    constructor(config: Config);
    createEvent(id: string, events: {
        game_id: string;
        event_type: string;
        event: Object;
    }[]): Promise<{
        message: string;
    }>;
    createUAEvent(id: string, events: {
        event_type: string;
        event: Object;
    }[]): Promise<{
        message: string;
    }>;
}
