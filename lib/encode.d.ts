export interface Handler {
    test: (obj: any) => boolean;
    action: (obj: any) => any;
}
export declare const encodeHandlers: {
    [key: string]: Handler;
};
export declare function encode(obj: any): any;
export declare function encodeJson(obj: any, prettyPrint: any): string;
