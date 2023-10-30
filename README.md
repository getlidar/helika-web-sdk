# Helika User Acquisition SDK

SDK for use with the Events endpoints (https://api.helika.io/v1 or https://api-stage.helika.io/v1)

The Helika SDK is for developers to be able to make API calls to the Helika DEV and PROD endpoints.
The following pages will describe how to make calls to the Helika API. Developers will need to install the helika-sdk to their project.

## Installation


```ts
npm i helika-sdk
```


## Usage	

### API KEY

An API Key is required to use the SDK.

For an Events SDK Instance, an API Key from Helika is required. Please reach out to your Helika contact or inquiring through https://www.helika.io/contact/ .

### Base URL 

The SDK can send to DEV or PROD endpoints depending on the Base URLs to the sdk on instance creation (see step 1 in Instance Creation section). 

#### EventsBaseURL
- EVENTS_DEV
- EVENTS_PROD

Use the EventsBaseURL enum for `Helika.Events`

For Development, use **EVENT_DEV**. This sends the events and queries to the develop environments. 

For Production, use **EVENT_PROD**. This sends the events and queries to the production environments. 

## Quick Start

### Event Example:

```ts
import Helika from "helika-sdk"
import { EventsBaseURL } from "helika-sdk"

const helikaSDK = new Helika.EVENTS(api_key, EventsBaseURL.EVENTS_DEV);

// Start a session/create a new session which initiates the SDK instance with a
// sessionId which is required to fire events. This should only be called when 
// the user lands on the page. We store and re-use the session_id from the local
// storage, if present.
await helikaSDK.startSession();

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
	console.error(e);
});

```

## Full docs
For the full documentation, please head to [official docs](https://dash.readme.com/project/helika/v1.0/docs/web-sdk).