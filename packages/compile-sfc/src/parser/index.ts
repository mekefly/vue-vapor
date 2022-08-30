import { genStack } from "./genStack";
import { HTMLAst } from "./HTMLAst";
import { parserProps } from "./parserProps";
import { parserTagName } from "./parserTagName";

export type HTMLAstChildren = Array<HTMLAst | string>;
export function parser(text: string) {
  const {
    push,
    pop,
    getStackTop: getParentAst,
    getLength: getStackLength,
  } = genStack();

  //匹配前缀
  let matchPrefix = "";
  //当前位置
  let current = 0;
  //当前字符
  let char = text[current];

  while (current < text.length) {
    // 文本 例如：
    // 1. <div>char<div> matchPrefix = char
    // 2. <div><div></div>char<div> matchPrefix = char

    if (char === "<") {
      addStringAst(matchPrefix, getParentAst());
      matchPrefix = char;
      setCurrent(current + 1);
      continue;
    }
    matchPrefix += char;

    // 用于匹配 <[a-z] 这样的开始如果是 </ 将不会匹配成功,当匹配到 > 后结束匹配并进
    // 例如
    // 1. matchPrefix = <a; isThePrefixOfTag(matchPrefix) = true
    // 2. matchPrefix = </; isThePrefixOfTag(matchPrefix) = false
    if (isThePrefixOfTag(matchPrefix, current)) {
      push();

      ({ char, current } = setupHTMLAstType(
        char,
        current,
        text,
        getParentAst()
      ));

      ({ char, current } = setupHTMLAstProps(
        current,
        char,
        text,
        getParentAst()
      ));

      clearMatchPrefix();

      jumpOutOfLabel(char, setCurrent, current, text, pop);

      continue;
    }

    //标签结束时例如
    // 1. stackTop = {type:"div",...} && matchPrefix === "div"
    // <div></div>
    //           ^
    // <div></ div >
    //             ^
    if (
      getParentAst().type !== "" &&
      new RegExp(`</ *${getParentAst().type} *>`).test(matchPrefix)
    ) {
      pop();
      matchPrefix = "";
      setCurrent(current + 1);
      continue;
    }

    setCurrent(current + 1);
  }

  //多余标签检测
  // <div>
  //      ^
  checkForMissingLabels(getStackLength, current, getParentAst);

  // 例如
  // 1. text = xxx ; matchPrefix = xxx
  // 2. text = <div></div>xxx ; matchPrefix = xxx
  // 3. text = <div/>xxx ; matchPrefix = xxx
  // 4. text = xxx<div/> ; matchPrefix =
  addStringAst(matchPrefix, getParentAst());

  return getParentAst().children;

  function clearMatchPrefix() {
    matchPrefix = "";
  }
  function setCurrent(_current: number) {
    current = _current;
    char = text[current];
  }
}

function checkForMissingLabels(
  getLength: () => number,
  current: number,
  getParentAst: () => HTMLAst
) {
  if (getLength() > 0) {
    throw new ParserError(current, `期待的结束标签:</${getParentAst().type}>`);
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
function jumpOutOfLabel(
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
 * @param {HTMLAst} parentAst
 * @return {*}
 */
function setupHTMLAstProps(
  current: number,
  char: string,
  text: string,
  parentAst: HTMLAst
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
function setupHTMLAstType(
  char: string,
  current: number,
  text: string,
  parentAst: HTMLAst
) {
  let type;
  // <div >
  //  ^
  ({ char, current, type } = parserTagName(text, current));
  // <div >
  //     ^
  parentAst.type = type;
  return { char, current, type };
}

function addStringAst(matchPrefix: string, stackTop: HTMLAst) {
  if (matchPrefix.length > 0) stackTop.children.push(matchPrefix);
}
export class ParserError extends Error {
  index: number = 0;
  constructor(index: number, ...rest: Parameters<ErrorConstructor>) {
    super(...rest);
    this.index = index;
  }
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
