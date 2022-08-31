import { HTMLElementAst } from "../ast";
import { ParserError } from "./error";
import { parserProps } from "./parserProps";
import { parserTagName } from "./parserTagName";

export function parserInTag(
  push: () => void,
  char: string,
  current: number,
  text: string,
  getParentAst: () => HTMLElementAst,
  clearMatchPrefix: () => void,
  setCurrent: (_current: number) => void,
  pop: () => void
) {
  push();

  ({ char, current } = setupHTMLAstType(char, current, text, getParentAst()));

  ({ char, current } = setupHTMLAstProps(current, char, text, getParentAst()));

  clearMatchPrefix();

  jumpOutOfLabel(char, setCurrent, current, text, pop);
}

export function isThePrefixOfTag(matchPrefix: string, current: number = 0) {
  if (matchPrefix.length >= 2 && matchPrefix[0] === "<") {
    if (matchPrefix[1] === "/") {
      return false;
    }
    if (/[a-z,A-Z]/.test(matchPrefix[1])) {
      return true;
    }
    throw new ParserError(current, `${matchPrefix[1]} 不符合语法`);
  } else {
    return false;
  }
}

/**
 *  跳到标签之外
 * @param char
 * @param setCurrent
 * @param current
 * @param text
 * @param pop
 * @returns
 */
export function jumpOutOfLabel(
  char: string,
  setCurrent: (_current: number) => void,
  current: number,
  text: string,
  pop: () => void
) {
  if (char === ">") {
    setCurrent(current + 1);
    return;
  }
  if (text.slice(current, current + 2) == "/>") {
    pop();
    setCurrent(current + 2);
    return;
  }
  if (char === "/") {
    throw new ParserError(current, "'/'后面所期待的字符'>'");
  }
  throw new ParserError(current, `意外的符号${char}`);
}

/**
 * 设置props
 *
 * @param {number} current
 * @param {string} char
 * @param {string} text
 * @param {HTMLElementAst} parentAst
 * @return {*}
 */
export function setupHTMLAstProps(
  current: number,
  char: string,
  text: string,
  parentAst: HTMLElementAst
) {
  let props;
  ({ current, char, props } = parserProps(text, current));
  parentAst.props = props;
  return { char, current };
}

/**
 * 设置type
 * @param char
 * @param current
 * @param text
 * @param parentAst
 * @returns
 */
export function setupHTMLAstType(
  char: string,
  current: number,
  text: string,
  parentAst: HTMLElementAst
) {
  let type;
  // <div >
  //  ^
  ({ char, current, type } = parserTagName(text, current));
  // <div >
  //     ^
  parentAst.tag = type;
  return { char, current, type };
}
