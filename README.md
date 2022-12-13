# refmint-sdk

SDK for use with https://app.refmint.xyz or https://test.refmint.xyz

The Refmint SDK is for developers to be able to make API calls to the Refmint app server and testnet server.
The following pages will describe how to make calls to the Refmint API. Developers will need to install the refmint-sdk to their project. This can be done using npm or by cloning the github project.

```ts
npm i refmint-sdk
```


## Usage	

Log Referral Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;wallet_adress: string // wallet_adress of the new user being referred<br />
&emsp;link_id: string // affiliate referral_id of the referrer<br />
&emsp;email_address (optional): string // email address of the referred new user<br />
&emsp;phone_number (optional): string // phone number of the referred new user<br />

Response:<br />
&emsp;{<br />
&emsp;&emsp;referral_link: string // ink to raffle refferal page,<br />
&emsp;&emsp;referral_id: string // affiliate referral_id of the referred user<br />
&emsp;}<br />

```ts
import Refmint from "refmint-sdk"

const custom_url = 'refmintsdk'; //example project on testnet
const wallet_adress = '0x123abc456def'; //insert wallet of referree here
const link_id = 'fqOm45Jv'; //example link id for an affiliate on the example project
const email_address = ''; // (optional) insert referree email here
const phone_number = '1234567890' // (optional) insert referree phone number here
const api_key = 'reYam27iBtMqeGuEhR2ywSV6440wo3gx2CcIC5IK6RNHRCvBoKAHdsNx3FyLz2t1'; //demo api key for testnet

var refmintClient = new Refmint({
	apiKey: api_key,
	baseUrl: "https://test.refmint.xyz"
});

refmintClient.logReferral(custom_url,wallet_adress,link_id,email_address,phone_number).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```

Log View Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;link_id: string // affiliate referral_id of the referrer<br />

Response: N/A


```ts
import Refmint from "refmint-sdk"

const custom_url = 'refmintsdk'; //example project on testnet
const link_id = 'fqOm45Jv'; //example link id for an affiliate on the example project
const api_key = 'reYam27iBtMqeGuEhR2ywSV6440wo3gx2CcIC5IK6RNHRCvBoKAHdsNx3FyLz2t1'; //demo api key for testnet

var refmintClient = new Refmint({
	apiKey: api_key,
	baseUrl: "https://test.refmint.xyz"
});

refmintClient.logView(custom_url,link_id).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e)
});
```

Is Affiliate Check Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;wallet_address: string // wallet_address of the user to be checked<br />

Response: boolean


```ts
import Refmint from "refmint-sdk"

const custom_url = "refmintsdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";

refmintClient.isAffiliate(
      custom_url,
      wallet_address,
    ).then((resp) => {
      if (resp) {
        // do something if wallet_address belongs to an affiliate
      } else {
        // do something else if wallet_address doesn't belong to an affiliate
      }
}).catch(e => {
	console.log(e);
});
```


Affiliate Data Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;wallet_address: string // wallet_address of the user to be checked<br />

Response:<br />
&emsp;{<br />
&emsp;&emsp;clicks: number, // the number of clicks/views of this project via the affiliate <br />
&emsp;&emsp;referrals: number, // the number of referred users by this affiliate<br />
&emsp;&emsp;referral_mints: number, // the number of mints by referred users from the affiliate <br />
&emsp;&emsp;amount_owed: number, // the commission earned from referred mints by this affiliate <br />
&emsp;&emsp;amount_claimable: number, //commissions from referred mints that haven't been claimed yet by the affiliate <br />
&emsp;&emsp;amount_claimed: number, // commissions from referred mints that have already been claimed the by affiliate<br />
&emsp;&emsp;additional_raffle_entries: number, // raffle entries earned from referring users<br />
&emsp;&emsp;type: ENUM string ["PAID", "LINK", "RAFFLE", "LIVE", "DQ"], // type of the affiliate <br />
&emsp;&emsp;is_on_allow_list: boolean, // boolean indicating if the affiliate is on the allowlist for the project <br />
&emsp;&emsp;link_id: string, // link id of the affiliate<br />
&emsp;&emsp;affiliate_link: string // link to the referral page where new us<br />
&emsp;}<br />

```ts
import Refmint from "refmint-sdk"

const custom_url = "refmintsdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";

refmintClient.affiliateLink(
      custom_url,
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
      //     "affiliate_link":"https://test.refmint.xyz/p/refmintsdk/toRMyGkK"
      //}
      
      // console.log(resp.clicks) // returns 0
      
}).catch(e => {
	console.log(e);
});
```


