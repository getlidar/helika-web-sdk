export declare abstract class Base {
    private apiKey;
    baseUrl: string;
    sessionID: string;
    constructor(apiKey: string);
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
