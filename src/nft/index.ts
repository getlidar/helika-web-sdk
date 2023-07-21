import { BaseURLOptions } from "..";
import { Base, Config } from "../base";

export class NFT extends Base {

  constructor(config: Config) {
		super(config);
		
    switch(config.baseUrlOption) {
      case BaseURLOptions.LOCAL:
        this.baseUrl = 'http://localhost:3000';
        return;
      case BaseURLOptions.MAINNET:
        this.baseUrl = 'https://ua-api.helika.io'
        return;
      case BaseURLOptions.TESTNET:
      default:
        this.baseUrl = 'https://ua-api-dev.helika.io'
        return;
    }
  }
  
  logView(
    custom_url:string,
    link_id?:string
  ): Promise<string|null> {

    var params:{
      custom_url:string,
      link_id?:string,
    } = { 
      custom_url: custom_url,
    }
    if (link_id) params.link_id = link_id;

    return this.postRequest(`/sdk/nft/view`,params);
  }

  logReferral(
    custom_url:string,
    wallet_address: string,
    link_id?:string,
    email?: string,
    phone?: string,
    twitter?: string,
    discord?: string,
  ): Promise<{referral_link: string, referral_id:string}> {

    var params:{
      custom_url:string,
      wallet_address: string,
      link_id?:string,
      email?: string,
      phone?: string,
      twitter?: string,
      discord?: string,
    } = { 
      custom_url: custom_url,
      wallet_address: wallet_address
    }
    if (link_id) params.link_id = link_id;
    if (email) params.email = email;
    if (phone) params.phone = phone;
    if (twitter) params.twitter = twitter;
    if (discord) params.discord = discord;

    return this.postRequest(`/sdk/nft/referral`,params);
  }

  isAffiliate(
    custom_url:string,
    wallet_address: string,
  ): Promise<boolean> {

    var params:{
      custom_url:string,
      wallet_address: string
    } = { 
      custom_url: custom_url,
      wallet_address: wallet_address
    }

    return this.getRequest(`/sdk/nft/is-affiliate`,params);
  }

  affiliateLink(
    custom_url:string,
    wallet_address: string,
  ): Promise<{referral_link: string, referral_id: string}> {

    var params:{
      custom_url:string,
      wallet_address: string
    } = { 
      custom_url: custom_url,
      wallet_address: wallet_address
    }

    return this.getRequest(`/sdk/nft/affiliate`,params);
  }
  
}