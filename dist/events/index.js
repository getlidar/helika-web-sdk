"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = void 0;
const base_1 = require("../base");
class EVENTS extends base_1.Base {
    constructor(config) {
        super(config);
        //switch(config.baseUrlOption) {
        //  case BaseURLOptions.EVENTS_LOCAL:
        //    this.baseUrl = 'http://localhost:8181/v1';
        //  case BaseURLOptions.EVENTS_MAINNET:
        //    this.baseUrl = 'https://api.helika.io/v1';
        //  case BaseURLOptions.EVENTS_TESTNET:
        //  default:
        //    this.baseUrl = 'https://api-stage.helika.io/v1';
        //}
    }
    createEvent(id, events) {
        let created_at = new Date().toISOString();
        let newEvents = events.map(event => {
            return Object.assign(Object.assign({}, event), { created_at: created_at });
        });
        var params = {
            id: id,
            events: newEvents
        };
        return this.postRequest(`/game/game-event`, params);
    }
}
exports.EVENTS = EVENTS;
