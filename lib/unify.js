define(["require", "exports", "atoms"], function (require, exports, atoms_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function parse(data, values, tokenStart) {
        if (tokenStart == null) {
            tokenStart = "?";
        }
        if (typeof data === "string") {
            data = parse(data);
        }
        if (typeof values === "string") {
            values = parse(values);
        }
        let valExists = (v) => {
            if (values instanceof Map) {
                if (values.has(v)) {
                    return values.get(v);
                }
                else if (values.has(new atoms_1.Symbol(v))) {
                    return values.get(new atoms_1.Symbol(v));
                }
                else if (values.has(new atoms_1.Keyword(":" + v))) {
                    return values.get(new atoms_1.Keyword(":" + v));
                }
            }
            else {
                return values[v];
            }
        };
        let unifyToken = (t) => {
            if (!(t instanceof atoms_1.Symbol)) {
                return t;
            }
            if (`${t}`[0] !== tokenStart) {
                return t;
            }
            let val = valExists(("" + t).slice(1));
            if (val == null) {
                return t;
            }
            return val;
        };
        return data.walk((v, k) => {
            if (k != null) {
                return [unifyToken(k), unifyToken(v)];
            }
            else {
                return unifyToken(v);
            }
        });
    }
    exports.parse = parse;
});
//# sourceMappingURL=unify.js.map