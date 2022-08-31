import { HTMLElementAst, HTMLTextAst, RootAst } from "../ast";
import { ParserError } from "./error";
import { genStack } from "./genStack";
import { isThePrefixOfTag, parserInTag } from "./parserInTag";

export function parser(text: string) {
  return new RootAst(_parser(text));
}

function _parser(text: string) {
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
      addHtmlTextAst(matchPrefix, getParentAst());
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
      parserInTag(
        push,
        char,
        current,
        text,
        getParentAst,
        clearMatchPrefix,
        setCurrent,
        pop
      );

      continue;
    }

    //标签结束时例如
    // 1. stackTop = {type:"div",...} && matchPrefix === "div"
    // <div></div>
    //           ^
    // <div></ div >
    //             ^
    if (
      getParentAst().tag !== "" &&
      new RegExp(`</ *${getParentAst().tag} *>`).test(matchPrefix)
    ) {
      matchPrefix = closeLabel(pop, matchPrefix, setCurrent, current);
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
  addHtmlTextAst(matchPrefix, getParentAst());

  return getParentAst().children;

  function clearMatchPrefix() {
    matchPrefix = "";
  }
  function setCurrent(_current: number) {
    current = _current;
    char = text[current];
  }
}

function closeLabel(
  pop: () => void,
  matchPrefix: string,
  setCurrent: (_current: number) => void,
  current: number
) {
  pop();
  matchPrefix = "";
  setCurrent(current + 1);
  return matchPrefix;
}

function checkForMissingLabels(
  getLength: () => number,
  current: number,
  getParentAst: () => HTMLElementAst
) {
  if (getLength() > 0) {
    throw new ParserError(current, `期待的结束标签:</${getParentAst().tag}>`);
  }
}

function addHtmlTextAst(matchPrefix: string, stackTop: HTMLElementAst) {
  if (matchPrefix.length > 0)
    stackTop.children.push(new HTMLTextAst(matchPrefix));
}
