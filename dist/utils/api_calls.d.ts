export interface AnnonResponseType {
    status: boolean;
    data?: {
        file: {
            url: {
                full: string;
                short: string;
            };
            metadata: {
                id: string;
                name: string;
                size: {
                    bytes: number;
                    readable: string;
                };
            };
        };
    };
}
export interface OptionsAnnonFiles {
    file: string;
    key: string | null;
}
export declare class AnnonfilesAPIHandler {
    endpoint: string;
    client: string;
    constructor();
    upload(options: OptionsAnnonFiles): PromiseLike<AnnonResponseType>;
    getInfo(id: string): PromiseLike<AnnonResponseType>;
    download(id: string): PromiseLike<string>;
}
