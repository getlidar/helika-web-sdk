var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Base } from "../base";
import { EventsBaseURL } from "../index";
import ExecutionEnvironment from 'exenv';
export class EVENTS extends Base {
    constructor(apiKey, gameId, baseUrl) {
        super(apiKey, gameId);
        this.playerId = "";
        switch (baseUrl) {
            case EventsBaseURL.EVENTS_LOCAL: {
                // this.baseUrl = 'http://localhost:3000';
                this.baseUrl = "https://api-stage.helika.io/v1";
                this.enabled = false;
                break;
            }
            case EventsBaseURL.EVENTS_PROD: {
                this.baseUrl = "https://api.helika.io/v1";
                break;
            }
            case EventsBaseURL.EVENTS_DEV:
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
                if (ExecutionEnvironment.canUseDOM) {
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
                if (ExecutionEnvironment.canUseDOM) {
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
    createEvent(events) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.refreshSessionIdFromStorage();
            if (!this.sessionID) {
                throw new Error('Could not initiate session. API Key is invalid. Disabling Sending Messages. Please reach out to Helika Support to request a valid API key.');
            }
            let created_at = new Date().toISOString();
            let helika_referral_link = null;
            let utms = null;
            let current_url = "";
            try {
                if (ExecutionEnvironment.canUseDOM) {
                    helika_referral_link = localStorage.getItem('helika_referral_link');
                    utms = localStorage.getItem('helika_utms');
                    utms = utms ? JSON.parse(utms) : null;
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
                id: this.sessionID,
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
            try {
                if (ExecutionEnvironment.canUseDOM) {
                    helika_referral_link = localStorage.getItem('helika_referral_link');
                    utms = localStorage.getItem('helika_utms');
                    utms = utms ? JSON.parse(utms) : null;
                }
            }
            catch (e) {
                console.error(e);
            }
            let newEvents = events.map((event) => {
                let givenEvent = Object.assign({}, event);
                givenEvent.event.helika_referral_link = helika_referral_link;
                givenEvent.event.utms = utms;
                if (event.event.session_id) {
                    givenEvent.event.client_session_id = event.event.session_id;
                }
                givenEvent.event.session_id = this.sessionID;
                givenEvent.created_at = created_at;
                givenEvent.game_id = 'UA';
                return givenEvent;
            });
            var params = {
                id: this.sessionID,
                events: newEvents
            };
            this.extendSession();
            return this.postRequest(`/game/game-event`, params);
        });
    }
    refreshSessionIdFromStorage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (ExecutionEnvironment.canUseDOM) {
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
