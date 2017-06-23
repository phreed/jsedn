define(["require", "exports", "tokens"], function (require, exports, tokens_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.encodeHandlers = {
        array: {
            test: (obj) => {
                return (obj instanceof Array);
            },
            action: (obj) => {
                let v;
                return "[" + (((() => {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = obj.length; _i < _len; _i++) {
                        v = obj[_i];
                        _results.push(encode(v));
                    }
                    return _results;
                })()).join(" ")) + "]";
            }
        },
        integer: {
            test: (obj) => {
                if (typeof obj !== "number") {
                    return false;
                }
                if (!tokens_1.tokenHandlers.integer.pattern.test(`${obj}`)) {
                    return false;
                }
                return true;
            },
            action: (obj) => {
                return parseInt(obj);
            }
        },
        float: {
            test: (obj) => {
                if (typeof obj !== "number") {
                    return false;
                }
                if (!tokens_1.tokenHandlers.float.pattern.test(`${obj}`)) {
                    return false;
                }
                return true;
            },
            action: (obj) => {
                return parseFloat(obj);
            }
        },
        string: {
            test: (obj) => {
                return (typeof obj === "string");
            },
            action: (obj) => {
                return "\"" + (obj.toString().replace(/"|\\/g, '\\$&')) + "\"";
            }
        },
        boolean: {
            test: (obj) => {
                return (typeof obj === "boolean");
            },
            action: (obj) => {
                if (obj) {
                    return "true";
                }
                else {
                    return "false";
                }
            }
        },
        "null": {
            test: (obj) => {
                return (obj === null);
            },
            action: (_obj) => {
                return "nil";
            }
        },
        date: {
            test: (_obj) => {
                return true; // (typeof obj === "date");
            },
            action: (obj) => {
                return "#inst \"" + (obj.toISOString()) + "\"";
            }
        },
        object: {
            test: (obj) => {
                return (typeof obj === "object");
            },
            action: (obj) => {
                var k, result, v;
                result = [];
                for (k in obj) {
                    v = obj[k];
                    result.push(encode(k));
                    result.push(encode(v));
                }
                return "{" + (result.join(" ")) + "}";
            }
        }
    };
    function encode(obj) {
        if ((obj != null ? obj.ednEncode : void 0) != null) {
            return obj.ednEncode();
        }
        for (let handlerName of Object.getOwnPropertyNames(exports.encodeHandlers)) {
            let handler = exports.encodeHandlers[handlerName];
            if (handler.test(obj)) {
                return handler.action(obj);
            }
        }
        throw "unhandled encoding for " + (JSON.stringify(obj));
    }
    exports.encode = encode;
    ;
    function encodeJson(obj, prettyPrint) {
        if (obj.jsonEncode != null) {
            return encodeJson(obj.jsonEncode(), prettyPrint);
        }
        if (prettyPrint) {
            return JSON.stringify(obj, null, 4);
        }
        else {
            return JSON.stringify(obj);
        }
    }
    exports.encodeJson = encodeJson;
    ;
});
//# sourceMappingURL=encode.js.map