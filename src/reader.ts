
import { Symbol, Keyword, StringObj, Char, Discard, BigInt } from "atoms";
import { LinkedList as List, Stack as Vector, Set, Dictionary as Map } from "typescript-collections";
import { Tag, Tagged, tagActions, Action } from "tags";
import { encodeHandlers, encode, encodeJson } from "encode";
import { handleToken, tokenHandlers } from "tokens";
import * as _ from "lodash";

import { atPath } from "atPath";
import { parse as unify } from "unify";

export { atPath, unify, encode, encodeJson };
export { Char, Symbol, Keyword, BigInt, List, Vector, Map, Set, Tag, Tagged };

const typeClasses: { [key: string]: any } = {
  Map: Map,
  List: List,
  Vector: Vector,
  Set: Set,
  Discard: Discard,
  Tag: Tag,
  Tagged: Tagged,
  StringObj: StringObj
};

const parens = '()[]{}';
const specialChars = parens + ' \t\n\r,';
const escapeChar = '\\';

interface ParenType {
  "closing": string;
  "class": string;
}
const parenTypes: { [key: string]: ParenType } = {
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

export function lex(str: string) {
  let list = [];
  let lines = [];
  let line = 1;
  let token = '';
  let in_string: any;
  let escaping: any;
  let in_comment: any;
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
        list.push(new StringObj(in_string));
        lines.push(line);
        in_string = void 0;
      } else {
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
    } else if (_.indexOf(specialChars, c) >= 0 && (escaping == null)) {
      if (token) {
        list.push(token);
        lines.push(line);
        token = '';
      }
      if (_.indexOf(parens, c) >= 0) {
        list.push(c);
        lines.push(line);
      }
    } else {
      if (escaping) {
        escaping = void 0;
      } else if (c === escapeChar) {
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
};

export interface Ast {
  tokens: any[];
  tokenLines: any;
}
export function read(ast: Ast) {
  let tokens = ast.tokens;
  let tokenLines = ast.tokenLines;

  let result: any;
  let token1: any;
  let read_ahead = (token: any, tokenIndex?: number, expectSet?: any): any => {
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
    if ((!(token instanceof StringObj)) && (paren = parenTypes[token])) {
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
        } else {
          L.push(read_ahead(token, tokenIndex));
        }
      }
    } else if (_.indexOf(")]}", token) >= 0) {
      throw "unexpected " + token + " at line " + tokenLines[tokenIndex];
    } else {
      handledToken = handleToken(token);
      if (handledToken instanceof Tag) {
        token = tokens.shift();
        tokenIndex++;
        if (token === void 0) {
          throw "was expecting something to follow a tag at line " + tokenLines[tokenIndex];
        }
        tagged = new typeClasses.Tagged(handledToken, read_ahead(token, tokenIndex, handledToken.dn() === ""));
        if (handledToken.dn() === "") {
          if (tagged.obj() instanceof typeClasses.Set) {
            return tagged.obj();
          } else {
            throw "Exepected a set but did not get one at line " + tokenLines[tokenIndex];
          }
        }
        if (tagged.tag().dn() === "_") {
          return new typeClasses.Discard;
        }
        if (tagActions[tagged.tag().dn()] != null) {
          return tagActions[tagged.tag().dn()].action(tagged.obj());
        }
        return tagged;
      } else {
        return handledToken;
      }
    }
  };
  token1 = tokens.shift();
  if (token1 === void 0) {
    return void 0;
  } else {
    result = read_ahead(token1);
    if (result instanceof typeClasses.Discard) {
      return "";
    }
    return result;
  }
}

export function parse(str: string): any {
  return read(lex(str));
};


export function setTagAction(tag: any, action: Action) {
  return tagActions[tag.dn()] = {
    tag: tag,
    action: action
  };
}
export function setTokenHandler(handlerName: string, pattern: RegExp, action: Action) {
  return tokenHandlers[handlerName] = {
    pattern: pattern,
    action: action
  };
}
export function setTokenPattern(handlerName: string, pattern: RegExp) {
  return tokenHandlers[handlerName].pattern = pattern;
}
export function setTokenAction(handlerName: string, action: Action) {
  return tokenHandlers[handlerName].action = action;
}
export function setEncodeHandler(handlerName: string, test: any, action: Action) {
  return encodeHandlers[handlerName] = {
    test: test,
    action: action
  };
}

export function setEncodeTest(typeName: string, test: any) {
  return encodeHandlers[typeName].test = test;
}

export function setEncodeAction(typeName: string, action: Action) {
  return encodeHandlers[typeName].action = action;
}
export function toJS(obj: any) {
  if ((obj != null ? obj.jsEncode : void 0) != null) {
    return obj.jsEncode();
  } else {
    return obj;
  }
}

