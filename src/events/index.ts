import { Base } from "../base";
import { EventsBaseURL } from "../index";

export class EVENTS extends Base {

  constructor(apiKey: string, baseUrl: EventsBaseURL) {
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

    // Todo: Move this into the Base Class once Users have been consolidated
    this.onSessionCreated({
      sdk_class: "Events"
    });
  }

  async createEvent(
    events: {
      game_id: string,
      event_type: string,
      event: Object
    }[],
  ): Promise<{ message: string }> {

    let created_at = new Date().toISOString();
    let fingerprint_data = await this.fingerprint();
    let helika_referral_link = this.getUrlParam('linkId');
    let utms = this.getAllUrlParams();

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

    let created_at = new Date().toISOString();
    let fingerprint_data = await this.fingerprint();
    let helika_referral_link = this.getUrlParam('linkId');
    let utms = this.getAllUrlParams();

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

}