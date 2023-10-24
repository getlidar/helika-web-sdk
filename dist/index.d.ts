import { UA } from "./ua";
import { EVENTS } from "./events";
import { FingerprintJSPro } from "@fingerprintjs/fingerprintjs-pro-react";
declare const _default: {
    EVENTS: typeof EVENTS;
    UA: typeof UA;
};
export default _default;
export declare enum UABaseURL {
    UA_DEV = 0,
    UA_PROD = 1
}
export declare enum EventsBaseURL {
    EVENTS_DEV = 0,
    EVENTS_PROD = 1
}
export declare const fingerprint: typeof FingerprintJSPro;
