
import { Prim } from "atoms";
import { encode } from "encode";
import * as _ from "lodash";

export class Tag {
  private namespace: string;
  private name: string[];

  constructor(...args: string[]) {
    let namespace = arguments[0];
    let name = (2 <= args.length) ? _.slice(args, 1) : [];
    this.namespace = namespace;
    this.name = name;
    if (arguments.length === 1) {
      let _ref = args[0].split('/')
      this.namespace = _ref[0];
      this.name = (2 <= _ref.length) ? _.slice(_ref, 1) : [];
    }
  }
  ns(): string {
    return this.namespace;
  };

  dn(): string {
    return [this.namespace].concat(this.name).join('/');
  };
}

export class Tagged extends Prim {
  private _tag: any;
  private _obj: any;

  constructor(_tag: any, _obj: any) {
    super();
    this._tag = _tag;
    this._obj = _obj;
  }

  jsEncode(): any {
    return {
      tag: this.tag().dn(),
      value: this.obj().jsEncode()
    };
  };

  ednEncode(): string {
    return `\#${this.tag().dn()} ${encode(this.obj())})`;
  };

  jsonEncode() {
    return {
      Tagged: [this.tag().dn(), this.obj().jsonEncode != null ? this.obj().jsonEncode() : this.obj()]
    };
  };

  tag() {
    return this._tag;
  };

  obj() {
    return this._obj;
  };

  walk(iter: any): Tagged {
    return new Tagged(this._tag, (typeof this._obj.walk === "function") ? this._obj.walk(iter) : iter(this._obj));
  };
}

export interface Action {
  (obj: any): any;
}
export interface TaggedAction {
  tag: Tag;
  action: Action;
}
export const tagActions: { [key: string]: TaggedAction } = {
  uuid: {
    tag: new Tag("uuid"),
    action: (obj: any): any => {
      return obj;
    }
  },
  inst: {
    tag: new Tag("inst"),
    action: (obj: any) => {
      return new Date(Date.parse(obj));
    }
  }
};

