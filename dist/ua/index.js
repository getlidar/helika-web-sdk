"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UA = void 0;
const base_1 = require("../base");
const index_1 = require("../index");
class UA extends base_1.Base {
    constructor(apiKey, baseUrl) {
        super(apiKey);
        switch (baseUrl) {
            // case UABaseURL.LOCAL: {
            //   this.baseUrl = "http://localhost:3000";
            //   break;
            // }
            case index_1.UABaseURL.UA_PROD: {
                this.baseUrl = "https://ua-api.helika.io";
                break;
            }
            case index_1.UABaseURL.UA_DEV:
            default: {
                this.baseUrl = "https://ua-api-dev.helika.io";
                break;
            }
        }
    }
    logView(url, link_id) {
        var params = {};
        if (url)
            params.url = url;
        if (link_id)
            params.link_id = link_id;
        return this.postRequest(`/sdk/nft/view`, params);
    }
    logReferral(wallet_address, url, link_id, email, phone, twitter, discord) {
        var params = {
            wallet_address: wallet_address
        };
        if (url)
            params.url = url;
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
    isAmbassador(url, wallet_address) {
        var params = {
            url: url,
            wallet_address: wallet_address
        };
        return this.getRequest(`/sdk/nft/is-registered-user`, params);
    }
    ambassadorLink(url, wallet_address) {
        var params = {
            url: url,
            wallet_address: wallet_address
        };
        return this.getRequest(`/sdk/nft/user`, params);
    }
}
exports.UA = UA;