Modify Score Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;wallet_adress: string // wallet_adress of the user whose score we want to add to<br />
&emsp;score: number // how much to add to user score<br />

Response: N/A

```ts
import Refmint from "refmint-sdk"

const custom_url = 'refmintsdk'; // custom url for the project
const wallet_adress = '0x123abc456def'; // wallet address for the user
const score = 10; // add 10 to the user's score

var refmintClient = new Refmint({
	apiKey: api_key,
	baseUrl: "https://test.refmint.xyz"
});

refmintClient.modifyScore(custom_url,wallet_adress,score).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```

Query Leaderboard Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;order_by: string // what to sort leaderboard by 'score' or referral<br />
&emsp;page_size: number // how many users to include in query result<br />
&emsp;page: number // which page of users to return, ie set to page to 2 and page size to 1o if you want users 11-20<br />
&emsp;with_points_only: boolean // whether to only include users with a score or not<br />

Response:<br />
An array of objects:<br />
[<br />
&emsp;{<br />
&emsp;&emsp;created_at: number, // date this user object for the leaderboard was created <br />
&emsp;&emsp;project_id: string, // unique ID for the project<br />
&emsp;&emsp;referral: number, // number of referrals by the user for the project<br />
&emsp;&emsp;score: number, // the user's score for the project<br />
&emsp;&emsp;updated_at: number, // the date the user was last updated<br />
&emsp;&emsp;wallet_address: string, // the user's wallet address<br />
&emsp;&emsp;_id_: string, // the user's unique id for the project<br />
&emsp;}<br />
&emsp;,{<br />
&emsp;&emsp;...<br />
&emsp;}<br />
]

```ts
import Refmint from "refmint-sdk"

const custom_url = 'refmintsdk'; //example project on testnet
const order_by = 'score'; // order the leaderboard by highgest score
const page_size = 10; // include 10 users in this request
const page = 1; // get the first (page_size) users , i.e. users 1-10 in this case with the top score
const with_points_only = true; // only include users in the list of their score is greater than 0

var refmintClient = new Refmint({
	apiKey: api_key,
	baseUrl: "https://test.refmint.xyz"
});

refmintClient.queryLeaderboard(custom_url,order_by,page_size,page,with_points_only).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```


My Score Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;wallet_address: string // the wallet address of the user to check for a score<br />

Response:<br />
An Object:<br />
&emsp;{<br />
&emsp;&emsp;created_at: number, // date this user object for the leaderboard was created <br />
&emsp;&emsp;project_id: string, // unique ID for the project<br />
&emsp;&emsp;referral: number, // number of referrals by the user for the project<br />
&emsp;&emsp;score: number, // the user's score for the project<br />
&emsp;&emsp;updated_at: number, // the date the user was last updated<br />
&emsp;&emsp;wallet_address: string, // the user's wallet address<br />
&emsp;&emsp;_id_: string, // the user's unique id for the project<br />
&emsp;}<br />

```ts
import Refmint from "refmint-sdk"

const custom_url = 'refmintsdk'; //example project on testnet
const wallet_address = '0x123abc456def'; // order the leaderboard by highgest score

var refmintClient = new Refmint({
	apiKey: api_key,
	baseUrl: "https://test.refmint.xyz"
});

refmintClient.myScore(custom_url,wallet_address).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```

Is On Allowlist Check Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;wallet_address: string // wallet_address of the user to be checked<br />

Response: boolean


```ts
import Refmint from "refmint-sdk"

const custom_url = "refmintsdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";

refmintClient.isOnAllowlist(
      custom_url,
      wallet_address,
    ).then((resp) => {
      if (resp) {
        // do something if wallet_address is on the allowlist
      } else {
        // do something else if wallet_address isn't on the allowlist
      }
}).catch(e => {
	console.log(e);
});
```


Get Allowlist Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;page_size: number // how many users to include in query result<br />
&emsp;page: number // which page of users to return, ie set to page to 2 and page size to 1o if you want users 11-20<br />

Response: Array of users on allowlist


```ts
import Refmint from "refmint-sdk"

const custom_url = "refmintsdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";
const page = 1;
const page_size = 1-;

refmintClient.getAllowlist(
      custom_url,
      page,
      page_size
    ).then((resp) => {
      if (resp) {
        // do something with allowlist
      }
}).catch(e => {
	console.log(e);
});
```
