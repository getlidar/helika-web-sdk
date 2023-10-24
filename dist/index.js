"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fingerprint = exports.EventsBaseURL = exports.UABaseURL = void 0;
const ua_1 = require("./ua");
const events_1 = require("./events");
const fingerprintjs_pro_react_1 = require("@fingerprintjs/fingerprintjs-pro-react");
exports.default = { EVENTS: events_1.EVENTS, UA: ua_1.UA };
var UABaseURL;
(function (UABaseURL) {
    //LOCAL,
    UABaseURL[UABaseURL["UA_DEV"] = 0] = "UA_DEV";
    UABaseURL[UABaseURL["UA_PROD"] = 1] = "UA_PROD";
})(UABaseURL = exports.UABaseURL || (exports.UABaseURL = {}));
var EventsBaseURL;
(function (EventsBaseURL) {
    //LOCAL,
    EventsBaseURL[EventsBaseURL["EVENTS_DEV"] = 0] = "EVENTS_DEV";
    EventsBaseURL[EventsBaseURL["EVENTS_PROD"] = 1] = "EVENTS_PROD";
})(EventsBaseURL = exports.EventsBaseURL || (exports.EventsBaseURL = {}));
exports.fingerprint = fingerprintjs_pro_react_1.FingerprintJSPro;
