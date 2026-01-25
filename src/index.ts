import { EVENTS } from "./events";
import { REDEEM_CODES } from "./redeem_codes";

export default { EVENTS: EVENTS, REDEEM_CODES: REDEEM_CODES }

export enum EventsBaseURL {
  EVENTS_LOCAL,
  EVENTS_DEV,
  EVENTS_PROD
}
export enum RedeemCodesURL {
  REDEEM_CODES_LOCAL,
  REDEEM_CODES_DEV,
  REDEEM_CODES_PROD
}

export enum DisableDataSettings {
  None = 0,
  BrowserInfo = 1 << 0, // 000001 -- the bitshift is unnecessary, but done for consistency
  DeviceInfo = 1 << 1,  // 000010
  IpInfo = 1 << 2,      // 000100
  OsInfo = 1 << 3,      // 001000
  VpnInfo = 1 << 4,     // 100000
  All = ~(~0 << 31)      // 0xFFFF
}