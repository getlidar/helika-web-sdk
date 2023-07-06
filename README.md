# Helika User Acquisition SDK

SDK for use with https://nft.helika.io or https://test.nft.helika.io

The Helika UA SDK is for developers to be able to make API calls to the Helika UA Mainnet and Testnet endpoints.
The following pages will describe how to make calls to the Helika UA API. Developers will need to install the helika-ua-sdk to their project. This can be done using npm or by cloning the github project.

## Installation


```ts
npm i helika-ua-sdk
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
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const custom_url = 'helikausdk'; //example project on testnet
const wallet_adress = '0x123abc456def'; //insert wallet of referree here
const link_id = 'fqOm45Jv'; //example link id for an affiliate on the example project
const email_address = ''; // (optional) insert referree email here
const phone_number = '1234567890' // (optional) insert referree phone number here
const api_key = 'reYam27iBtMqeGuEhR2ywSV6440wo3gx2CcIC5IK6RNHRCvBoKAHdsNx3FyLz2t1'; //demo api key for testnet

var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.logReferral(custom_url,wallet_adress,link_id,email_address,phone_number).then((resp) => {
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
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const custom_url = 'helikausdk'; //example project on testnet
const link_id = 'fqOm45Jv'; //example link id for an affiliate on the example project
const api_key = 'reYam27iBtMqeGuEhR2ywSV6440wo3gx2CcIC5IK6RNHRCvBoKAHdsNx3FyLz2t1'; //demo api key for testnet

var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.logView(custom_url,link_id).then((resp) => {
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
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const custom_url = "helikausdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";

var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.isAffiliate(
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
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const custom_url = "helikausdk";
const wallet_address = "0xE7bb679Fa033517393001e1E43b3d326016E0A0c";

var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.affiliateLink(
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
      //     "affiliate_link":"https://test.nft.helika.io/p/helikasdk/toRMyGkK"
      //}
      
      // console.log(resp.clicks) // returns 0
      
}).catch(e => {
	console.log(e);
});
```


Modify Score Example:

Arguments:<br />
&emsp;project_url: string // Custom URL of your project<br />
&emsp;campaign_url: string // Custom URL of your campaign<br />
&emsp;users: {<br />
&emsp;&emsp;wallet_adress: string // wallet_adress of the user whose score we want to add to<br />
&emsp;&emsp;score: number // how much to add to be added/subtracted to user score<br />
&emsp;}[] // array of objects which has a wallet address and score to be added/subtracted to user score<br />

Response: N/A

```ts
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const project_url = 'helikausdk'; // custom url for the project
const campaign_url = 'campaignURL'; // custom url for the project
const users = [
  {
    wallet_address: '0x123abc456def',
    score: 10
  },
  {
    wallet_address: '0xabc123def456',
    score: -3
  },
];

var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.modifyScore(custom_url,campaign_url,users).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```

Query Leaderboard Example:

Arguments:<br />
&emsp;project_url: string // Custom URL of your project<br />
&emsp;campaign_url: string // Custom URL of your campaign<br />
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
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const project_url = 'helikausdk'; //example project on testnet
const campaign_url = 'campaignURL'; //example campaign on testnet
const order_by = 'score'; // order the leaderboard by highgest score
const page_size = 10; // include 10 users in this request
const page = 1; // get the first (page_size) users , i.e. users 1-10 in this case with the top score
const with_points_only = true; // only include users in the list of their score is greater than 0

var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.leaderboard(project_url,campaign_url,order_by,page_size,page,with_points_only).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```


User Score Example:

Arguments:<br />
&emsp;project_url: string // Custom URL of your project<br />
&emsp;campaign_url: string // Custom URL of your campaign<br />
&emsp;wallet_address: string // the wallet address of the user to check for a score<br />

Response:
{<br />
&emsp;project_url: string, // custom_url of the project <br />
&emsp;campaign_url: string, // custom_url of the campaign<br />
&emsp;wallet_address: string, // wallet_address of user<br />
}<br />

```ts
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const custom_url = 'helikausdk'; //example project on testnet
const campaign_url = 'myCampaignURL'; // example campaign in the project
const wallet_address = '0x123abc456def'; // example wallet_address

