"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = require("./index");
const uuid_1 = require("uuid");
const fpApiKey = '1V2jYOavAUDljc9GxEgu';
class Base {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.sessionID = (0, uuid_1.v4)();
        var sdk_type = "UA";
        switch (config.baseUrlOption) {
            case index_1.BaseURLOptions.EVENTS_LOCAL:
                this.baseUrl = 'http://localhost:8181/v1';
                sdk_type = "Events";
                break;
            case index_1.BaseURLOptions.EVENTS_MAINNET:
                this.baseUrl = 'https://api.helika.io/v1';
                sdk_type = "Events";
                break;
            case index_1.BaseURLOptions.EVENTS_TESTNET:
                this.baseUrl = 'https://api-stage.helika.io/v1';
                sdk_type = "Events";
                break;
            case index_1.BaseURLOptions.UA_LOCAL:
                this.baseUrl = 'http://localhost:3000';
                break;
            case index_1.BaseURLOptions.UA_MAINNET:
                this.baseUrl = 'https://ua-api.helika.io';
                break;
            case index_1.BaseURLOptions.UA_TESTNET:
            default:
                this.baseUrl = 'https://ua-api-dev.helika.io';
                break;
        }
        this.onSessionCreated({
            sdk_type: sdk_type
        });
    }
    fingerprint() {
        return __awaiter(this, void 0, void 0, function* () {
            let loadOptions = {
                apiKey: fpApiKey
            };
            let loaded = yield index_1.fingerprint.load(loadOptions);
            let fingerprintData = yield loaded.get();
            return {
                fingerprint_id: fingerprintData === null || fingerprintData === void 0 ? void 0 : fingerprintData.visitorId,
                request_id: fingerprintData === null || fingerprintData === void 0 ? void 0 : fingerprintData.requestId
            };
        });
    }
    fullFingerprint() {
        return __awaiter(this, void 0, void 0, function* () {
            let loadOptions = {
                apiKey: fpApiKey
            };
            let loaded = yield index_1.fingerprint.load(loadOptions);
            return yield loaded.get({
                extendedResult: true
            });
        });
    }
    getUrlParam(paramName) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    }
    getAllUrlParams() {
        let url = window.location.href;
        if (url.indexOf('?') != -1) {
            var params = url.split('?')[1].split('&');
            return params.map(pair => {
                let values = pair.split('=');
                return {
                    key: values[0],
                    value: values[1]
                };
            });
        }
        return [];
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
    onSessionCreated(params) {
        return __awaiter(this, void 0, void 0, function* () {
            let fpData = yield this.fullFingerprint();
            //send event to initiate session
            var initevent = {
                created_at: new Date().toISOString(),
                game_id: 'HELIKA_SDK',
                event_type: 'SESSION_CREATED',
                event: {
                    message: 'Session created',
                    sdk_type: params.sdk_type,
                    fp_data: fpData
                }
            };
            let event_params = {
                id: this.sessionID,
                events: [initevent]
            };
            return this.postRequest(`/game/game-event`, event_params);
        });
    }
}
exports.Base = Base;
