import { Base } from "../base";
import { EventsBaseURL } from "../index";
import ExecutionEnvironment from 'exenv';
import { v4 } from 'uuid';
import { version } from '../version'
import _ from "lodash";

export class EVENTS extends Base {
  constructor(apiKey: string, gameId: string, baseUrl: EventsBaseURL, piiTracking: boolean = true) {
    super(apiKey, gameId, piiTracking);

    switch (baseUrl) {
      case EventsBaseURL.EVENTS_LOCAL: {
        // this.baseUrl = 'http://localhost:3000';
        this.baseUrl = "https://api-stage.helika.io/v1";
        this.enabled = false;
        break;
      }
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

  public async startSession(): Promise<any> {
    try {
      if (ExecutionEnvironment.canUseDOM) {
        // Todo: Move this into the Base Class once Users have been consolidated
        return await this.sessionCreate({
          sdk_class: "Events",
          type: 'Session Start'
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  public async createEvent(
    events: {
      event_type: string,
      event: {
        event_details: Object,
        [key: string]: any;
      }
    }[],
  ): Promise<{ message: string }> {
    await this.refreshSessionIdFromStorage();

    if (!this.sessionID) {
      throw new Error('Could not create event. No session id. Please initiate a session first (See Helika Docs).');
    }
    this.extendSession();

    let params: any = this.prepareEventParams(events, false)
    let signature = await this.generateSignature(params);
    params["signature"] = signature;

    return this.postRequest(`/game/game-event`, params);
  }

  public async createUserEvent(
    events: {
      event_type: string,
      event: {
        event_details: Object,
        [key: string]: any;
      }
    }[],
  ): Promise<{ message: string }> {
    await this.refreshSessionIdFromStorage();

    if (!this.sessionID) {
      throw new Error('Could not create event. No session id. Please initiate a session first (See Helika Docs).');
    }

    let params: any = this.prepareEventParams(events, true);

    let eventHasUserId = params?.events?.filter((event: any) => {
      return _.isNil(event?.event?.user_details?.user_id)
    })

    if (!_.isEmpty(eventHasUserId)) {
      throw new Error('Before sending user events, user_id must be set using sdk.setUserDetails()')
    }

    this.extendSession();

    let signature = await this.generateSignature(params);
    params["signature"] = signature;

    return this.postRequest(`/game/game-event`, params);
  }

  protected async refreshSessionIdFromStorage() {
    if (ExecutionEnvironment.canUseDOM) {
      let local_storage_id = localStorage.getItem('sessionID');
      let expiry = localStorage.getItem('sessionExpiry');
      if (local_storage_id && expiry) {
        if (new Date(expiry) < new Date()) {
          await this.refreshSession();
        } else {
          this.sessionID = local_storage_id;
          this.sessionExpiry = new Date(expiry);
        }
      } else if (this.sessionID) { // edge case where localstorage was cleared
        localStorage.setItem('sessionID', this.sessionID);
      }
    }
  }

  protected async refreshSession(): Promise<any> {
    try {
      if (ExecutionEnvironment.canUseDOM) {
        // Todo: Move this into the Base Class once Users have been consolidated
        return await this.sessionCreate({
          sdk_class: "Events",
          type: 'Session Refresh'
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  private prepareEventParams(
    events: {
      event_type: string,
      event: {
        event_details: Object,
        [key: string]: any;
      }
    }[], isUserEvent: boolean) {

    let templateEvent: any = this.getTemplateEvent("");

    let updatedEvents = events.map((event: any) => {
      let givenEvent: any = _.merge(
        {},
        event,
        templateEvent
      );

      givenEvent.event_type = event.event_type?.toLocaleLowerCase();
      givenEvent.event.event_sub_type = event.event.event_sub_type ? event.event.event_sub_type : null;
      givenEvent.event.app_details = this.populateDefaultValues('app_details', _.merge({}, event.event.app_details, this.appDetails));
      if (isUserEvent) {
        givenEvent.event.user_details = this.populateDefaultValues('user_details', _.merge({}, event.event.user_details, this.userDetails));
      }
      givenEvent.event.helika_data = this.appendHelikaData();
      givenEvent.event.helika_data = this.appendReferralData(givenEvent.event.helika_data)

      if (!isUserEvent) {
        delete givenEvent.event.user_details;

        // replace the user_id with the 'anonId' because we just want to attach this non-user event data to a source.
        givenEvent.event.user_id = this.anonId;
      }

      return givenEvent;
    });

    var params: {
      id: string,
      events: {
        created_at: string,
        game_id: string,
        event_type: string,
        event: Object
      }[]
    } = {
      id: v4(),
      events: updatedEvents
    }

    return params;
  }

}