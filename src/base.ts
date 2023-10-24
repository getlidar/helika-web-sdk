import axios from "axios";
import { fingerprint } from "./index";
import { v4 } from 'uuid';

const fpApiKey = '1V2jYOavAUDljc9GxEgu';

export abstract class Base {
  private apiKey: string;
  baseUrl: string;
  sessionID: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.sessionID = v4();
    this.baseUrl = "http://localhost:3000";
  }

  protected async fingerprint(): Promise<any> {
    let loadOptions = {
      apiKey: fpApiKey
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
    let loadOptions = {
      apiKey: fpApiKey
    };
    try {
      let loaded = await fingerprint.load(loadOptions);
      let resp = await loaded.get({
        extendedResult: true
      });
      return resp;
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

  protected postRequest<T>(endpoint: string, options?: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": this.apiKey,
    };
    const config = {
      headers,
    };

    return new Promise((resolve, reject) => {
      axios
        .post(`${url}`, options, config)
        .then((resp: any) => {
          resolve(resp.data);
        })
        .catch(reject);
    });
  }

  protected async onSessionCreated<T>(params?: any): Promise<T> {

    let fpData = await this.fullFingerprint();

    //send event to initiate session
    var initevent = {
      created_at: new Date().toISOString(),
      game_id: 'HELIKA_SDK',
      event_type: 'SESSION_CREATED',
      event: {
        message: 'Session created',
        sdk_class: params.sdk_class,
        fp_data: fpData
      }
    };
    let event_params = {
      id: this.sessionID,
      events: [initevent]
    }

    return this.postRequest(`/game/game-event`, event_params);
  }

}
