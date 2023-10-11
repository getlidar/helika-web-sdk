import axios from "axios";
import { BaseURLOptions } from "./index";
import { v4 } from 'uuid';

export type Config = {
  apiKey: string;
  baseUrlOption?: BaseURLOptions;
};

export abstract class Base {
  private apiKey: string;
  baseUrl: string;
  sessionID: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    this.sessionID = v4();

    var projectType = "UA";
    switch (config.baseUrlOption) {
      case BaseURLOptions.EVENTS_LOCAL:
          this.baseUrl = 'http://localhost:8181/v1';
          projectType = "Events";
          break;
      case BaseURLOptions.EVENTS_MAINNET:
          this.baseUrl = 'https://api.helika.io/v1';
          projectType = "Events";
          break;
      case BaseURLOptions.EVENTS_TESTNET:
          this.baseUrl = 'https://api-stage.helika.io/v1';
          projectType = "Events";
          break;
      case BaseURLOptions.UA_LOCAL:
          this.baseUrl = 'http://localhost:3000';
          break;
      case BaseURLOptions.UA_MAINNET:
          this.baseUrl = 'https://ua-api.helika.io';
          break;
      case BaseURLOptions.UA_TESTNET:
      default:
          this.baseUrl = 'https://ua-api-dev.helika.io';
          break;
    }
    this.onSessionCreated({
      projectType: projectType
    });

  }

  protected getFP():any{
    return new Promise((resolve, reject) => {
      // @ts-ignore Import moduleconst 
      import('https://fpjscdn.net/v3/1V2jYOavAUDljc9GxEgu')
        .then((respA: any) => {
          let response = respA.default;
          resolve(response)
        })
        .catch(reject);
    });
  }

  protected async fingerprint(): Promise<any> {
    let func = await this.getFP();
    let loaded = await func.load();
    let fingerprintData = await loaded.get();
    return {
      fingerprint_id: fingerprintData?.visitorId,
      request_id: fingerprintData?.requestId
    }
  }

  protected async fullFingerprint(): Promise<any> {
    let func = await this.getFP();
    let loaded = await func.load();
    return await loaded.get({
      extendedResult: true
    });
  }

  protected getUrlParam(paramName: string){
    var urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
  }

  protected getAllUrlParams(){
    let url = window.location.href;

    if(url.indexOf('?') != -1) {
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
        .get(`${url}`,config)
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
        .post(`${url}`,options,config)
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
        sdk_type: 'Event',
        project_type: params.projectType,
        fp_data: fpData
      }
    };
    let event_params = {
      id: this.sessionID,
      events: [initevent]
    }

    return this.postRequest(`/game/game-event`,event_params);
  }
  
}
