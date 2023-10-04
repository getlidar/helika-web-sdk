# Helika User Acquisition SDK

SDK for use with the UA endpoints (https://ua-api.helika.io or https://ua-api-dev.helika.io) or the Events endpoints (https://api.helika.io/v1 or https://api-stage.helika.io/v1)

The Helika SDK is for developers to be able to make API calls to the Helika Mainnet and Testnet endpoints.
The following pages will describe how to make calls to the Helika API. Developers will need to install the helika-sdk to their project.

## Installation


```ts
npm i helika-sdk
```


## Usage	

There are two main uses for the Helika SDK

1.) Use with the Helika Events API
This is for sending events to the Helika API in a pre-defined structure. You will need to use your Events API Key given to you by Helika.

2.) Sending User Acquisition calls to the HelikaUA API
This is for UA calls such as logging UA project referrals or checking ambassadors. You will need to use your UA API Key given to you by Helika (can also be found in the settings page on the Helika UA app).

## Helika Events API Use Cases	

### Fingerprinting Example:

Arguments: N/A

Response: {<br />
&emsp;fingerprint_id: string // user fingerprint id<br />
&emsp;request_id: string // request fingerprint id<br />
}

```ts
import Helika from "helika-sdk"
import { BaseURLOptions } from "helika-sdk"

var helikaCaller = new Helika.EVENTS({
	apiKey: api_key,
	baseUrlOption: BaseURLOptions.EVENTS_TESTNET
});

helikaCaller.fingerprint().then((fingerprintData) => {
	//do something...
	// console.log(fingerprintData);
}).catch(e => {
	console.log(e);
});

```


### Event Example:

Arguments:<br />
&emsp;id: string // unique if of event<br />
&emsp;events: event[] // array of events you want to log<br />

event: {<br />
&emsp;game_id: string // unique id of game<br />
&emsp;event_type: string // type of event<br />
&emsp;event: object // event information as an object<br />
}

Response: {<br />
&emsp;message: string<br />
&emsp;status: number // e.g. 200 OK<br />
}

```ts
import Helika from "helika-sdk"
import { BaseURLOptions } from "helika-sdk"

var helikaCaller = new Helika.EVENTS({
	apiKey: api_key,
	baseUrlOption: BaseURLOptions.EVENTS_TESTNET
});

events = [
	game_id: 'my_game',
	event_type: 'win_event',
	event: {
		user: 'user_1',
		win_number: 1,
		wallet: '0x4kd....'
	}
]

helikaCaller.createEvent({
	id: '123abc',
	events: events
}).then((resp) => {
	//do something...
	// console.log(resp);
}).catch(e => {
	console.log(e);
});

```

### UA Event Example:

Arguments:<br />
&emsp;id: string // unique if of event<br />
&emsp;events: event[] // array of events you want to log<br />

event: {<br />
&emsp;event_type: string // type of event<br />
&emsp;event: object // event information as an object<br />
}

Response: {
&emsp;message: string<br />
&emsp;status: number // 200 OK<br />
}

```ts
import Helika from "helika-sdk"
import { BaseURLOptions } from "helika-sdk"

var helikaCaller = new Helika.EVENTS({
	apiKey: api_key,
	baseUrlOption: BaseURLOptions.EVENTS_TESTNET
});

events = [
	event_type: 'REFERRAL',
	event: {
		project: 'MY_AMBASSADOR_PROJECT',
		wallet: '0x4kd....'
	}
]

helikaCaller.createEvent({
	id: '123abc',
	events: events
}).then((resp) => {
	//do something...
	// console.log(resp);
}).catch(e => {
	console.log(e);
});

```


## HelikaUA API Use Cases:

### Log Referral Example:

Arguments:<br />
&emsp;url: string // Custom URL of your project<br />
&emsp;wallet_adress: string // wallet_adress of the new user being referred<br />
&emsp;link_id: string // ambassador referral_id of the referrer<br />
&emsp;email_address (optional): string // email address of the referred new user<br />
&emsp;phone_number (optional): string // phone number of the referred new user<br />

Response:<br />
&emsp;{<br />
&emsp;&emsp;referral_link: string // ink to raffle refferal page,<br />
&emsp;&emsp;referral_id: string // ambassador referral_id of the referred user<br />
&emsp;}<br />

```ts
import Helika from "helika-sdk"
import { BaseURLOptions } from "helika-sdk"

const url = 'helikausdk'; //example project on testnet
const wallet_adress = '0x123abc456def'; //insert wallet of referree here
const link_id = 'fqOm45Jv'; //example link id for an ambassador on the example project
const email_address = ''; // (optional) insert referree email here
const phone_number = '1234567890' // (optional) insert referree phone number here
const api_key = 'reYam27iBtMqeGuEhR2ywSV6440wo3gx2CcIC5IK6RNHRCvBoKAHdsNx3FyLz2t1'; //demo api key for testnet

var helikaUA = new Helika.UA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.UA_TESTNET
});

helikaUA.logReferral(url,wallet_adress,link_id,email_address,phone_number).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```

### Log View Example:

Arguments:<br />
&emsp;url: string // Custom URL of your project<br />
&emsp;link_id: string // ambassador referral_id of the referrer<br />

Response: N/A


```ts
import Helika from "helika-sdk"
import { BaseURLOptions } from "helika-sdk"

const url = 'helikausdk'; //example project on testnet
const link_id = 'fqOm45Jv'; //example link id for an ambassador on the example project
const api_key = 'reYam27iBtMqeGuEhR2ywSV6440wo3gx2CcIC5IK6RNHRCvBoKAHdsNx3FyLz2t1'; //demo api key for testnet

var helikaUA = new Helika.UA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.UA_TESTNET
});

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
import { BaseURLOptions } from "helika-sdk"

const url = "helikausdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";

var helikaUA = new Helika.UA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.UA_TESTNET
});

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
import { BaseURLOptions } from "helika-sdk"

const url = "helikausdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";

var helikaUA = new Helika.UA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.UA_TESTNET
});

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