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
const exenv_1 = __importDefault(require("exenv"));
const fpApiKey = '1V2jYOavAUDljc9GxEgu';
class Base {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.sessionID = null;
        this.sessionExpiry = new Date();
        this.baseUrl = "http://localhost:3000";
    }
    fingerprint() {
        return __awaiter(this, void 0, void 0, function* () {
            if (new Date() < this.sessionExpiry) {
                return { data: 'FP data from session start/refresh is still fresh. Fingerprinting not executed.' };
            }
            let loadOptions = {
                apiKey: fpApiKey
            };
            let fingerprintData = null;
            try {
                let loaded = yield index_1.fingerprint.load(loadOptions);
                fingerprintData = yield loaded.get();
                return {
                    fingerprint_id: fingerprintData === null || fingerprintData === void 0 ? void 0 : fingerprintData.visitorId,
                    request_id: fingerprintData === null || fingerprintData === void 0 ? void 0 : fingerprintData.requestId
                };
            }
            catch (e) {
                console.error('Error loading fingerprint data');
                return {};
            }
        });
    }
    fullFingerprint() {
        return __awaiter(this, void 0, void 0, function* () {
            if (new Date() < this.sessionExpiry) {
                return { data: 'FP data from session start/refresh is still fresh. Fingerprinting not executed.' };
            }
            let loadOptions = {
                apiKey: fpApiKey
            };
            try {
                let loaded = yield index_1.fingerprint.load(loadOptions);
                let resp = yield loaded.get({
                    extendedResult: true
                });
                return resp;
            }
            catch (e) {
                console.error('Error loading fingerprint data');
                return {};
            }
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
    sessionCreate(params) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sessionID = (0, uuid_1.v4)();
            this.sessionExpiry = this.addHours(new Date(), 1);
            let fpData = {};
            let utms = null;
            let helika_referral_link = null;
            try {
                if (exenv_1.default.canUseDOM) {
                    fpData = yield this.fullFingerprint();
                    localStorage.setItem('sessionID', this.sessionID);
                    localStorage.setItem('sessionExpiry', this.sessionExpiry.toString());
                    utms = this.getAllUrlParams();
                    helika_referral_link = this.getUrlParam('linkId');
                    if (utms) {
                        localStorage.setItem('helika_utms', utms === null || utms === void 0 ? void 0 : utms.toString());
                    }
                    if (helika_referral_link) {
                        localStorage.setItem('helika_referral_link', helika_referral_link);
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
            //send event to initiate session
            var initevent = {
                created_at: new Date().toISOString(),
                game_id: 'HELIKA_SDK',
                event_type: 'SESSION_CREATED',
                event: {
                    type: params.type,
                    sdk_class: params.sdk_class,
                    fp_data: fpData,
                    helika_referral_link: helika_referral_link,
                    utms: utms
                }
            };
            let event_params = {
                id: this.sessionID,
                events: [initevent]
            };
            return yield this.postRequest(`/game/game-event`, event_params);
        });
    }
    addHours(date, hours) {
        date.setHours(date.getHours() + hours);
        return date.toString();
    }
}
exports.Base = Base;
