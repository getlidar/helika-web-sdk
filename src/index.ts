import { Base } from "./base";
import { UA } from "./ua";
import { EVENTS } from "./events";
import { applyMixins } from "./utils";
import { FingerprintJSPro } from "@fingerprintjs/fingerprintjs-pro-react";

export default { EVENTS: EVENTS, UA: UA }

export enum UABaseURL {
  //LOCAL,
  UA_DEV,
  UA_PROD
}

export enum EventsBaseURL {
  //LOCAL,
  EVENTS_DEV,
  EVENTS_PROD
}

export const fingerprint = FingerprintJSPro;