
import { StringObj, Symbol, Keyword, Char, BigInt } from "atoms";

import { Tag } from "tags";

export function handleToken(token: any): any {
  var handler, name;
  if (token instanceof StringObj) {
    return token.toString();
  }
  for (name in tokenHandlers) {
    handler = tokenHandlers[name];
    if (handler.pattern.test(token)) {
      return handler.action(token);
    }
  }
  return new Symbol(token);
};

export interface Handler {
  pattern: RegExp;
  action: (token: any) => string;
}

export const tokenHandlers: { [key: string]: Handler } = {
  nil: {
    pattern: /^nil$/,
    action: (_token: any): any => {
      return null;
    }
  },
  boolean: {
    pattern: /^true$|^false$/,
    action: (token: any): any => {
      return token === "true";
    }
  },
  keyword: {
    pattern: /^[\:].*$/,
    action: (token: any): any => {
      return new Keyword(token);
    }
  },
  char: {
    pattern: /^\\.*$/,
    action: (token: any): any => {
      return new Char(token.slice(1));
    }
  },
  integer: {
    pattern: /^[\-\+]?[0-9]+N?$/,
    action: (token: any): any => {
      if (/\d{15,}/.test(token)) {
        return new BigInt(token);
      }
      return parseInt(token === "-0" ? "0" : token);
    }
  },
  float: {
    pattern: /^[\-\+]?[0-9]+(\.[0-9]*)?([eE][-+]?[0-9]+)?M?$/,
    action: (token: any): any => {
      return parseFloat(token);
    }
  },
  tagged: {
    pattern: /^#.*$/,
    action: (token: any): any => {
      return new Tag(token.slice(1));
    }
  }
};
