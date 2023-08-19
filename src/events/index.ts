import { BaseURLOptions } from "..";
import { Base, Config } from "../base";

export class EVENTS extends Base {

  constructor(config: Config) {
		super(config);
    //switch(config.baseUrlOption) {
    //  case BaseURLOptions.EVENTS_LOCAL:
    //    this.baseUrl = 'http://localhost:8181/v1';
    //  case BaseURLOptions.EVENTS_MAINNET:
    //    this.baseUrl = 'https://api.helika.io/v1';
    //  case BaseURLOptions.EVENTS_TESTNET:
    //  default:
    //    this.baseUrl = 'https://api-stage.helika.io/v1';
    //}
  }


  createEvent(
    id: string,
    events: {
      game_id: string,
      event_type: string,
      event: Object
    }[],
  ): Promise<{message: string}> {

    let created_at = new Date().toISOString();

    let newEvents = events.map(event =>
      {
        return {
          ...event,
          created_at: created_at
        }
      }
    )

    var params:{
      id: string,
      events: {
        created_at: string,
        game_id: string,
        event_type: string,
        event: Object
      }[]
    } = { 
      id: id,
      events: newEvents
    }

    return this.postRequest(`/game/game-event`,params);
  }
  
}