import { Base, Config } from "../base";
export declare class NFT extends Base {
    constructor(config: Config);
    logView(custom_url: string, link_id?: string): Promise<string | null>;
    logReferral(custom_url: string, wallet_address: string, link_id?: string, email?: string, phone?: string, twitter?: string, discord?: string): Promise<{
        referral_link: string;
        referral_id: string;
    }>;
    isAffiliate(custom_url: string, wallet_address: string): Promise<boolean>;
    affiliateLink(custom_url: string, wallet_address: string): Promise<{
        referral_link: string;
        referral_id: string;
    }>;
}
