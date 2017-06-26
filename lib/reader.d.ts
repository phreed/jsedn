import { Symbol, Keyword, StringObj, Char, BigInt } from "atoms";
import { Tag, Tagged, Action } from "tags";
import { encode, encodeJson } from "encode";
import { atPath } from "atPath";
import { parse as unify } from "unify";
export { atPath, unify, encode, encodeJson };
export { Char, Symbol, Keyword, BigInt, Tag, Tagged };
export declare function lex(str: string): {
    tokens: (string | StringObj)[];
    tokenLines: number[];
};
export interface Ast {
    tokens: any[];
    tokenLines: any;
}
export declare function read(ast: Ast): any;
export declare function parse(str: string): any;
export declare function setTagAction(tag: any, action: Action): {
    tag: any;
    action: Action;
};
export declare function setTokenHandler(handlerName: string, pattern: RegExp, action: Action): {
    pattern: RegExp;
    action: Action;
};
export declare function setTokenPattern(handlerName: string, pattern: RegExp): RegExp;
export declare function setTokenAction(handlerName: string, action: Action): Action;
export declare function setEncodeHandler(handlerName: string, test: any, action: Action): {
    test: any;
    action: Action;
};
export declare function setEncodeTest(typeName: string, test: any): any;
export declare function setEncodeAction(typeName: string, action: Action): Action;
export declare function toJS(obj: any): any;
