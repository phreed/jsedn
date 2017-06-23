import { Prim } from "atoms";
export declare class Tag {
    private namespace;
    private name;
    constructor(...args: string[]);
    ns(): string;
    dn(): string;
}
export declare class Tagged extends Prim {
    private _tag;
    private _obj;
    constructor(_tag: any, _obj: any);
    jsEncode(): any;
    ednEncode(): string;
    jsonEncode(): {
        Tagged: any[];
    };
    tag(): any;
    obj(): any;
    walk(iter: any): Tagged;
}
export interface Action {
    (obj: any): any;
}
export interface TaggedAction {
    tag: Tag;
    action: Action;
}
export declare const tagActions: {
    [key: string]: TaggedAction;
};
