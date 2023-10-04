import { Base, Config } from "../base";
export declare class UA extends Base {
    constructor(config: Config);
    logView(url: string, link_id?: string): Promise<string | null>;
    logReferral(url: string, wallet_address: string, link_id?: string, email?: string, phone?: string, twitter?: string, discord?: string): Promise<{
        referral_link: string;
        referral_id: string;
    }>;
    isAmbassador(url: string, wallet_address: string): Promise<boolean>;
    ambassadorLink(url: string, wallet_address: string): Promise<{
        referral_link: string;
        referral_id: string;
    }>;
}
