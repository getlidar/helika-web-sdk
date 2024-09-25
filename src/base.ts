import axios from "axios";
import { DisableDataSettings, fingerprint } from "./index";
import { v4 } from 'uuid';
import ExecutionEnvironment from 'exenv';
import { version } from './version'
import _ from 'lodash'
import CryptoJS from 'crypto-js';

const fpApiKey = '1V2jYOavAUDljc9GxEgu';

export abstract class Base {
  private apiKey: string;
  protected baseUrl: string;
  protected gameId: string;
  protected sessionID: string | null;
  protected sessionExpiry: any;
  protected disabledDataSettings: DisableDataSettings;
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
    this.disabledDataSettings = DisableDataSettings.None;
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

  public setUserDetails(details: {
    user_id: string,
    email?: string | undefined,
    wallet?: string | undefined,
    [key: string]: any;
  }): any {
    this.userDetails = Object.assign({}, this.userDetails, details)
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

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  protected generateAnonId(): any {
    let hash: any = CryptoJS.SHA256(v4());
    hash = `anon_${hash.toString(CryptoJS.enc.Hex)}`

    if (ExecutionEnvironment.canUseDOM) {
      let storedHash = localStorage.getItem('helikaAnonId');
      if (!_.isEmpty(storedHash)) {
        return storedHash;
      }
      localStorage.setItem('helikaAnonId', hash);
    }
    return hash
  }

  protected getDeviceDetails(): any {
    let defaultObject = {
      anon_id: this.anonId,
      taxonomy_ver: 'v2',
      resolution: undefined,
      touch_support: undefined,
      device_type: undefined,
      os: undefined,
      downlink: undefined,
      effective_type: undefined,
      connection_type: undefined,
      sdk_name: "Web",
      sdk_version: version,
      sdk_platform: 'web-sdk',
      event_source: 'server'
    }
    if (ExecutionEnvironment.canUseDOM) {
      let connectionData: any = window.navigator;
      return Object.assign({}, defaultObject, {
        resolution: `${window.innerWidth}x${window.innerHeight}`,
        touch_support: connectionData?.maxTouchPoints > 0,
        device_type: connectionData?.userAgentData?.mobile ? 'mobile' : connectionData?.userAgentData?.platform,
        os: connectionData?.userAgentData?.platform,
        downlink: connectionData?.connection?.downlink,
        effective_type: connectionData?.connection?.effectiveType,
        connection_type: connectionData?.connection?.type,
        event_source: 'client'
      });
    }
    return defaultObject;
  }

  protected async fingerprint(): Promise<any> {
    let loadOptions = {
      apiKey: fpApiKey,
      scriptUrlPattern: [
        `https://yard.helika.io/8nc7wiyuwhncrhw3/01cb9q093c?apiKey=${fpApiKey}&version=<version>&loaderVersion=<loaderVersion>`,
        fingerprint.defaultScriptUrlPattern, // Fallback to default CDN in case of error
      ],
      endpoint: [
        'https://yard.helika.io/8nc7wiyuwhncrhw3/o9wn3zvyblw3v8yi8?region=us',
        fingerprint.defaultEndpoint // Fallback to default endpoint in case of error
      ],
    };
    let fingerprintData = null;
    try {
      let loaded = await fingerprint.load(loadOptions);
      fingerprintData = await loaded.get();
      return {
        fingerprint_id: fingerprintData?.visitorId,
        request_id: fingerprintData?.requestId
      }
    } catch (e) {
      console.error('Error loading fingerprint data');
      return {};
    }
  }

  protected async fullFingerprint(): Promise<any> {
    try {

      let loadOptions = {
        apiKey: fpApiKey,
        scriptUrlPattern: [
          `https://yard.helika.io/8nc7wiyuwhncrhw3/01cb9q093c?apiKey=${fpApiKey}&version=3&loaderVersion=3.8.6`,
          fingerprint.defaultScriptUrlPattern, // Fallback to default CDN in case of error
        ],
        endpoint: [
          'https://yard.helika.io/8nc7wiyuwhncrhw3/o9wn3zvyblw3v8yi8?region=us',
          fingerprint.defaultEndpoint // Fallback to default endpoint in case of error
        ],
      };
      let loaded = await fingerprint.load(loadOptions);
      let fingerprintData = await loaded.get({
        extendedResult: true
      });

      if (this.disabledDataSettings & DisableDataSettings.BrowserInfo) {
        fingerprintData.browserName = "";
        fingerprintData.browserVersion = "";
        fingerprintData.incognito = false;
      }

      if (this.disabledDataSettings & DisableDataSettings.DeviceInfo) {
        fingerprintData.device = "";
      }

      if (this.disabledDataSettings & DisableDataSettings.IpInfo) {
        fingerprintData.ip = "";
        delete fingerprintData?.ipLocation;
      }

      if (this.disabledDataSettings & DisableDataSettings.OsInfo) {
        fingerprintData.os = "";
        fingerprintData.osVersion = "";
      }

      // if (this.disabledDataSettings & DisableDataSettings.VpnInfo) {
      //   // Not here
      // }

      return fingerprintData;
    } catch (e) {
      console.error('Error loading fingerprint data');
      return {};
    }
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
    let fpData: any = {};

    try {
      if (ExecutionEnvironment.canUseDOM) {
        if (params.type === 'Session Start') {
          let local_session_id = localStorage.getItem('sessionID');
          let expiry = localStorage.getItem('sessionExpiry');
          if (local_session_id && expiry && (new Date(expiry) > new Date())) {
            this.sessionID = local_session_id;
            localStorage.setItem('sessionExpiry', this.sessionExpiry.toString());
            return;
          } else {
            // Only grab fingerprint data if it's a new session and fingerprint data not expired yet
            let helikaFpData = localStorage.getItem('helikaFpData');
            let helikaFpExpiry = localStorage.getItem('helikaFpExpiry');
            if (helikaFpData && helikaFpExpiry && (new Date(helikaFpExpiry) > new Date())) {
              fpData = JSON.parse(helikaFpData)
            } else {
              fpData = await this.fullFingerprint();
              let now = new Date()
              localStorage.setItem('helikaFpData', JSON.stringify(fpData))
              localStorage.setItem('helikaFpExpiry', new Date(now.setDate(now.getDate() + 7))?.toString())
            }
          }
        }
        localStorage.setItem('sessionID', this.sessionID);
        localStorage.setItem('sessionExpiry', this.sessionExpiry.toString());
      }
    } catch (e) {
      console.error(e);
    }

    //send event to initiate session
    var initEvent: any = this.getTemplateEvent("session_created", "session_created")
    initEvent.event = Object.assign({}, initEvent.event, {
      type: params.type,
      sdk_class: params.sdk_class,
      fp_data: fpData,
    })

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

  protected getTemplateEvent(event_type: string, event_sub_type?: string) {
    let utms = this.refreshUtms();
    let helika_referral_link = this.refreshLinkId();

    return {
      created_at: new Date().toISOString(),
      game_id: this.gameId,
      event_type: event_type,
      event: {
        session_id: this.sessionID,
        event_sub_type: event_sub_type,
        sdk_name: "Web",
        sdk_version: version,
        helika_referral_link: helika_referral_link,
        utms: utms
      }
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

  public setDataSettings(settings: DisableDataSettings) {
    this.disabledDataSettings = settings;
  }
}
