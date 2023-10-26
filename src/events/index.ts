import { Base } from "../base";
import { EventsBaseURL } from "../index";
import ExecutionEnvironment from 'exenv';

export class EVENTS extends Base {

  constructor(apiKey: string, baseUrl: EventsBaseURL, newSessionId?: boolean) {
    super(apiKey);

    switch (baseUrl) {
      // case EventsBaseURL.LOCAL: {
      //   this.baseUrl = 'http://localhost:3000';
      //   break;
      // }
      case EventsBaseURL.EVENTS_PROD: {
        this.baseUrl = "https://api.helika.io/v1";
        break;
      }
      case EventsBaseURL.EVENTS_DEV:
      default: {
        this.baseUrl = "https://api-stage.helika.io/v1";
        break;
      }
    }

  }

  async startSession(): Promise<any> {
    if (ExecutionEnvironment.canUseDOM) {
      // Todo: Move this into the Base Class once Users have been consolidated
      return await this.sessionCreate({
        sdk_class: "Events",
        type: 'Session Start'
      });
    }
  }

  protected async refreshSession(): Promise<any> {
    if (ExecutionEnvironment.canUseDOM) {
      // Todo: Move this into the Base Class once Users have been consolidated
      return await this.sessionCreate({
        sdk_class: "Events",
        type: 'Session Refresh'
      });
    }
  }

  async createEvent(
    events: {
      game_id: string,
      event_type: string,
      event: Object
    }[],
  ): Promise<{ message: string }> {

    await this.updateSessionIdAndStorage();

    if (!this.sessionID) throw new Error('SDK Session has not been started. Please call the SessionStart function to initialize instance with a Session ID.');

    let created_at = new Date().toISOString();
    let fingerprint_data:any = {};
    let helika_referral_link:any = null;
    let utms:any = null;
    try {
      if (ExecutionEnvironment.canUseDOM) {
        fingerprint_data = await this.fingerprint();
        helika_referral_link = localStorage.getItem('helika_referral_link');
        utms = localStorage.getItem('helika_utms');
      }
    } catch(e){
      console.log(e);
    }

    let newEvents = events.map(event => {
      let givenEvent: any = Object.assign({}, event);
      givenEvent.event.fingerprint = fingerprint_data;
      givenEvent.event.helika_referral_link = helika_referral_link;
      givenEvent.event.utms = utms;
      givenEvent.event.sessionID = this.sessionID;
      givenEvent.created_at = created_at;
      return givenEvent;
    }
    );

    var params: {
      id: string,
      events: {
        created_at: string,
        game_id: string,
        event_type: string,
        event: Object
      }[]
    } = {
      id: this.sessionID,
      events: newEvents
    }

    return this.postRequest(`/game/game-event`, params);
  }

  async createUAEvent(
    events: {
      event_type: string,
      event: Object
    }[],
  ): Promise<{ message: string }> {

    await this.updateSessionIdAndStorage();

    if (!this.sessionID) throw new Error('SDK Session has not been started. Please call the SessionStart function to initialize instance with a Session ID.');

    let created_at = new Date().toISOString();
    let fingerprint_data:any = {};
    let helika_referral_link:any = null;
    let utms:any = null;
    try {
      if (ExecutionEnvironment.canUseDOM) {
        fingerprint_data = await this.fingerprint();
        helika_referral_link = localStorage.getItem('helika_referral_link');
        utms = localStorage.getItem('helika_utms');
      }
    } catch(e){
      console.log(e);
    }

    let newEvents = events.map(event => {
      let givenEvent: any = Object.assign({}, event);
      givenEvent.event.fingerprint = fingerprint_data;
      givenEvent.event.helika_referral_link = helika_referral_link;
      givenEvent.event.utms = utms;
      givenEvent.event.sessionID = this.sessionID;
      givenEvent.created_at = created_at;
      givenEvent.game_id = 'UA';
      return givenEvent;
    }
    );

    var params: {
      id: string,
      events: {
        created_at: string,
        game_id: string,
        event_type: string,
        event: Object
      }[]
    } = {
      id: this.sessionID,
      events: newEvents
    }

    return this.postRequest(`/game/game-event`, params);
  }

  protected async updateSessionIdAndStorage(){
    if (ExecutionEnvironment.canUseDOM) {
      let local_storage_id = localStorage.getItem('sessionID');
      let expiry = localStorage.getItem('sessionExpiry');
      if (local_storage_id && expiry) {
        if (new Date(expiry) < new Date()) {
          await this.refreshSession();
        }  else {
          this.sessionID = local_storage_id;
          this.sessionExpiry = new Date(expiry);
        }
      } else if (this.sessionID) { // edge case where localstorage was cleared
        localStorage.setItem('sessionID',this.sessionID);
        const sessionExpiry = this.addHours(new Date(), 1);
        localStorage.setItem('sessionExpiry',sessionExpiry);
      }
    }
  }

}