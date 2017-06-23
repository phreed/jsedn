define(["require", "exports", "atoms", "encode", "lodash"], function (require, exports, atoms_1, encode_1, _) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Tag {
        constructor(...args) {
            let namespace = arguments[0];
            let name = (2 <= args.length) ? _.slice(args, 1) : [];
            this.namespace = namespace;
            this.name = name;
            if (arguments.length === 1) {
                let _ref = args[0].split('/');
                this.namespace = _ref[0];
                this.name = (2 <= _ref.length) ? _.slice(_ref, 1) : [];
            }
        }
        ns() {
            return this.namespace;
        }
        ;
        dn() {
            return [this.namespace].concat(this.name).join('/');
        }
        ;
    }
    exports.Tag = Tag;
    class Tagged extends atoms_1.Prim {
        constructor(_tag, _obj) {
            super();
            this._tag = _tag;
            this._obj = _obj;
        }
        jsEncode() {
            return {
                tag: this.tag().dn(),
                value: this.obj().jsEncode()
            };
        }
        ;
        ednEncode() {
            return `\#${this.tag().dn()} ${encode_1.encode(this.obj())})`;
        }
        ;
        jsonEncode() {
            return {
                Tagged: [this.tag().dn(), this.obj().jsonEncode != null ? this.obj().jsonEncode() : this.obj()]
            };
        }
        ;
        tag() {
            return this._tag;
        }
        ;
        obj() {
            return this._obj;
        }
        ;
        walk(iter) {
            return new Tagged(this._tag, (typeof this._obj.walk === "function") ? this._obj.walk(iter) : iter(this._obj));
        }
        ;
    }
    exports.Tagged = Tagged;
    exports.tagActions = {
        uuid: {
            tag: new Tag("uuid"),
            action: (obj) => {
                return obj;
            }
        },
        inst: {
            tag: new Tag("inst"),
            action: (obj) => {
                return new Date(Date.parse(obj));
            }
        }
    };
});
//# sourceMappingURL=tags.js.map