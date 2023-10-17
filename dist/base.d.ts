import { BaseURLOptions } from "./index";
export declare type Config = {
    apiKey: string;
    baseUrlOption?: BaseURLOptions;
};
export declare abstract class Base {
    private apiKey;
    baseUrl: string;
    sessionID: string;
    constructor(config: Config);
    protected fingerprint(): Promise<any>;
    protected fullFingerprint(): Promise<any>;
    protected getUrlParam(paramName: string): string | null;
    protected getAllUrlParams(): {
        key: string;
        value: string;
    }[];
    protected getRequest<T>(endpoint: string, options?: any): Promise<T>;
    protected postRequest<T>(endpoint: string, options?: any): Promise<T>;
    protected onSessionCreated<T>(params?: any): Promise<T>;
}
