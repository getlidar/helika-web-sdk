import axios from "axios";
import { v4 } from 'uuid';
import ExecutionEnvironment from 'exenv';
import { version } from './version'
import _ from 'lodash'
import CryptoJS from 'crypto-js';
import validator from 'validator';
import { WALLET_REGEX } from "./utils";

export abstract class Base {
  private apiKey: string;
  protected baseUrl: string;
  protected gameId: string;
  protected sessionID: string | null;
  protected sessionExpiry: any;
  protected piiTracking: boolean;
  protected enabled: boolean;
  protected appDetails: any;
  protected userDetails: any;
  protected anonId: string;

  constructor(apiKey: string, gameId: string) {
    if (!apiKey || apiKey === '') {
      throw new Error('API Key is required to initiate Helika SDK instance.');
    }
    if (!gameId || gameId === '') {
      throw new Error('Game ID is required to initiate Helika SDK instance.');
    }
    this.apiKey = apiKey;
    this.sessionID = null;
    this.gameId = gameId;
    this.sessionExpiry = new Date();
    this.baseUrl = "http://localhost:3000";
    this.piiTracking = true;
    this.enabled = true;
    this.appDetails = {
      platform_id: null,
      client_app_version: null,
      server_app_version: null,
      store_id: null,
      source_id: null,
    };
    this.anonId = this.generateAnonId()
    this.userDetails = {
      user_id: this.anonId,
      email: null,
      wallet: null
    }
  }

  public getUserDetails(): any {
    return this.userDetails;
  }

  public setUserDetails(
    details: {
      user_id: string | null,
      email?: string | undefined,
      wallet?: string | undefined,
      [key: string]: any;
    },
    createNewAnon: boolean = false
  ): any {
    if (_.isNil(details?.user_id)) {
      details = {
        user_id: this.generateAnonId(createNewAnon),
        email: undefined,
        wallet: undefined,
      }
    }
    if ('email' in details && details?.email && !validator.isEmail(details?.email)) {
      throw new Error(`User Details property email:'${details?.email}' is not a valid email addess.`)
    }
    if ('wallet' in details && details?.wallet && !details?.wallet.match(WALLET_REGEX)) {
      throw new Error(`User Details property wallet:'${details?.wallet}' is not a valid wallet addess.`)
    }

    this.userDetails = details;
  }

  public getAppDetails(): any {
    return this.appDetails;
  }

  public setAppDetails(details: {
    platform_id?: string | undefined,
    client_app_version?: string | undefined,
    server_app_version?: string | undefined,
    store_id?: string | undefined,
    source_id?: string | undefined,
    [key: string]: any;
  }): any {
    this.appDetails = Object.assign({}, this.appDetails, details)
  }

  public getPIITracking() {
    return this.piiTracking;
  }

