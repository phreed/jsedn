define(["require", "exports", "atoms", "tags", "encode", "tokens", "lodash", "atPath", "unify"], function (require, exports, atoms_1, tags_1, encode_1, tokens_1, _, atPath_1, unify_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Symbol = atoms_1.Symbol;
    exports.Keyword = atoms_1.Keyword;
    exports.Char = atoms_1.Char;
    exports.BigInt = atoms_1.BigInt;
    exports.Tag = tags_1.Tag;
    exports.Tagged = tags_1.Tagged;
    exports.encode = encode_1.encode;
    exports.encodeJson = encode_1.encodeJson;
    exports.atPath = atPath_1.atPath;
    exports.unify = unify_1.parse;
    const typeClasses = {
        Map: Map,
        List: Array,
        Vector: Array,
        Set: Set,
        Discard: atoms_1.Discard,
        Tag: tags_1.Tag,
        Tagged: tags_1.Tagged,
        StringObj: atoms_1.StringObj
    };
    const parens = '()[]{}';
    const specialChars = parens + ' \t\n\r,';
    const escapeChar = '\\';
    const parenTypes = {
        '(': {
            closing: ')',
            "class": "List"
        },
        '[': {
            closing: ']',
            "class": "Vector"
        },
        '{': {
            closing: '}',
            "class": "Map"
        }
    };
    function lex(str) {
        let list = [];
        let lines = [];
        let line = 1;
        let token = '';
        let in_string;
        let escaping;
        let in_comment;
        for (let ix = 0, len = str.length; ix < len; ix++) {
            let c = str[ix];
            if (c === "\n" || c === "\r") {
                line++;
            }
            if ((typeof in_string === "undefined" || in_string === null) && c === ";" && (typeof escaping === "undefined" || escaping === null)) {
                in_comment = true;
            }
            if (in_comment) {
                if (c === "\n") {
                    in_comment = void 0;
                    if (token) {
                        list.push(token);
                        lines.push(line);
                        token = '';
                    }
                }
                continue;
            }
            if (c === '"' && (typeof escaping === "undefined" || escaping === null)) {
                if (typeof in_string !== "undefined" && in_string !== null) {
                    list.push(new atoms_1.StringObj(in_string));
                    lines.push(line);
                    in_string = void 0;
                }
                else {
                    in_string = '';
                }
                continue;
            }
            if (in_string != null) {
                if (c === escapeChar && (typeof escaping === "undefined" || escaping === null)) {
                    escaping = true;
                    continue;
                }
                if (escaping != null) {
                    escaping = void 0;
                    if (c === "t" || c === "n" || c === "f" || c === "r") {
                        in_string += escapeChar;
                    }
                }
                in_string += c;
            }
            else if (_.indexOf(specialChars, c) >= 0 && (escaping == null)) {
                if (token) {
                    list.push(token);
                    lines.push(line);
                    token = '';
                }
                if (_.indexOf(parens, c) >= 0) {
                    list.push(c);
                    lines.push(line);
                }
            }
            else {
                if (escaping) {
                    escaping = void 0;
                }
                else if (c === escapeChar) {
                    escaping = true;
                }
                if (token === "#_") {
                    list.push(token);
                    lines.push(line);
                    token = '';
                }
                token += c;
            }
        }
        if (token) {
            list.push(token);
            lines.push(line);
        }
        return {
            tokens: list,
            tokenLines: lines
        };
    }
    exports.lex = lex;
    ;
    function read(ast) {
        let tokens = ast.tokens;
        let tokenLines = ast.tokenLines;
        let result;
        let token1;
        let read_ahead = (token, tokenIndex, expectSet) => {
            var L, closeParen, handledToken, paren, tagged;
            if (tokenIndex == null) {
                tokenIndex = 0;
            }
            if (expectSet == null) {
                expectSet = false;
            }
            if (token === void 0) {
                return;
            }
            if ((!(token instanceof atoms_1.StringObj)) && (paren = parenTypes[token])) {
                closeParen = paren.closing;
                L = [];
                while (true) {
                    token = tokens.shift();
                    if (token === void 0) {
                        throw "unexpected end of list at line " + tokenLines[tokenIndex];
                    }
                    tokenIndex++;
                    if (token === paren.closing) {
                        return new typeClasses[expectSet ? "Set" : paren["class"]](L);
                    }
                    else {
                        L.push(read_ahead(token, tokenIndex));
                    }
                }
            }
            else if (_.indexOf(")]}", token) >= 0) {
                throw "unexpected " + token + " at line " + tokenLines[tokenIndex];
            }
            else {
                handledToken = tokens_1.handleToken(token);
                if (handledToken instanceof tags_1.Tag) {
                    token = tokens.shift();
                    tokenIndex++;
                    if (token === void 0) {
                        throw "was expecting something to follow a tag at line " + tokenLines[tokenIndex];
                    }
                    tagged = new typeClasses.Tagged(handledToken, read_ahead(token, tokenIndex, handledToken.dn() === ""));
                    if (handledToken.dn() === "") {
                        if (tagged.obj() instanceof typeClasses.Set) {
                            return tagged.obj();
                        }
                        else {
                            throw "Exepected a set but did not get one at line " + tokenLines[tokenIndex];
                        }
                    }
                    if (tagged.tag().dn() === "_") {
                        return new typeClasses.Discard;
                    }
                    if (tags_1.tagActions[tagged.tag().dn()] != null) {
                        return tags_1.tagActions[tagged.tag().dn()].action(tagged.obj());
                    }
                    return tagged;
                }
                else {
                    return handledToken;
                }
            }
        };
        token1 = tokens.shift();
        if (token1 === void 0) {
            return void 0;
        }
        else {
            result = read_ahead(token1);
            if (result instanceof typeClasses.Discard) {
                return "";
            }
            return result;
        }
    }
    exports.read = read;
    function parse(str) {
        return read(lex(str));
    }
    exports.parse = parse;
    ;
    function setTagAction(tag, action) {
        return tags_1.tagActions[tag.dn()] = {
            tag: tag,
            action: action
        };
    }
    exports.setTagAction = setTagAction;
    function setTokenHandler(handlerName, pattern, action) {
        return tokens_1.tokenHandlers[handlerName] = {
            pattern: pattern,
            action: action
        };
    }
    exports.setTokenHandler = setTokenHandler;
    function setTokenPattern(handlerName, pattern) {
        return tokens_1.tokenHandlers[handlerName].pattern = pattern;
    }
    exports.setTokenPattern = setTokenPattern;
    function setTokenAction(handlerName, action) {
        return tokens_1.tokenHandlers[handlerName].action = action;
    }
    exports.setTokenAction = setTokenAction;
    function setEncodeHandler(handlerName, test, action) {
        return encode_1.encodeHandlers[handlerName] = {
            test: test,
            action: action
        };
    }
    exports.setEncodeHandler = setEncodeHandler;
    function setEncodeTest(typeName, test) {
        return encode_1.encodeHandlers[typeName].test = test;
    }
    exports.setEncodeTest = setEncodeTest;
    function setEncodeAction(typeName, action) {
        return encode_1.encodeHandlers[typeName].action = action;
    }
    exports.setEncodeAction = setEncodeAction;
    function toJS(obj) {
        if ((obj != null ? obj.jsEncode : void 0) != null) {
            return obj.jsEncode();
        }
        else {
            return obj;
        }
    }
    exports.toJS = toJS;
});
//# sourceMappingURL=reader.js.map