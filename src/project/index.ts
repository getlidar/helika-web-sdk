import { Base } from "../base";

export class Project extends Base {
  
  logView(
    custom_url:string,
    link_id?:string
  ): Promise<{referral_link: string, referral_id:string}> {

    var params:{
      custom_url:string,
      link_id?:string,
    } = { 
      custom_url: custom_url,
    }
    if (link_id) params.link_id = link_id;

    return this.postRequest(`/external/view`,params);
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

    return this.postRequest(`/external/referral`,params);
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

    return this.getRequest(`/external/is-affiliate`,params);
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

    return this.getRequest(`/external/affiliate`,params);
  }

  //doesn't require api key
  isOnAllowlist(
    wallet_address:string,
    custom_url:string,
  ): Promise<boolean> {

    var params:{
      wallet_address: string,
      custom_url:string,
    } = { 
      wallet_address: wallet_address,
      custom_url: custom_url,
    }

    return this.getRequest(`/external/is-on-allow-list`,params);
  }

  getAllowlist(
    custom_url: string,
    page: number,
    page_size: number,
  ): Promise<boolean> {

    var params:{
      custom_url: string,
      page: number,
      page_size: number,
    } = { 
      custom_url: custom_url,
      page: page,
      page_size: page_size,
    }

    return this.getRequest(`/external/allow-list`,params);
  }
  
}