  public setPIITracking(piiTracking: boolean) {
    this.piiTracking = piiTracking;
    if (this.piiTracking) {
      // todo: when PII tracking is turned on, send PII tracking data for this session
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  protected generateAnonId(bypassStored: boolean = false): any {
    let hash: any = CryptoJS.SHA256(v4());
    hash = `anon_${hash.toString(CryptoJS.enc.Hex)}`

    if (ExecutionEnvironment.canUseDOM && !bypassStored) {
      let storedHash = localStorage.getItem('helikaAnonId');
      if (!_.isEmpty(storedHash)) {
        return storedHash;
      }
      localStorage.setItem('helikaAnonId', hash);
    }
    return hash
  }

  protected getTemplateEvent(event_type: string, event_sub_type?: string) {
    return {
      created_at: new Date().toISOString(),
      game_id: this.gameId,
      event_type: event_type,
      event: {
        user_id: this.userDetails.user_id,
        session_id: this.sessionID,
        event_sub_type: event_sub_type ? event_sub_type : null,
      }
    }
  }

  protected appendHelikaData(): any {
    let helikaData = {
      anon_id: this.anonId,
      taxonomy_ver: 'v2',
      sdk_name: "Web",
      sdk_version: version,
      sdk_platform: 'web-sdk',
      event_source: ExecutionEnvironment.canUseDOM ? 'client' : 'server',
      pii_tracking: this.piiTracking,
    };

    return helikaData;
  }

  protected appendPIIData(helika_data: any): any {
    let defaultObject = Object.assign({}, helika_data, {
      resolution: undefined,
      touch_support: undefined,
      device_type: undefined,
      os: undefined,
      downlink: undefined,
      effective_type: undefined,
      connection_type: undefined
    });
    if (ExecutionEnvironment.canUseDOM) {
      let connectionData: any = window.navigator;
      return Object.assign({}, defaultObject, {
        resolution: `${window.innerWidth}x${window.innerHeight}`,
        touch_support: connectionData?.maxTouchPoints > 0,
        device_type: connectionData?.userAgentData?.mobile ? 'mobile' : connectionData?.userAgentData?.platform,
        os: connectionData?.userAgentData?.platform,
        downlink: connectionData?.connection?.downlink,
        effective_type: connectionData?.connection?.effectiveType,
        connection_type: connectionData?.connection?.type
      });
    }
    return defaultObject;
  }

  protected appendReferralData(helika_data: any): any {
    let utms = this.refreshUtms();
    let helika_referral_link = this.refreshLinkId();
    let current_url: string = "";
    let referral_code = "";

    if (ExecutionEnvironment.canUseDOM) {
      current_url = window.location.href;
    }

    // todo: add referral_code info if any

    return Object.assign({}, helika_data, {
      referral_data: {
        utms: utms,
        link_id: helika_referral_link,
        url: current_url,
        referral_code: referral_code
      }
    });
  }

  protected getUrlParam(paramName: string) {
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  }

  protected getAllUrlParams() {
    let url = window.location.href;

    if (url.indexOf('?') != -1) {
      var params = url.split('?')[1].split('&');
      return params.map(pair => {
        let values = pair.split('=');
        return {
          key: values[0],
          value: values[1]
        }
      });
    }
    return [];
  }

  protected refreshUtms() {
    try {
      if (ExecutionEnvironment.canUseDOM) {
        // Grab all utms, store it, and return it
        let utms: any = this.getAllUrlParams();
        if (!_.isEmpty(utms)) {
          localStorage.setItem('helika_utms', JSON.stringify(utms))
          return utms
        }

        // url utms is empty
        let storedUtms = localStorage.getItem('helika_utms')
        if (storedUtms && !_.isEmpty(storedUtms)) {
          return JSON.parse(storedUtms)
        }
      }
    } catch (e) {
      console.error(e);
    }

    // no utms were found 
    return null;
  }

  protected refreshLinkId() {
    try {
      if (ExecutionEnvironment.canUseDOM) {
        let helika_referral_link = this.getUrlParam('linkId');
        if (helika_referral_link && !_.isEmpty(helika_referral_link)) {
          localStorage.setItem('helika_referral_link', helika_referral_link);
          return helika_referral_link
        }

        return localStorage.getItem('helika_referral_link');
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  protected getRequest<T>(endpoint: string, options?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
    };
    const config = {
      params: options,
      headers: headers,
    };
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}`, config)
        .then((resp: any) => {
          resolve(resp.data);
        })
        .catch(reject);
    });
  }

  protected postRequest<T>(endpoint: string, options?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
    };
    const config = {
      headers,
    };

    return new Promise((resolve, reject) => {
      if (!this.enabled) {
        console.log("Body: ", options);
        resolve({ message: 'Logged event' });
      } else {
        axios
          .post(`${url}`, options, config)
          .then((resp: any) => {
            resolve(resp.data);
          })
          .catch(reject);
      }
    });
  }

  protected async sessionCreate<T>(params?: any): Promise<any> {
    this.sessionID = v4();
    this.sessionExpiry = this.addMinutes(new Date(), 15);

    try {
      if (ExecutionEnvironment.canUseDOM) {
        if (params.type === 'Session Start') {
          let local_session_id = localStorage.getItem('sessionID');
          let expiry = localStorage.getItem('sessionExpiry');
          if (local_session_id && expiry && (new Date(expiry) > new Date())) {
            this.sessionID = local_session_id;
            localStorage.setItem('sessionExpiry', this.sessionExpiry.toString());
            return;
          }
        }
        localStorage.setItem('sessionID', this.sessionID ? this.sessionID : "");
        localStorage.setItem('sessionExpiry', this.sessionExpiry.toString());
      }
    } catch (e) {
      console.error(e);
    }

    //send event to initiate session
    var initEvent: any = this.getTemplateEvent("session_created", "session_created")
    initEvent.event = Object.assign({}, initEvent.event, {
      type: params.type,
      sdk_class: params.sdk_class
    })

    if (this.piiTracking) {
      initEvent.event = this.appendPIIData(initEvent.event);
    }

    let event_params = {
      id: v4(),
      events: [initEvent]
    }

    try {
      return await this.postRequest(`/game/game-event`, event_params);
    } catch (e: any) {
      this.processEventSentError(e);
    }
  }

  protected async endSession<T>(params?: any): Promise<any> {
    //send event to initiate session
    var endEvent: any = this.getTemplateEvent("session_end", "session_end")
    endEvent.event_type = "";
    endEvent.event = Object.assign({}, endEvent.event, {
      event_sub_type: 'session_end',
      sdk_class: "Events"
    })

    let event_params = {
      id: v4(),
      events: [endEvent]
    }

    try {
      return await this.postRequest(`/game/game-event`, event_params);
    } catch (e: any) {
      this.processEventSentError(e);
    }
  }

  protected processEventSentError(e: any) {
    if (
      e && 'response' in e && 'data' in e.response && 'message' in e.response.data &&
      e.response.data.message.startsWith('Internal server error - Invalid API key:')
    ) {
      this.sessionID = null;
      if (ExecutionEnvironment.canUseDOM) {
        localStorage.removeItem('sessionID');
      }
      throw new Error('Error: Invalid API key. Please re-initiate the Helika SDK with a valid API Key.');
    }
    throw new Error(e.message);
  }

  protected addHours(date: Date, hours: number) {
    date.setHours(date.getHours() + hours);
    return date.toString();
  }

  protected addMinutes(date: Date, minutes: number) {
    date.setMinutes(date.getMinutes() + minutes);
    return date.toString();
  }

  protected extendSession() {
    this.sessionExpiry = this.addMinutes(new Date(), 15);
    if (ExecutionEnvironment.canUseDOM) {
      localStorage.setItem('sessionExpiry', this.sessionExpiry);
    };
  }
}
