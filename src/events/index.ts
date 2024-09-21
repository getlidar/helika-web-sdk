import { Base } from "../base";
import { EventsBaseURL } from "../index";
import ExecutionEnvironment from 'exenv';
import { v4 } from 'uuid';
import { version } from '../version'

export class EVENTS extends Base {
  protected playerId: string;

  constructor(apiKey: string, gameId: string, baseUrl: EventsBaseURL) {
    super(apiKey, gameId);
    this.playerId = "";

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

  public getPlayerId(): string {
    return this.playerId;
  }

  public setPlayerId(playerId: string) {
    this.playerId = playerId;
  }

  async startSession(): Promise<any> {
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

  async createUserEvent(
    user_id: string,
    events: {
      event_type: string,
      event: Object
    }[],
    user_details: any,
    event_details: any,
    store_id?: string,
    server_version?: string,
  ): Promise<{ message: string }> {
    await this.refreshSessionIdFromStorage();

    if (!this.sessionID) {
      throw new Error('Could not create event. No session id. Please initiate a session first (See Helika Docs).');
    }

    let created_at = new Date().toISOString();
    let helika_referral_link: any = null;
    let utms: any = null;
    let current_url: string = "";
    let connectionData: any = window.navigator;
    let device_details: any = {};
    let event_source = 'server';
    try {
      if (ExecutionEnvironment.canUseDOM) {
        helika_referral_link = this.refreshLinkId();
        utms = this.refreshUtms();
        current_url = window.location.href;
        device_details = {
          platform_id: connectionData?.userAgentData?.platform,
          app_version: connectionData?.appVersion,
          server_version: server_version,
          store_id: store_id,
        }
        event_source = 'client'
      }
    } catch (e) {
      console.error(e);
    }

    let newEvents = events.map((event: any) => {
      console.log('event', event)
      let givenEvent: any = Object.assign(
        {},
        event,
        {
          device_details: device_details,
          user_details: user_details,
          event_details: event_details,
          helika_data: {
            anon_id: v4(),
            event_source: event_source,
            taxonomy_ver: 'v1',
            resolution: ExecutionEnvironment.canUseDOM ? `${window.innerWidth}x${window.innerHeight}` : undefined,
            touch_support: ExecutionEnvironment.canUseDOM ? (connectionData.maxTouchPoints > 0) : undefined,
            device_type: (ExecutionEnvironment.canUseDOM && connectionData?.userAgentData && 'mobile' in connectionData?.userAgentData) ? (connectionData?.userAgentData?.mobile ? 'mobile' : connectionData?.userAgentData?.platform) : undefined,
            os: ExecutionEnvironment.canUseDOM ? connectionData?.userAgentData?.platform : undefined,
            downlink: ExecutionEnvironment.canUseDOM ? connectionData?.connection?.downlink : undefined,
            effective_type: ExecutionEnvironment.canUseDOM ? connectionData?.connection?.effectiveType : undefined,
            connection_type: ExecutionEnvironment.canUseDOM ? connectionData?.connection?.type : undefined,
            sdk_name: "Web",
            sdk_version: version,
            sdk_platform: ExecutionEnvironment.canUseDOM ? 'browser' : 'non-browser',
          }
        }
      );
      givenEvent.event.helika_referral_link = helika_referral_link;
      givenEvent.event.utms = utms;
      givenEvent.event.url = current_url;
      if (event.event.session_id) {
        givenEvent.event.client_session_id = event.event.session_id
      }
      givenEvent.event.session_id = this.sessionID;
      givenEvent.event.player_id = this.playerId;
      givenEvent.created_at = created_at;
      givenEvent.game_id = this.gameId;
      return givenEvent;
    });

    var params: {
      id: string,
      user_id: string,
      events: {
        created_at: string,
        game_id: string,
        event_type: string,
        event: Object
      }[]
    } = {
      id: v4(),
      user_id: user_id,
      events: newEvents
    }

    this.extendSession();

    return this.postRequest(`/game/game-event`, params);
  }

  async createEvent(
    events: {
      event_type: string,
      event: Object
    }[],
  ): Promise<{ message: string }> {
    await this.refreshSessionIdFromStorage();

    if (!this.sessionID) {
      throw new Error('Could not create event. No session id. Please initiate a session first (See Helika Docs).');
    }

    let created_at = new Date().toISOString();
    let helika_referral_link: any = null;
    let utms: any = null;
    let current_url: string = "";
    try {
      if (ExecutionEnvironment.canUseDOM) {
        helika_referral_link = this.refreshLinkId();
        utms = this.refreshUtms();
        current_url = window.location.href;
      }
    } catch (e) {
      console.error(e);
    }

    let newEvents = events.map((event: any) => {
      let givenEvent: any = Object.assign({}, event);
      givenEvent.event.helika_referral_link = helika_referral_link;
      givenEvent.event.utms = utms;
      givenEvent.event.url = current_url;
      if (event.event.session_id) {
        givenEvent.event.client_session_id = event.event.session_id
      }
      givenEvent.event.session_id = this.sessionID;
      givenEvent.event.player_id = this.playerId;
      givenEvent.created_at = created_at;
      givenEvent.game_id = this.gameId;
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
      events: newEvents
    }

    this.extendSession();

    return this.postRequest(`/game/game-event`, params);
  }

  async createUAEvent(
    events: {
      event_type: string,
      event: Object
    }[],
  ): Promise<{ message: string }> {

    await this.refreshSessionIdFromStorage();

    if (!this.sessionID) throw new Error('SDK Session has not been started. Please call the SessionStart function to initialize instance with a Session ID.');

    let created_at = new Date().toISOString();
    let helika_referral_link: any = null;
    let utms: any = null;
    let current_url: string = "";
    try {
      if (ExecutionEnvironment.canUseDOM) {
        helika_referral_link = this.refreshLinkId();
        utms = this.refreshUtms();
        current_url = window.location.href;
      }
    } catch (e) {
      console.error(e);
    }

    let newEvents = events.map((event: any) => {
      let givenEvent: any = Object.assign({}, event);
      givenEvent.event.helika_referral_link = helika_referral_link;
      givenEvent.event.utms = utms;
      givenEvent.event.url = current_url;
      if (event.event.session_id) {
        givenEvent.event.client_session_id = event.event.session_id
      }
      givenEvent.event.session_id = this.sessionID;
      givenEvent.created_at = created_at;
      givenEvent.game_id = 'UA';
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
      events: newEvents
    }

    this.extendSession();

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

}