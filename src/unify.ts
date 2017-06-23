
import { Symbol, Keyword } from "atoms";
import { Pair } from "collections";

export function parse(data: any, values?: any, tokenStart?: any) {
  if (tokenStart == null) {
    tokenStart = "?";
  }
  if (typeof data === "string") {
    data = parse(data);
  }
  if (typeof values === "string") {
    values = parse(values);
  }
  let valExists = (v: any) => {
    if (values instanceof Map) {
      if (values.has(v)) {
        return values.get(v);
      } else if (values.has(new Symbol(v))) {
        return values.get(new Symbol(v));
      } else if (values.has(new Keyword(":" + v))) {
        return values.get(new Keyword(":" + v));
      }
    } else {
      return values[v];
    }
  };
  let unifyToken = (t: any) => {
    if (!(t instanceof Symbol)) { return t; }
    if (`${t}`[0] !== tokenStart) { return t; }
    let val = valExists(("" + t).slice(1));
    if (val == null) { return t; }
    return val;
  };
  
  return data.walk((v: any, k: any): Pair => {
    if (k != null) {
      return [unifyToken(k), unifyToken(v)];
    } else {
      return unifyToken(v);
    }
  });
}