import { Base, Config } from "../base";

export class EVENTS extends Base {

  constructor(config: Config) {
		super(config);
  }

  async fingerprint(): Promise<any> {
    let func = await this.getFP();
    let loaded = await func.load();
    let fingerprintData = await loaded.get();
    return {
      fingerprint_id: fingerprintData?.visitorId,
      request_id: fingerprintData?.requestId
    }
  }

  async createEvent(
    id: string,
    events: {
      game_id: string,
      event_type: string,
      event: Object
    }[],
  ): Promise<{message: string}> {

    let created_at = new Date().toISOString();
    let fingerprint_data = await this.fingerprint();

    let newEvents = events.map(event =>
      {
        let givenEvent:any = event;
        givenEvent.event.fingerprint = fingerprint_data;
        return {
          ...event,
          created_at: created_at
        }
      }
    );

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

  async createUAEvent(
    id: string,
    events: {
      event_type: string,
      event: Object
    }[],
  ): Promise<{message: string}> {

    let created_at = new Date().toISOString();
    let fingerprint_data = await this.fingerprint();

    let newEvents = events.map(event =>
      {
        let givenEvent:any = event;
        givenEvent.event.fingerprint = fingerprint_data;
        return {
          ...event,
          game_id: 'UA',
          created_at: created_at
        }
      }
    );

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