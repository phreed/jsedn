define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var memo = {};
    function memo(klass) {
        if (memo[klass])
            (function () {
                var memo;
                module.exports = memo = function (klass) {
                    return function (val) {
                        if (memo[klass][val] == null) {
                            memo[klass][val] = new klass(val);
                        }
                        return memo[klass][val];
                    };
                };
            }).call(this);
    }
    exports.memo = memo;
});
//# sourceMappingURL=memo.js.map