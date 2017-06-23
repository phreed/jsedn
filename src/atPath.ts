
import { Keyword } from "atoms";

export function atPath(obj: any, path: any) {

  path = path.trim().replace(/[ ]{2,}/g, ' ').split(' ');
  let value = obj;
  var part: any;
  for (let ix = 0, len = path.length; ix < len; ix++) {
    part = path[ix];
    if (part[0] === ":") {
      part = new Keyword(part);
    }
    if (!value.exists) {
      throw "Not a composite object";
    }
    if (value.exists(part) != null) {
      value = value.at(part);
    } else {
      throw "Could not find " + part;
    }
  }
  return value;
};
