import { UA } from "./ua";
import { EVENTS } from "./events";
export default { EVENTS: EVENTS, UA: UA };
export var UABaseURL;
(function (UABaseURL) {
    //LOCAL,
    UABaseURL[UABaseURL["UA_DEV"] = 0] = "UA_DEV";
    UABaseURL[UABaseURL["UA_PROD"] = 1] = "UA_PROD";
})(UABaseURL || (UABaseURL = {}));
export var EventsBaseURL;
(function (EventsBaseURL) {
    EventsBaseURL[EventsBaseURL["EVENTS_LOCAL"] = 0] = "EVENTS_LOCAL";
    EventsBaseURL[EventsBaseURL["EVENTS_DEV"] = 1] = "EVENTS_DEV";
    EventsBaseURL[EventsBaseURL["EVENTS_PROD"] = 2] = "EVENTS_PROD";
})(EventsBaseURL || (EventsBaseURL = {}));
export var DisableDataSettings;
(function (DisableDataSettings) {
    DisableDataSettings[DisableDataSettings["None"] = 0] = "None";
    DisableDataSettings[DisableDataSettings["BrowserInfo"] = 1] = "BrowserInfo";
    DisableDataSettings[DisableDataSettings["DeviceInfo"] = 2] = "DeviceInfo";
    DisableDataSettings[DisableDataSettings["IpInfo"] = 4] = "IpInfo";
    DisableDataSettings[DisableDataSettings["OsInfo"] = 8] = "OsInfo";
    DisableDataSettings[DisableDataSettings["VpnInfo"] = 16] = "VpnInfo";
    DisableDataSettings[DisableDataSettings["All"] = 2147483647] = "All"; // 0xFFFF
})(DisableDataSettings || (DisableDataSettings = {}));
