define(["require", "exports", "atoms"], function (require, exports, atoms_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function atPath(obj, path) {
        path = path.trim().replace(/[ ]{2,}/g, ' ').split(' ');
        let value = obj;
        var part;
        for (let ix = 0, len = path.length; ix < len; ix++) {
            part = path[ix];
            if (part[0] === ":") {
                part = new atoms_1.Keyword(part);
            }
            if (!value.exists) {
                throw "Not a composite object";
            }
            if (value.exists(part) != null) {
                value = value.at(part);
            }
            else {
                throw "Could not find " + part;
            }
        }
        return value;
    }
    exports.atPath = atPath;
    ;
});
//# sourceMappingURL=atPath.js.map