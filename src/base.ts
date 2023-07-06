import axios from "axios";
import { BaseURLOptions } from "./index"

type Config = {
  apiKey: string;
  baseUrlOption?: BaseURLOptions;
};

export abstract class Base {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: Config) {
    this.apiKey = config.apiKey;
    switch(config.baseUrlOption) {
      case BaseURLOptions.LOCAL:
        this.baseUrl = 'http://localhost:3000';
        return;
      case BaseURLOptions.MAINNET:
        this.baseUrl = 'https://nft.helika.io'
        return;
      case BaseURLOptions.TESTNET:
      default:
        this.baseUrl = 'https://test.nft.helika.io'
        return;
    }
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
        .then((resp) => {
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
        .then((resp) => {
          resolve(resp.data);
        })
        .catch(reject);
    });
  }
  
}