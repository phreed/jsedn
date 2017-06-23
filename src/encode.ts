
import { tokenHandlers } from "tokens";

export interface Handler {
  test: (obj: any) => boolean; 
  action: (obj: any) => any;
}

export const encodeHandlers: { [key: string]: Handler } = {
  array: {
    test: (obj: any): boolean => {
      return (obj instanceof Array);
    },
    action: (obj: any): any => {
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
    test: (obj: any): boolean => {
      if (typeof obj !== "number") { return false; }
      if (! tokenHandlers.integer.pattern.test(`${obj}`)) { return false; }
      return true;
    },
    action: (obj: any): any => {
      return parseInt(obj);
    }
  },
  float: {
    test: (obj: any): boolean => {
      if (typeof obj !== "number") { return false; }
      if (! tokenHandlers.float.pattern.test(`${obj}`)) { return false; }
      return true;
    },
    action: (obj: any): any => {
      return parseFloat(obj);
    }
  },
  string: {
    test: (obj: any): boolean => {
      return (typeof obj === "string");
    },
    action: (obj: any): any => {
      return "\"" + (obj.toString().replace(/"|\\/g, '\\$&')) + "\"";
    }
  },
  boolean: {
    test: (obj: any): boolean => {
      return (typeof obj === "boolean");
    },
    action: (obj: any): string => {
      if (obj) {
        return "true";
      } else {
        return "false";
      }
    }
  },
  "null": {
    test: (obj: any): boolean => {
      return (obj === null);
    },
    action: (_obj: any): string => {
      return "nil";
    }
  },
  date: {
    test: (_obj: any): boolean => {
      return true; // (typeof obj === "date");
    },
    action: (obj: any): any => {
      return "#inst \"" + (obj.toISOString()) + "\"";
    }
  },
  object: {
    test: (obj: any): boolean => {
      return (typeof obj === "object");
    },
    action: (obj: any): any => {
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

export function encode(obj: any) {
  if ((obj != null ? obj.ednEncode : void 0) != null) {
    return obj.ednEncode();
  }
  for (let handlerName of Object.getOwnPropertyNames(encodeHandlers)) {
    let handler = encodeHandlers[handlerName];
    if (handler.test(obj)) {
      return handler.action(obj);
    }
  }
  throw "unhandled encoding for " + (JSON.stringify(obj));
};

export function encodeJson(obj: any, prettyPrint: any): string {
  if (obj.jsonEncode != null) {
    return encodeJson(obj.jsonEncode(), prettyPrint);
  }
  if (prettyPrint) {
    return JSON.stringify(obj, null, 4);
  } else {
    return JSON.stringify(obj);
  }
};
