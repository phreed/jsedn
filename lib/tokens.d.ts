export declare function handleToken(token: any): any;
export interface Handler {
    pattern: RegExp;
    action: (token: any) => string;
}
export declare const tokenHandlers: {
    [key: string]: Handler;
};
