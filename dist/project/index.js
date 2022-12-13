"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const base_1 = require("../base");
class Project extends base_1.Base {
    logView(custom_url, link_id) {
        var params = {
            custom_url: custom_url,
        };
        if (link_id)
            params.link_id = link_id;
        return this.postRequest(`/external/view`, params);
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
        return this.postRequest(`/external/referral`, params);
    }
    isAffiliate(custom_url, wallet_address) {
        var params = {
            custom_url: custom_url,
            wallet_address: wallet_address
        };
        return this.getRequest(`/external/is-affiliate`, params);
    }
    affiliateLink(custom_url, wallet_address) {
        var params = {
            custom_url: custom_url,
            wallet_address: wallet_address
        };
        return this.getRequest(`/external/affiliate`, params);
    }
    //doesn't require api key
    isOnAllowlist(wallet_address, custom_url) {
        var params = {
            wallet_address: wallet_address,
            custom_url: custom_url,
        };
        return this.getRequest(`/external/is-on-allow-list`, params);
    }
    getAllowlist(custom_url, page, page_size) {
        var params = {
            custom_url: custom_url,
            page: page,
            page_size: page_size,
        };
        return this.getRequest(`/external/allow-list`, params);
    }
}
exports.Project = Project;
