import { Base } from "./base";
import { UA } from "./ua";
import { EVENTS } from "./events";
import { FingerprintJSPro } from "@fingerprintjs/fingerprintjs-pro-react";
declare class UA_INTERNAL extends Base {
}
interface UA_INTERNAL extends UA {
}
declare class EVENTS_INTERNAL extends Base {
}
interface EVENTS_INTERNAL extends EVENTS {
}
declare const _default: {
    EVENTS: typeof EVENTS_INTERNAL;
    UA: typeof UA_INTERNAL;
};
export default _default;
export declare enum BaseURLOptions {
    UA_LOCAL = 0,
    UA_TESTNET = 1,
    UA_MAINNET = 2,
    EVENTS_LOCAL = 3,
    EVENTS_TESTNET = 4,
    EVENTS_MAINNET = 5
}
export declare const fingerprint: typeof FingerprintJSPro;
