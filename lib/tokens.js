define(["require", "exports", "atoms", "tags"], function (require, exports, atoms_1, tags_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function handleToken(token) {
        var handler, name;
        if (token instanceof atoms_1.StringObj) {
            return token.toString();
        }
        for (name in exports.tokenHandlers) {
            handler = exports.tokenHandlers[name];
            if (handler.pattern.test(token)) {
                return handler.action(token);
            }
        }
        return new atoms_1.Symbol(token);
    }
    exports.handleToken = handleToken;
    ;
    exports.tokenHandlers = {
        nil: {
            pattern: /^nil$/,
            action: (_token) => {
                return null;
            }
        },
        boolean: {
            pattern: /^true$|^false$/,
            action: (token) => {
                return token === "true";
            }
        },
        keyword: {
            pattern: /^[\:].*$/,
            action: (token) => {
                return new atoms_1.Keyword(token);
            }
        },
        char: {
            pattern: /^\\.*$/,
            action: (token) => {
                return new atoms_1.Char(token.slice(1));
            }
        },
        integer: {
            pattern: /^[\-\+]?[0-9]+N?$/,
            action: (token) => {
                if (/\d{15,}/.test(token)) {
                    return new atoms_1.BigInt(token);
                }
                return parseInt(token === "-0" ? "0" : token);
            }
        },
        float: {
            pattern: /^[\-\+]?[0-9]+(\.[0-9]*)?([eE][-+]?[0-9]+)?M?$/,
            action: (token) => {
                return parseFloat(token);
            }
        },
        tagged: {
            pattern: /^#.*$/,
            action: (token) => {
                return new tags_1.Tag(token.slice(1));
            }
        }
    };
});
//# sourceMappingURL=tokens.js.map