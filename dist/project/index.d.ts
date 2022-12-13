import { Base } from "../base";
export declare class Project extends Base {
    logView(custom_url: string, link_id?: string): Promise<{
        referral_link: string;
        referral_id: string;
    }>;
    logReferral(custom_url: string, wallet_address: string, link_id?: string, email?: string, phone?: string, twitter?: string, discord?: string): Promise<{
        referral_link: string;
        referral_id: string;
    }>;
    isAffiliate(custom_url: string, wallet_address: string): Promise<boolean>;
    affiliateLink(custom_url: string, wallet_address: string): Promise<{
        referral_link: string;
        referral_id: string;
    }>;
    isOnAllowlist(wallet_address: string, custom_url: string): Promise<boolean>;
    getAllowlist(custom_url: string, page: number, page_size: number): Promise<boolean>;
}
