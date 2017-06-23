import * as _ from "lodash";
export declare class Prim {
    protected val: any;
    constructor(val?: any);
    value(): any;
    toString(): string;
}
export declare class BigInt extends Prim {
    constructor(val: any);
    ednEncode(): any;
    jsEncode(): any;
    jsonEncode(): {
        BigInt: any;
    };
}
export declare class StringObj extends Prim {
    constructor(val: string);
    toString(): string;
    is(test: string): boolean;
}
export declare const charMap: {
    [key: string]: string;
};
export declare class Char extends StringObj {
    constructor(val: string);
    ednEncode(): string;
    jsEncode(): any;
    jsonEncode(): {
        Char: any;
    };
}
export declare class Discard {
    constructor();
}
export declare class Symbol extends Prim {
    private ns;
    private name;
    constructor(...val: any[]);
    valid(word: string): boolean;
    toString(): string;
    ednEncode(): any;
    jsEncode(): any;
    jsonEncode(): any;
}
export declare class Keyword extends Symbol {
    constructor(val: string);
    jsonEncode(): any;
}
export declare const char: typeof Char & _.MemoizedFunction;
export declare const kw: typeof Keyword & _.MemoizedFunction;
export declare const sym: typeof Symbol & _.MemoizedFunction;
export declare const bigInt: typeof BigInt & _.MemoizedFunction;
