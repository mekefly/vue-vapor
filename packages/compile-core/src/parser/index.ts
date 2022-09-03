import {
  HTMLElementAst,
  HTMLTemplateStatementAst,
  HTMLTextAst,
  RootAst,
} from "../ast";
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

export function addHtmlTextAst(matchPrefix: string, stackTop: HTMLElementAst) {
  const xx = parserTemplateStatement(matchPrefix);

  if (matchPrefix.length <= 0) return;
  xx.forEach((c, index) => {
    if (c.length <= 0) return;
    if (index % 2 === 0) {
      stackTop.children.push(new HTMLTextAst(c));
    } else {
      stackTop.children.push(new HTMLTemplateStatementAst(c));
    }
  });
}

const stack: string[] = [];
export function parserTemplateStatement(text: string) {
  let current = 0;
  const anchor = [];
  const openState: Record<string, boolean> = {};

  let openTheTag: string | undefined;
  while (current < text.length) {
    const c = text[current];
    if (!openTheTag && text.slice(current, current + 2) === "{{") {
      stack.push("{{");
      anchor.push(current);
    } else if (!openTheTag && text.slice(current, current + 2) === "}}") {
      const xx = stack.pop();
      if (xx !== "{{") {
        throw new Error("不匹配的模板");
      }
      anchor.push(current);
    } else if (stringIdentifier("'", c)) {
    } else if (stringIdentifier('"', c)) {
    } else if (stringIdentifier("`", c)) {
    }
    current++;
  }
  let l = 0;
  anchor.push(text.length);
  return anchor.map((c, index) => {
    let v = text.slice(l, c);

    if (index > 0) {
      v = v.slice(2);
    }

    l = c;
    return v;
  });

  function stringIdentifier(t: string, c: string): boolean {
    if (openTheTag && openTheTag !== t) {
      return false;
    }
    if (c === t) {
      if (openState[t]) {
        const xx = stack.pop();
        if (xx !== t) {
          throw new Error("不匹配的'");
        }
        openTheTag = undefined;
        openState[t] = false;
      } else {
        openTheTag = t;
        openState[t] = true;
        stack.push(t);
      }
      return true;
    } else {
      return false;
    }
  }
}
