import { DisableDataSettings } from "./index";
export declare abstract class Base {
    private apiKey;
    protected baseUrl: string;
    protected gameId: string;
    protected sessionID: string | null;
    protected sessionExpiry: any;
    protected disabledDataSettings: DisableDataSettings;
    protected enabled: boolean;
    constructor(apiKey: string, gameId: string);
    isEnabled(): boolean;
    setEnabled(enabled: boolean): void;
    protected fingerprint(): Promise<any>;
    protected fullFingerprint(): Promise<any>;
    protected getUrlParam(paramName: string): string | null;
    protected getAllUrlParams(): {
        key: string;
        value: string;
    }[];
    protected getRequest<T>(endpoint: string, options?: any): Promise<T>;
    protected postRequest<T>(endpoint: string, options?: any): Promise<any>;
    protected sessionCreate<T>(params?: any): Promise<any>;
    protected addHours(date: Date, hours: number): string;
    protected addMinutes(date: Date, minutes: number): string;
    protected extendSession(): void;
    setDataSettings(settings: DisableDataSettings): void;
}
