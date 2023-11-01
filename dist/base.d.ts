import { DisableDataSettings } from "./index";
export declare abstract class Base {
    private apiKey;
    protected baseUrl: string;
    protected sessionID: string | null;
    protected sessionExpiry: any;
    protected disabledDataSettings: DisableDataSettings;
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
    protected sessionCreate<T>(params?: any): Promise<{
        message: string;
    }>;
    protected addHours(date: Date, hours: number): string;
    protected extendSession(): void;
    setDataSettings(settings: DisableDataSettings): void;
}