var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.userScore(custom_url,campaign_url,wallet_address).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```


Add Users Example:

Arguments:<br />
&emsp;project_url: string // Custom URL of your project<br />
&emsp;campaign_url: string // Custom URL of your campaign<br />
&emsp;users: { wallet_address: string, score: number, referral: number }[] // array of objects (object is a user object with a wallet_addres, the score, and referrals total)<br />
&emsp;link_id?: string // optional, whether or not to attribute a referral, insert the link_id of the referrer<br />

Response:

An array of user objects:<br />
[<br />
&emsp;{<br />
&emsp;&emsp;wallet_address: string // wallet_address of the referred user<br />
&emsp;&emsp;referral_link: string // referral link for new user for the campaign<br />
&emsp;&emsp;referral_id: string // added user's referral id<br />
&emsp;}<br />
&emsp;,{<br />
&emsp;&emsp;...<br />
&emsp;}<br />
]

```ts
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const custom_url = 'helikausdk'; //example project on testnet
const campaign_url = 'myCampaignURL'; // example campaign
const users = [{wallet_address:'0x123abc456def', score: 0, referral: 0}]; // example user to be added
const link_id = 'fqOm45Jv'; // optional, example link_id of the referrer

var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.addUsers(custom_url,campaign_url,users,link_id).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```


Referral Example:

Arguments:<br />
&emsp;project_url: string // Custom URL of your project<br />
&emsp;campaign_url: string // Custom URL of your campaign<br />
&emsp;wallet_address: string // the wallet address of the user to add a referral to<br />
&emsp;referral_only: boolean // true if only to count referral, false if you want to add points as well (based on campaign points_per_referral)<br />

Response: N/A

```ts
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const project_url = 'helikausdk'; //example project on testnet
const campaign_url = 'myCampaignURL'; // example campaign
const wallet_address = '0x123abc456def'; // example wallet_address to add referral to
const referral_only = true; // only add referral (or false to add points as well)

var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.referral(project_url,campaign_url,wallet_address,referral_only).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```


Is User Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;wallet_address: string // wallet addresses to check if user of project<br />

Response: boolean

```ts
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const custom_url = 'helikausdk'; //example project on testnet
const wallet_address = '0x123abc456def'; //wallet address to check


var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.isUser(custom_url,wallet_address).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```


User Links Example:

Arguments:<br />
&emsp;custom_url: string // Custom URL of your project<br />
&emsp;wallet_address: string // wallet addresses to grab links for<br />

Response: Object<br />
{
&emsp;referral_link: string // referral link to the project<br />
&emsp;referral_id: string // referral_id of the user<br />
}

```ts
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const custom_url = 'helikausdk'; //example project on testnet
const wallet_address = '0x123abc456def'; //wallet address to check


var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.userLinks(custom_url,wallet_address).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```


Click Example:

Arguments:<br />
&emsp;project_url: string // Custom URL of your project<br />
&emsp;campaign_url: string // Custom URL of your campaign<br />
&emsp;link_id?: string // optional, user's link id to attribute click to<br />

Response: N/A

```ts
import HelikaUA from "helika-ua-sdk"
import { BaseURLOptions } from "helika-ua-sdk"

const project_url = 'helikausdk'; //example project on testnet
const campaign_url = 'campaign_1'; //example project on testnet
const link_id? = 'fqOm45Jv'; // optional, example link_id of the referrer


var helikaUA = new HelikaUA({
	apiKey: api_key,
	baseUrl: BaseURLOptions.TESTNET
});

helikaUA.click(project_url,campaign_url,link_id).then((resp) => {
	//do something...
}).catch(e => {
	console.log(e);
});

```