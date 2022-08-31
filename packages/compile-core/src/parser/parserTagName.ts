import { ParserError } from "./error";

export function parserTagName(text: string, current: number) {
  let char = text[current];
  function setCurrent(_current: number) {
    current = _current;
    char = text[current];
  }

  const start = current;
  while (true) {
    if (!(current < text.length)) {
      throw new ParserError(current, "意外结束");
    }
    if (char === " " || char === "/" || char === ">") {
      break;
    }

    setCurrent(current + 1);
  }
  const tag = text.slice(start, current);

  const NAME = /[a-z,A-Z,\-]*/;
  if (!NAME.test(tag)) {
    throw new ParserError(current, "名称不符合规范");
  }

  return { char, current, type: tag };
}
