import axios from "axios";
import { v4 } from 'uuid';
import ExecutionEnvironment from 'exenv';
import { version } from './version'
import _ from 'lodash'
import CryptoJS from 'crypto-js';
import validator from 'validator';
import { WALLET_REGEX } from "./utils";
import { DisableDataSettings } from "./index";

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
  protected secretKey: string | null;

  constructor(apiKey: string, gameId: string, piiTracking: boolean = true) {
    if (!apiKey || apiKey === '') {
      throw new Error('API Key is required to initiate Helika SDK instance.');
    }
    if (!gameId || gameId === '') {
      throw new Error('Game ID is required to initiate Helika SDK instance.');
    }
    this.apiKey = apiKey;
    this.sessionID = null;
    this.gameId = gameId.toLocaleLowerCase();
    this.sessionExpiry = new Date();
    this.baseUrl = "http://localhost:3000";
    this.piiTracking = piiTracking;
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
      wallet_id: null
    }
    this.secretKey = null;
  }

  public getUserDetails(): any {
    return this.userDetails;
  }

  public setUserDetails(
    details: {
      user_id: string,
      email?: string | undefined,
      wallet_id?: string | undefined,
      [key: string]: any;
    },
    createNewAnon: boolean = false
  ): any {
    if (_.isNil(details?.user_id)) {
      details = {
        user_id: this.generateAnonId(createNewAnon),
        email: undefined,
        wallet_id: undefined,
      }
    }
    if ('user_id' in details && (typeof details.user_id !== 'string' && typeof details.user_id !== 'number')) {
      throw new Error(`User Details property user_id:'${details?.user_id}' must be a string or number.`)
    }
    if ('email' in details && details?.email && !validator.isEmail(details?.email)) {
      throw new Error(`User Details property email:'${details?.email}' is not a valid email addess.`)
    }
    if ('email_address' in details && details?.email_address && !validator.isEmail(details?.email_address)) {
      throw new Error(`User Details property email_address:'${details?.email_address}' is not a valid email addess.`)
    }
    if ('wallet_id' in details && details?.wallet_id && !details?.wallet_id.match(WALLET_REGEX)) {
      throw new Error(`User Details property wallet_id:'${details?.wallet_id}' is not a valid wallet addess.`)
    }
    details.user_id = details.user_id?.toString()
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
    this.appDetails = details;
  }

  public populateDefaultValues(type: string, values: any) {
    switch (type) {
      case 'user_details': {
        let newValues = _.merge({}, values);
        newValues.email = values.email || null;
        newValues.wallet_id = values.wallet_id || null;
        return newValues;
      }
      case 'app_details': {
        let newValues = _.merge({}, values);
        newValues.platform_id = values.platform_id || null;
        newValues.client_app_version = values.client_app_version || null;
        newValues.server_app_version = values.server_app_version || null;
        newValues.store_id = values.store_id || null;
        newValues.source_id = values.source_id || null;
        return newValues;
      }
      default:
        return values
    }
  }

  public getPIITracking() {
    return this.piiTracking;
  }

  public async setPIITracking(piiTracking: boolean) {
    this.piiTracking = piiTracking;
    if (this.piiTracking) {
      try {
        if (ExecutionEnvironment.canUseDOM) {
          //send Pii tracking info if it was just turned on
          var piiEvent: any = this.getTemplateEvent("session_created", "session_data_updated")
          piiEvent.event = _.merge({}, piiEvent.event, {
            type: 'Session Data Refresh',
            sdk_class: "Events"
          })
          piiEvent.event.helika_data = this.appendPIIData(this.appendHelikaData());
          piiEvent.event.app_details = this.appDetails;


          let event_params: any = {
            id: v4(),
            events: [piiEvent]
          }

          let signature = await this.generateSignature(event_params);
          event_params["signature"] = signature;

          try {
            return await this.postRequest(`/game/game-event`, event_params);
          } catch (e: any) {
            this.processEventSentError(e);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public getPlayerId(): string {
    console.warn("getPlayerId() is deprecated. Please use getUserDetails() instead.")
    return "Function is deprecated.";
  }

  public setPlayerId(playerId: string) {
    console.warn("setPlayerId() is deprecated. Please use setUserDetails() instead.")
    // This is deprecated. No-op
  }

  public setDataSettings(settings: DisableDataSettings) {
    console.warn("setDataSettings() is deprecated.")
    // This is deprecated. No-op
  }

  public setSecurityKey(securityKey: string | null) {
    this.secretKey = securityKey;
  }

  async createUAEvent(
    events: {
      event_type: string,
      event: Object
    }[],
  ): Promise<{ message: string }> {
    console.warn("createUAEvent() is deprecated. Please use createEvent() or createUserEvent() instead.")
    return { message: "Function is deprecated." }
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
      game_id: this.gameId?.toLocaleLowerCase(),
      event_type: event_type?.toLocaleLowerCase(),
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
    let piiData = {
      resolution: undefined,
      touch_support: undefined,
      device_type: undefined,
      os: undefined,
      downlink: undefined,
      effective_type: undefined,
      connection_type: undefined
    }
    if (ExecutionEnvironment.canUseDOM) {
      let connectionData: any = window.navigator;
      piiData = _.merge({}, piiData, {
        resolution: `${window.innerWidth}x${window.innerHeight}`,
        touch_support: connectionData?.maxTouchPoints > 0,
        device_type: connectionData?.userAgentData?.mobile ? 'mobile' : connectionData?.userAgentData?.platform,
        os: connectionData?.userAgentData?.platform,
        downlink: connectionData?.connection?.downlink,
        effective_type: connectionData?.connection?.effectiveType,
        connection_type: connectionData?.connection?.type
      });
    }
    helika_data.additional_user_info = piiData;
    return helika_data;
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

    return _.merge({}, helika_data, {
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
    initEvent.event = _.merge({}, initEvent.event, {
      type: params.type,
      sdk_class: params.sdk_class
    })

    initEvent.event.helika_data = this.appendHelikaData();
    if (this.piiTracking) {
      initEvent.event.helika_data = this.appendPIIData(initEvent.event.helika_data);
    }
    initEvent.event.helika_data = this.appendReferralData(initEvent.event.helika_data);

    initEvent.event.app_details = this.appDetails;

    let event_params: any = {
      id: v4(),
      events: [initEvent]
    }

    let signature = await this.generateSignature(event_params);
    event_params["signature"] = signature;

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
    endEvent.event = _.merge({}, endEvent.event, {
      event_sub_type: 'session_end',
      sdk_class: "Events"
    })

    endEvent.event.helika_data = this.appendHelikaData();
    endEvent.event.app_details = this.appDetails;

    let event_params: any = {
      id: v4(),
      events: [endEvent]
    }

    let signature = await this.generateSignature(event_params);
    event_params["signature"] = signature;

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

  protected stringifyPayload(payload: any) {
    // Recursively sort object keys for consistent serialization
    if (typeof payload === 'object' && payload !== null) {
      if (Array.isArray(payload)) {
        let val: string = `[${payload.map((item) => this.stringifyPayload(item)).join(',')}]`;
        return val
      } else {
        const sortedKeys = Object.keys(payload).sort();
        return `{${sortedKeys.map((key: any) => {
          let val: string = ''
          val = `"${key}":${this.stringifyPayload(payload[key])}`
          return val
        }
        ).join(',')}}`;
      }
    }
    return JSON.stringify(payload); // Handles primitive types
  }

  static removeUndefined(obj: any) {
    if (_.isArray(obj)) {
      let newVal: any = _.compact(obj.map((item) => Base.removeUndefined(item)));
      // If the object is an array, recurse through and remove undefined values
      return newVal
    } else if (_.isObject(obj)) {
      let newVal: any = _.omitBy(_.mapValues(obj, Base.removeUndefined), _.isUndefined);
      // If the object is a plain object, omit keys where the value is undefined
      return newVal
    }
    return obj;
  }

  protected async generateSignature(payload: any) {
    if (!this.secretKey) {
      return payload;
    }

    let newPayload = payload
    newPayload = Base.removeUndefined(newPayload);


    // Convert payload to a JSON string
    let payloadString = JSON.stringify(newPayload, Object.keys(newPayload).sort());

    payloadString = this.stringifyPayload(newPayload)

    // Generate the HMAC-SHA256 signature
    const hash = CryptoJS.HmacSHA256(payloadString, this.secretKey);

    // Convert to hexadecimal string
    return hash.toString(CryptoJS.enc.Hex);
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
