import { BaseURLOptions } from "./index";
export declare type Config = {
    apiKey: string;
    baseUrlOption?: BaseURLOptions;
};
export declare abstract class Base {
    private apiKey;
    baseUrl: string;
    constructor(config: Config);
    protected getRequest<T>(endpoint: string, options?: any): Promise<T>;
    protected postRequest<T>(endpoint: string, options?: any): Promise<T>;
}
