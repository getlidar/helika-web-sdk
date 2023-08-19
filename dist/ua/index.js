"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UA = void 0;
const base_1 = require("../base");
class UA extends base_1.Base {
    constructor(config) {
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
    logView(custom_url, link_id) {
        var params = {
            custom_url: custom_url,
        };
        if (link_id)
            params.link_id = link_id;
        return this.postRequest(`/sdk/nft/view`, params);
    }
    logReferral(custom_url, wallet_address, link_id, email, phone, twitter, discord) {
        var params = {
            custom_url: custom_url,
            wallet_address: wallet_address
        };
        if (link_id)
            params.link_id = link_id;
        if (email)
            params.email = email;
        if (phone)
            params.phone = phone;
        if (twitter)
            params.twitter = twitter;
        if (discord)
            params.discord = discord;
        return this.postRequest(`/sdk/nft/referral`, params);
    }
    isAffiliate(custom_url, wallet_address) {
        var params = {
            custom_url: custom_url,
            wallet_address: wallet_address
        };
        return this.getRequest(`/sdk/nft/is-affiliate`, params);
    }
    affiliateLink(custom_url, wallet_address) {
        var params = {
            custom_url: custom_url,
            wallet_address: wallet_address
        };
        return this.getRequest(`/sdk/nft/affiliate`, params);
    }
}
exports.UA = UA;
