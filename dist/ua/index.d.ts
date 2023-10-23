import { Base } from "../base";
import { UABaseURL } from "../index";
export declare class UA extends Base {
    constructor(apiKey: string, baseUrl: UABaseURL);
    logView(url?: string, link_id?: string): Promise<string | null>;
    logReferral(wallet_address: string, url?: string, link_id?: string, email?: string, phone?: string, twitter?: string, discord?: string): Promise<{
        referral_link: string;
        referral_id: string;
    }>;
    isAmbassador(url: string, wallet_address: string): Promise<boolean>;
    ambassadorLink(url: string, wallet_address: string): Promise<{
        referral_link: string;
        referral_id: string;
    }>;
}
