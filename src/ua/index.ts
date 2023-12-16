import { Base } from "../base";
import { UABaseURL } from "../index";

export class UA extends Base {
  constructor(apiKey: string, baseUrl: UABaseURL) {
    super(apiKey, 'helika_ua');

    switch (baseUrl) {
      // case UABaseURL.LOCAL: {
      //   this.baseUrl = "http://localhost:3000";
      //   break;
      // }
      case UABaseURL.UA_PROD: {
        this.baseUrl = "https://ua-api.helika.io";
        break;
      }
      case UABaseURL.UA_DEV:
      default: {
        this.baseUrl = "https://ua-api-dev.helika.io";
        break;
      }
    }
  }

  logView(
    url?: string,
    link_id?: string
  ): Promise<string | null> {

    var params: {
      url?: string,
      link_id?: string,
    } = {};

    if (url) params.url = url;
    if (link_id) params.link_id = link_id;

    return this.postRequest(`/sdk/nft/view`, params);
  }

  logReferral(
    wallet_address: string,
    url?: string,
    link_id?: string,
    email?: string,
    phone?: string,
    twitter?: string,
    discord?: string,
  ): Promise<{ referral_link: string, referral_id: string }> {

    var params: {
      wallet_address: string,
      url?: string,
      link_id?: string,
      email?: string,
      phone?: string,
      twitter?: string,
      discord?: string,
    } = {
      wallet_address: wallet_address
    }
    if (url) params.url = url;
    if (link_id) params.link_id = link_id;
    if (email) params.email = email;
    if (phone) params.phone = phone;
    if (twitter) params.twitter = twitter;
    if (discord) params.discord = discord;

    return this.postRequest(`/sdk/nft/referral`, params);
  }

  isAmbassador(
    url: string,
    wallet_address: string,
  ): Promise<boolean> {

    var params: {
      url: string,
      wallet_address: string
    } = {
      url: url,
      wallet_address: wallet_address
    }

    return this.getRequest(`/sdk/nft/is-registered-user`, params);
  }

  ambassadorLink(
    url: string,
    wallet_address: string,
  ): Promise<{ referral_link: string, referral_id: string }> {

    var params: {
      url: string,
      wallet_address: string
    } = {
      url: url,
      wallet_address: wallet_address
    }

    return this.getRequest(`/sdk/nft/user`, params);
  }

}