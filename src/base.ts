import axios from "axios";
import { BaseURLOptions } from "./index";

export type Config = {
  apiKey: string;
  baseUrlOption?: BaseURLOptions;
};

export abstract class Base {
  private apiKey: string;
  baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;

    switch (config.baseUrlOption) {
      case BaseURLOptions.EVENTS_LOCAL:
          this.baseUrl = 'http://localhost:8181/v1';
          return;
      case BaseURLOptions.EVENTS_MAINNET:
          this.baseUrl = 'https://api.helika.io/v1';
          return;
      case BaseURLOptions.EVENTS_TESTNET:
          this.baseUrl = 'https://api-stage.helika.io/v1';
          return;
      case BaseURLOptions.UA_LOCAL:
          this.baseUrl = 'http://localhost:3000';
          return;
      case BaseURLOptions.UA_MAINNET:
          this.baseUrl = 'https://ua-api.helika.io';
          return;
      case BaseURLOptions.UA_TESTNET:
      default:
          this.baseUrl = 'https://ua-api-dev.helika.io';
          return;
    }

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
  
}