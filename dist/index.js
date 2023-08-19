"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseURLOptions = void 0;
const base_1 = require("./base");
const ua_1 = require("./ua");
const events_1 = require("./events");
const utils_1 = require("./utils");
class UA_INTERNAL extends base_1.Base {
}
(0, utils_1.applyMixins)(UA_INTERNAL, [ua_1.UA]);
class EVENTS_INTERNAL extends base_1.Base {
}
(0, utils_1.applyMixins)(EVENTS_INTERNAL, [events_1.EVENTS]);
exports.default = { EVENTS: EVENTS_INTERNAL, UA: UA_INTERNAL };
var BaseURLOptions;
(function (BaseURLOptions) {
    BaseURLOptions[BaseURLOptions["UA_LOCAL"] = 0] = "UA_LOCAL";
    BaseURLOptions[BaseURLOptions["UA_TESTNET"] = 1] = "UA_TESTNET";
    BaseURLOptions[BaseURLOptions["UA_MAINNET"] = 2] = "UA_MAINNET";
    BaseURLOptions[BaseURLOptions["EVENTS_LOCAL"] = 3] = "EVENTS_LOCAL";
    BaseURLOptions[BaseURLOptions["EVENTS_TESTNET"] = 4] = "EVENTS_TESTNET";
    BaseURLOptions[BaseURLOptions["EVENTS_MAINNET"] = 5] = "EVENTS_MAINNET";
})(BaseURLOptions = exports.BaseURLOptions || (exports.BaseURLOptions = {}));
