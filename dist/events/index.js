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
exports.EVENTS = void 0;
const base_1 = require("../base");
const index_1 = require("../index");
const exenv_1 = __importDefault(require("exenv"));
const uuid_1 = require("uuid");
const version_1 = require("../version");
class EVENTS extends base_1.Base {
    constructor(apiKey, gameId, baseUrl) {
        super(apiKey, gameId);
        this.playerId = "";
        switch (baseUrl) {
            case index_1.EventsBaseURL.EVENTS_LOCAL: {
                // this.baseUrl = 'http://localhost:3000';
                this.baseUrl = "https://api-stage.helika.io/v1";
                this.enabled = false;
                break;
            }
            case index_1.EventsBaseURL.EVENTS_PROD: {
                this.baseUrl = "https://api.helika.io/v1";
                break;
            }
            case index_1.EventsBaseURL.EVENTS_DEV:
            default: {
                this.baseUrl = "https://api-stage.helika.io/v1";
                break;
            }
        }
    }
    getPlayerId() {
        return this.playerId;
    }
    setPlayerId(playerId) {
        this.playerId = playerId;
    }
    startSession() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (exenv_1.default.canUseDOM) {
                    // Todo: Move this into the Base Class once Users have been consolidated
                    return yield this.sessionCreate({
                        sdk_class: "Events",
                        type: 'Session Start'
                    });
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    refreshSession() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (exenv_1.default.canUseDOM) {
                    // Todo: Move this into the Base Class once Users have been consolidated
                    return yield this.sessionCreate({
                        sdk_class: "Events",
                        type: 'Session Refresh'
                    });
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    createUserEvent(user_id, events, user_details, event_details, store_id, server_version) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshSessionIdFromStorage();
            if (!this.sessionID) {
                throw new Error('Could not create event. No session id. Please initiate a session first (See Helika Docs).');
            }
            let created_at = new Date().toISOString();
            let helika_referral_link = null;
            let utms = null;
            let current_url = "";
            let connectionData = window.navigator;
            let device_details = {};
            let event_source = 'server';
            try {
                if (exenv_1.default.canUseDOM) {
                    helika_referral_link = this.refreshLinkId();
                    utms = this.refreshUtms();
                    current_url = window.location.href;
                    device_details = {
                        platform_id: (_a = connectionData === null || connectionData === void 0 ? void 0 : connectionData.userAgentData) === null || _a === void 0 ? void 0 : _a.platform,
                        app_version: connectionData === null || connectionData === void 0 ? void 0 : connectionData.appVersion,
                        server_version: server_version,
                        store_id: store_id,
                    };
                    event_source = 'client';
                }
            }
            catch (e) {
                console.error(e);
            }
            let newEvents = events.map((event) => {
                var _a, _b, _c, _d, _e, _f;
                console.log('event', event);
                let givenEvent = Object.assign({}, event, {
                    device_details: device_details,
                    user_details: user_details,
                    event_details: event_details,
                    helika_data: {
                        anon_id: (0, uuid_1.v4)(),
                        event_source: event_source,
                        taxonomy_ver: 'v1',
                        resolution: exenv_1.default.canUseDOM ? `${window.innerWidth}x${window.innerHeight}` : undefined,
                        touch_support: exenv_1.default.canUseDOM ? (connectionData.maxTouchPoints > 0) : undefined,
                        device_type: (exenv_1.default.canUseDOM && (connectionData === null || connectionData === void 0 ? void 0 : connectionData.userAgentData) && 'mobile' in (connectionData === null || connectionData === void 0 ? void 0 : connectionData.userAgentData)) ? (((_a = connectionData === null || connectionData === void 0 ? void 0 : connectionData.userAgentData) === null || _a === void 0 ? void 0 : _a.mobile) ? 'mobile' : (_b = connectionData === null || connectionData === void 0 ? void 0 : connectionData.userAgentData) === null || _b === void 0 ? void 0 : _b.platform) : undefined,
                        os: exenv_1.default.canUseDOM ? (_c = connectionData === null || connectionData === void 0 ? void 0 : connectionData.userAgentData) === null || _c === void 0 ? void 0 : _c.platform : undefined,
                        downlink: exenv_1.default.canUseDOM ? (_d = connectionData === null || connectionData === void 0 ? void 0 : connectionData.connection) === null || _d === void 0 ? void 0 : _d.downlink : undefined,
                        effective_type: exenv_1.default.canUseDOM ? (_e = connectionData === null || connectionData === void 0 ? void 0 : connectionData.connection) === null || _e === void 0 ? void 0 : _e.effectiveType : undefined,
                        connection_type: exenv_1.default.canUseDOM ? (_f = connectionData === null || connectionData === void 0 ? void 0 : connectionData.connection) === null || _f === void 0 ? void 0 : _f.type : undefined,
                        sdk_name: "Web",
                        sdk_version: version_1.version,
                        sdk_platform: exenv_1.default.canUseDOM ? 'browser' : 'non-browser',
                    }
                });
                givenEvent.event.helika_referral_link = helika_referral_link;
                givenEvent.event.utms = utms;
                givenEvent.event.url = current_url;
                if (event.event.session_id) {
                    givenEvent.event.client_session_id = event.event.session_id;
                }
                givenEvent.event.session_id = this.sessionID;
                givenEvent.event.player_id = this.playerId;
                givenEvent.created_at = created_at;
                givenEvent.game_id = this.gameId;
                return givenEvent;
            });
            var params = {
                id: (0, uuid_1.v4)(),
                user_id: user_id,
                events: newEvents
            };
            this.extendSession();
            return this.postRequest(`/game/game-event`, params);
        });
    }
    createEvent(events) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshSessionIdFromStorage();
            if (!this.sessionID) {
                throw new Error('Could not create event. No session id. Please initiate a session first (See Helika Docs).');
            }
            let created_at = new Date().toISOString();
            let helika_referral_link = null;
            let utms = null;
            let current_url = "";
            try {
                if (exenv_1.default.canUseDOM) {
                    helika_referral_link = this.refreshLinkId();
                    utms = this.refreshUtms();
                    current_url = window.location.href;
                }
            }
            catch (e) {
                console.error(e);
            }
            let newEvents = events.map((event) => {
                let givenEvent = Object.assign({}, event);
                givenEvent.event.helika_referral_link = helika_referral_link;
                givenEvent.event.utms = utms;
                givenEvent.event.url = current_url;
                if (event.event.session_id) {
                    givenEvent.event.client_session_id = event.event.session_id;
                }
                givenEvent.event.session_id = this.sessionID;
                givenEvent.event.player_id = this.playerId;
                givenEvent.created_at = created_at;
                givenEvent.game_id = this.gameId;
                return givenEvent;
            });
            var params = {
                id: (0, uuid_1.v4)(),
                events: newEvents
            };
            this.extendSession();
            return this.postRequest(`/game/game-event`, params);
        });
    }
    createUAEvent(events) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshSessionIdFromStorage();
            if (!this.sessionID)
                throw new Error('SDK Session has not been started. Please call the SessionStart function to initialize instance with a Session ID.');
            let created_at = new Date().toISOString();
            let helika_referral_link = null;
            let utms = null;
            let current_url = "";
            try {
                if (exenv_1.default.canUseDOM) {
                    helika_referral_link = this.refreshLinkId();
                    utms = this.refreshUtms();
                    current_url = window.location.href;
                }
            }
            catch (e) {
                console.error(e);
            }
            let newEvents = events.map((event) => {
                let givenEvent = Object.assign({}, event);
                givenEvent.event.helika_referral_link = helika_referral_link;
                givenEvent.event.utms = utms;
                givenEvent.event.url = current_url;
                if (event.event.session_id) {
                    givenEvent.event.client_session_id = event.event.session_id;
                }
                givenEvent.event.session_id = this.sessionID;
                givenEvent.created_at = created_at;
                givenEvent.game_id = 'UA';
                return givenEvent;
            });
            var params = {
                id: (0, uuid_1.v4)(),
                events: newEvents
            };
            this.extendSession();
            return this.postRequest(`/game/game-event`, params);
        });
    }
    refreshSessionIdFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (exenv_1.default.canUseDOM) {
                let local_storage_id = localStorage.getItem('sessionID');
                let expiry = localStorage.getItem('sessionExpiry');
                if (local_storage_id && expiry) {
                    if (new Date(expiry) < new Date()) {
                        yield this.refreshSession();
                    }
                    else {
                        this.sessionID = local_storage_id;
                        this.sessionExpiry = new Date(expiry);
                    }
                }
                else if (this.sessionID) { // edge case where localstorage was cleared
                    localStorage.setItem('sessionID', this.sessionID);
                }
            }
        });
    }
}
exports.EVENTS = EVENTS;
