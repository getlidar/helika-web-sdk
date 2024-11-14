import { EVENTS } from "./events";
import { SOCIAL_CONNECT } from "./social_connect";

export default { EVENTS: EVENTS, SOCIAL_CONNECT: SOCIAL_CONNECT }

export enum EventsBaseURL {
  EVENTS_LOCAL,
  EVENTS_DEV,
  EVENTS_PROD
}

export enum SocialConnect {
  SOCIAL_SANDBOX,
  SOCIAL_PROD
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