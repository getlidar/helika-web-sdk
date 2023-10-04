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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENTS = void 0;
const base_1 = require("../base");
class EVENTS extends base_1.Base {
    constructor(config) {
        super(config);
    }
    fingerprint() {
        return __awaiter(this, void 0, void 0, function* () {
            let func = yield this.getFP();
            let loaded = yield func.load();
            let fingerprintData = yield loaded.get();
            return {
                fingerprint_id: fingerprintData === null || fingerprintData === void 0 ? void 0 : fingerprintData.visitorId,
                request_id: fingerprintData === null || fingerprintData === void 0 ? void 0 : fingerprintData.requestId
            };
        });
    }
    createEvent(id, events) {
        return __awaiter(this, void 0, void 0, function* () {
            let created_at = new Date().toISOString();
            let fingerprint_data = yield this.fingerprint();
            let newEvents = events.map(event => {
                let givenEvent = event;
                givenEvent.event.fingerprint = fingerprint_data;
                return Object.assign(Object.assign({}, event), { created_at: created_at });
            });
            var params = {
                id: id,
                events: newEvents
            };
            return this.postRequest(`/game/game-event`, params);
        });
    }
    createUAEvent(id, events) {
        return __awaiter(this, void 0, void 0, function* () {
            let created_at = new Date().toISOString();
            let fingerprint_data = yield this.fingerprint();
            let newEvents = events.map(event => {
                let givenEvent = event;
                givenEvent.event.fingerprint = fingerprint_data;
                return Object.assign(Object.assign({}, event), { game_id: 'UA', created_at: created_at });
            });
            var params = {
                id: id,
                events: newEvents
            };
            return this.postRequest(`/game/game-event`, params);
        });
    }
}
exports.EVENTS = EVENTS;
