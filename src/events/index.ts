import { Base, Config } from "../base";

export class EVENTS extends Base {

  constructor(config: Config) {
		super(config);
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
    let helika_referral_link = this.getUrlParam('linkId');
    let utms = this.getAllUrlParams();

    let newEvents = events.map(event =>
      {
        let givenEvent:any = Object.assign({},event);
        givenEvent.event.fingerprint = fingerprint_data;
        givenEvent.event.helika_referral_link = helika_referral_link;
        givenEvent.event.utms = utms;
        givenEvent.event.sessionID = this.sessionID;
        return Object.assign({},givenEvent,{
          created_at: created_at,
        });
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
    let helika_referral_link = this.getUrlParam('linkId');
    let utms = this.getAllUrlParams();

    let newEvents = events.map(event =>
      {
        let givenEvent:any = Object.assign({},event);
        givenEvent.event.fingerprint = fingerprint_data;
        givenEvent.event.helika_referral_link = helika_referral_link;
        givenEvent.event.utms = utms;
        givenEvent.event.sessionID = this.sessionID;
        return Object.assign({},givenEvent,{
          created_at: created_at,
          game_id: 'UA'
        });
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