import { Base, Config } from "../base";

export class EVENTS extends Base {

  constructor(config: Config) {
		super(config);
  }

  async fingerprint(): Promise<any> {
    let func = await this.getFP();
    let loaded = await func.load();
    let fingerprintData = await loaded.get();
    return fingerprintData?.visitorId;
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