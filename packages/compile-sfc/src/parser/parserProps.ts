import { ParserError } from "./index";

export function parserProps(text: string, current: number) {
  let char = text[current];
  function setCurrent(_current: number) {
    current = _current;
    char = text[current];
  }
  const props: Record<string, string> = {};
  while (current < text.length) {
    if (char === " ") {
      setCurrent(current + 1);
      continue;
    }
    // 属性名
    const PROPS_KEY = /[a-z,A-Z,\-,\:,\$]/;
    if (PROPS_KEY.test(char)) {
      let key = "";
      while (current < text.length && PROPS_KEY.test(char)) {
        key += char;
        setCurrent(current + 1);
      }
      if (char === " ") {
        props[key] = "true";
        continue;
      }

      //遇到属性结束标签
      // <div xxx>
      //         ^
      if (char === ">" || char === "/") {
        props[key] = "true";
        return { char, current, props };
      }

      // xxx=" "
      //    ^
      if (text.slice(current, current + 2) !== '="') {
        throw new ParserError(current, "期待的字符'='");
      }

      setCurrent(current + 2);

      // xxx=""
      //      ^
      // xxx="xxx"
      //      ^
      //开始位置
      const start = current;
      while (true) {
        if (!(current < text.length)) {
          throw new ParserError(current - 1, "期待的字符'\"'");
        }
        //当遇到 '"' 后终止
        if (char === '"') {
          break;
        }
        setCurrent(current + 1);
      }

      let value = text.slice(start, current);
      props[key] = value;

      setCurrent(current + 1);
      continue;
    }

    //遇到属性结束标签
    // <div xxx>
    //         ^
    if (char === ">" || char === "/") {
      return { char, current, props };
    }

    throw new ParserError(current, "未知情况");

    setCurrent(current + 1);
  }

  return { char, current, props };
}
