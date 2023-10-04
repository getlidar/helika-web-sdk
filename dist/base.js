"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./index");
class Base {
    constructor(config) {
        this.apiKey = config.apiKey;
        switch (config.baseUrlOption) {
            case index_1.BaseURLOptions.EVENTS_LOCAL:
                this.baseUrl = 'http://localhost:8181/v1';
                return;
            case index_1.BaseURLOptions.EVENTS_MAINNET:
                this.baseUrl = 'https://api.helika.io/v1';
                return;
            case index_1.BaseURLOptions.EVENTS_TESTNET:
                this.baseUrl = 'https://api-stage.helika.io/v1';
                return;
            case index_1.BaseURLOptions.UA_LOCAL:
                this.baseUrl = 'http://localhost:3000';
                return;
            case index_1.BaseURLOptions.UA_MAINNET:
                this.baseUrl = 'https://ua-api.helika.io';
                return;
            case index_1.BaseURLOptions.UA_TESTNET:
            default:
                this.baseUrl = 'https://ua-api-dev.helika.io';
                return;
        }
    }
    getFP() {
        return new Promise((resolve, reject) => {
            // @ts-ignore Import moduleconst 
            Promise.resolve().then(() => __importStar(require('https://fpjscdn.net/v3/1V2jYOavAUDljc9GxEgu'))).then((respA) => {
                let response = respA.default;
                resolve(response);
            })
                .catch(reject);
        });
    }
    getRequest(endpoint, options) {
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
            axios_1.default
                .get(`${url}`, config)
                .then((resp) => {
                resolve(resp.data);
            })
                .catch(reject);
        });
    }
    postRequest(endpoint, options) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            "x-api-key": this.apiKey,
        };
        const config = {
            headers,
        };
        return new Promise((resolve, reject) => {
            axios_1.default
                .post(`${url}`, options, config)
                .then((resp) => {
                resolve(resp.data);
            })
                .catch(reject);
        });
    }
}
exports.Base = Base;
