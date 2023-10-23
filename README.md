# Helika User Acquisition SDK

SDK for use with the UA endpoints (https://ua-api.helika.io or https://ua-api-dev.helika.io) or the Events endpoints (https://api.helika.io/v1 or https://api-stage.helika.io/v1)

The Helika SDK is for developers to be able to make API calls to the Helika DEV and PROD endpoints.
The following pages will describe how to make calls to the Helika API. Developers will need to install the helika-sdk to their project.

## Installation


```ts
npm i helika-sdk
```


## Usage	

### API KEY

An API Key is required to use the SDK.

For a UA SDK instance, a UA SDK Key is required. This can be obtained by going to https://ua.helika.io and having a Creator account. Once you've created a Creator account, you can find your API Key in the settings modal, which can be opened at the top right of the app.

For an Events SDK Instance, an API Key from Helika is required. Please reach out to your Helika contact or inquiring through https://www.helika.io/contact/ .

### Base URL 

The SDK can send to DEV or PROD endpoints depending on the Base URLs to the sdk on instance creation (see step 1 in Instance Creation section). 

#### UABaseURL
- UA_DEV
- UA_PROD

Use the UABaseURL enum for `Helika.UA`

#### EventsBaseURL
- EVENTS_DEV
- EVENTS_PROD

Use the EventsBaseURL enum for `Helika.Events`

For Development, use **UA_DEV** or **EVENT_DEV**. This sends the events and queries to the develop environments. 

For Production, use **UA_PROD** or **EVENT_PROD**. This sends the events and queries to the production environments. 


### Instance Creation

There are two main uses for the Helika SDK

1. Use with the Helika Events API
This is for sending events to the Helika API in a pre-defined structure. You will need to use your Events API Key given to you by Helika.<br />

```ts
import Helika from "helika-sdk"
import { EventsBaseURL } from "helika-sdk"

// Helika SDK session 1
const helikaSDK = new Helika.EVENTS(api_key, EventsBaseURL.EVENTS_DEV);

// if you want to create events with a different Session ID, create a new instane of the sdk
// Helika SDK session 2
const helikaSDK2 = new Helika.EVENTS(api_key, EventsBaseURL.EVENTS_DEV);
```

> [!NOTE]
> Creating an instance of the Helika SDK initiates a session. Therefore, each instance will have a session id available through the instance (i.e. helikaCaller.sessionID)

2. Sending User Acquisition calls to the HelikaUA API
This is for UA calls such as logging UA project referrals or checking ambassadors/affiliates. You will need to use your UA API Key given to you by Helika (can also be found in the settings page on the Helika UA app).

## Helika Events API

### Event Example:

```ts
import Helika from "helika-sdk"
import { EventsBaseURL } from "helika-sdk"

const helikaSDK = new Helika.EVENTS(api_key, EventsBaseURL.EVENTS_DEV);

events = [{
	game_id: 'my_game',
	event_type: 'win_event',
	event: {
		user: 'user_1',
		win_number: 1,
		wallet: '0x4kd....'
	}
}]

// Asynchronously
// await helikaSDK.createEvent(events);

helikaSDK.createEvent(events)
.then((resp) => {
	//do something...
	// console.log(resp);
}).catch(e => {
	console.log(e);
});

```

## HelikaUA API Use Cases:

### Log Referral Example:

Arguments:<br />
&emsp;wallet_adress: string // wallet_adress of the new user being referred<br />
&emsp;url: string (optional)// Custom URL of your project<br />
&emsp;link_id: string (optional)// ambassador referral_id of the referrer<br />
&emsp;email_address: string (optional)// email address of the referred new user<br />
&emsp;phone_number: string (optional)// phone number of the referred new user<br />

Response:<br />
&emsp;{<br />
&emsp;&emsp;referral_link: string // ink to raffle refferal page,<br />
&emsp;&emsp;referral_id: string // ambassador referral_id of the referred user<br />
&emsp;}<br />

```ts
import Helika from "helika-sdk"
import { UABaseURL } from "helika-sdk"

const wallet_adress = '0x123abc456def'; //insert wallet of referree here
const url = 'helikausdk'; //(optional) example project on DEV
const link_id = 'fqOm45Jv'; //(optional) example link id for an ambassador on the example project
const email_address = ''; // (optional) insert referree email here
const phone_number = '1234567890' // (optional) insert referree phone number here
const api_key = 'reYam27iBtMqeGuEhR2ywSV6440wo3gx2CcIC5IK6RNHRCvBoKAHdsNx3FyLz2t1'; //demo api key for DEV

const helikaUA = new Helika.UA(api_key, UABaseURL.UA_DEV);

helikaUA.logReferral(wallet_adress,url,link_id,email_address,phone_number).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```

### Log View Example:

Arguments:<br />
&emsp;url: string (optional)// Custom URL of your project<br />
&emsp;link_id: string // ambassador referral_id of the referrer<br />

Response: N/A


```ts
import Helika from "helika-sdk"
import { UABaseURL } from "helika-sdk"

const url = 'helikausdk'; // (optional) example project on DEV
const link_id = 'fqOm45Jv'; // (optional) example link id for an ambassador on the example project
const api_key = 'reYam27iBtMqeGuEhR2ywSV6440wo3gx2CcIC5IK6RNHRCvBoKAHdsNx3FyLz2t1'; //demo api key for DEV

var helikaUA = new Helika.UA(api_key, UABaseURL.UA_DEV);

helikaUA.logView(url,link_id).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e)
});
```

### Is Ambassador Check Example:

Arguments:<br />
&emsp;url: string // Custom URL of your project<br />
&emsp;wallet_address: string // wallet_address of the user to be checked<br />

Response: boolean


```ts
import Helika from "helika-sdk"
import { UABaseURL } from "helika-sdk"

const url = "helikausdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";

const helikaUA = new Helika.UA(api_key, UABaseURL.UA_DEV);

helikaUA.isAmbassador(
      url,
      wallet_address,
    ).then((resp) => {
      if (resp) {
        // do something if wallet_address belongs to an ambassador
      } else {
        // do something else if wallet_address doesn't belong to an ambassador
      }
}).catch(e => {
	console.log(e);
});
```


### Ambassador Data Example:

Arguments:<br />
&emsp;url: string // Custom URL of your project<br />
&emsp;wallet_address: string // wallet_address of the user to be checked<br />

Response:<br />
&emsp;{<br />
&emsp;&emsp;clicks: number, // the number of clicks/views of this project via the ambassador <br />
&emsp;&emsp;referrals: number, // the number of referred users by this ambassador<br />
&emsp;&emsp;referral_mints: number, // the number of mints by referred users from the ambassador <br />
&emsp;&emsp;amount_owed: number, // the commission earned from referred mints by this ambassador <br />
&emsp;&emsp;amount_claimable: number, //commissions from referred mints that haven't been claimed yet by the ambassador <br />
&emsp;&emsp;amount_claimed: number, // commissions from referred mints that have already been claimed the by ambassador<br />
&emsp;&emsp;additional_raffle_entries: number, // raffle entries earned from referring users<br />
&emsp;&emsp;type: ENUM string ["PAID", "LINK", "RAFFLE", "LIVE", "DQ"], // type of the ambassador <br />
&emsp;&emsp;is_on_allow_list: boolean, // boolean indicating if the ambassador is on the allowlist for the project <br />
&emsp;&emsp;link_id: string, // link id of the ambassador<br />
&emsp;&emsp;ambassador_link: string // link to the referral page where new us<br />
&emsp;}<br />

```ts
import Helika from "helika-sdk"
import { UABaseURL } from "helika-sdk"

const url = "helikausdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";

const helikaUA = new Helika.UA(api_key, UABaseURL.UA_DEV);

helikaUA.ambassadorLink(
      url,
      wallet_address,
    ).then((resp) => {
      
      // console.log(resp) example return:
      // {
      //     "clicks":0,
      //     "referrals":0,
      //     "referral_mints":0,
      //     "amount_owed":"0",
      //     "amount_claimable":"0",
      //     "amount_claimed":"0",
      //     "additional_raffle_entries":0,
      //     "type":"LIVE",
      //     "is_on_allow_list":false,
      //     "link_id":"toRMyGkK",
      //     "ambassador_link":"https://ua-dev.helika.io/p/helikasdk/toRMyGkK"
      //}
      
      // console.log(resp.clicks) // returns 0
      
}).catch(e => {
	console.log(e);
});
```