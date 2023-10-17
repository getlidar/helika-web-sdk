import { Base } from "./base";
import { UA } from "./ua";
import { EVENTS } from "./events";
import { applyMixins } from "./utils";
import { FingerprintJSPro } from "@fingerprintjs/fingerprintjs-pro-react";

class UA_INTERNAL extends Base {}
interface UA_INTERNAL extends UA {}
applyMixins(UA_INTERNAL, [UA]);

class EVENTS_INTERNAL extends Base {}
interface EVENTS_INTERNAL extends EVENTS {}
applyMixins(EVENTS_INTERNAL, [EVENTS]);

export default { EVENTS: EVENTS_INTERNAL, UA: UA_INTERNAL }

export enum BaseURLOptions {
  UA_LOCAL,
  UA_TESTNET,
  UA_MAINNET,
  EVENTS_LOCAL,
  EVENTS_TESTNET,
  EVENTS_MAINNET,
}

export const fingerprint = FingerprintJSPro;