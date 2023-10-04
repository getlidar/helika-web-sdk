import { Base, Config } from "../base";

export class UA extends Base {

  constructor(config: Config) {
		super(config);
    //switch (config.baseUrlOption) {
    //  case BaseURLOptions.UA_LOCAL:
    //      this.baseUrl = 'http://localhost:3000';
    //      return;
    //  case BaseURLOptions.UA_MAINNET:
    //      this.baseUrl = 'https://ua-api.helika.io';
    //      return;
    //  case BaseURLOptions.UA_TESTNET:
    //  default:
    //      this.baseUrl = 'https://ua-api-dev.helika.io';
    //      return;
    //}
  }
  
  logView(
    url:string,
    link_id?:string
  ): Promise<string|null> {

    var params:{
      url:string,
      link_id?:string,
    } = { 
      url: url,
    }
    if (link_id) params.link_id = link_id;

    return this.postRequest(`/sdk/nft/view`,params);
  }

  logReferral(
    url:string,
    wallet_address: string,
    link_id?:string,
    email?: string,
    phone?: string,
    twitter?: string,
    discord?: string,
  ): Promise<{referral_link: string, referral_id:string}> {

    var params:{
      url:string,
      wallet_address: string,
      link_id?:string,
      email?: string,
      phone?: string,
      twitter?: string,
      discord?: string,
    } = { 
      url: url,
      wallet_address: wallet_address
    }
    if (link_id) params.link_id = link_id;
    if (email) params.email = email;
    if (phone) params.phone = phone;
    if (twitter) params.twitter = twitter;
    if (discord) params.discord = discord;

    return this.postRequest(`/sdk/nft/referral`,params);
  }

  isAmbassador(
    url:string,
    wallet_address: string,
  ): Promise<boolean> {

    var params:{
      url:string,
      wallet_address: string
    } = { 
      url: url,
      wallet_address: wallet_address
    }

    return this.getRequest(`/sdk/nft/is-registered-user`,params);
  }

  ambassadorLink(
    url:string,
    wallet_address: string,
  ): Promise<{referral_link: string, referral_id: string}> {

    var params:{
      url:string,
      wallet_address: string
    } = { 
      url: url,
      wallet_address: wallet_address
    }

    return this.getRequest(`/sdk/nft/user`,params);
  }
  
}