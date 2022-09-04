export function extractImport(script: string) {
  const importSnippets: string[] = [];
  const scripts: string[] = [];
  let anchorList: number[] = findTheImportBoundary(script);

  let last = 0;
  anchorList.forEach((local, index) => {
    const code = script.slice(last, local);
    // console.log(code, /.*\(.*/.test(code));

    if (index % 2 === 0) {
      scripts.push(code);
    } else {
      importSnippets.push(code);
    }
    last = local;
  });

  return {
    script: ignoreStartWithEnterOrSpace(scripts.join("")),
    importSnippets,
  };
}
const IMPORT_STR = "import";
const IMPORT_LEN = IMPORT_STR.length;

export function findTheImportBoundary(script: string) {
  let anchorList: number[] = [];
  let current = 0;
  let foundImport = false;
  let singleQuotationMarkFound = false;
  let doubleQuotationMarksFound = false;

  function init() {
    foundImport = false;
    singleQuotationMarkFound = false;
    doubleQuotationMarksFound = false;
  }
  ignoreEverythingInQuotationMarks();
  function ignoreEverythingInQuotationMarks() {
    const stack: Array<string | undefined> = [];
    let stackTop: string | undefined;
    const push = (v: string) => {
      stack.push(stackTop);
      stackTop = v;
    };
    const pop = () => {
      let last = stackTop;
      stackTop = stack.pop() as any;
    };

    let last: string | undefined;
    while (current < script.length) {
      const c = script[current];
      if (last === "\\") {
        break;
      } else if (c === "'") {
        if (c === stackTop) {
          pop();
        } else {
          push(c);
        }
      } else if (c === '"') {
        if (c === stackTop) {
          pop();
        } else {
          push(c);
        }
      } else if (c === "`") {
        if (c === stackTop) {
          pop();
        } else {
          push(c);
        }
      } else if (c === "{" && last === "$" && script[current - 2] !== "\\") {
        // `${}` true `\${}` false
        if (c === stackTop) {
          pop();
        } else {
          push("}");
        }
      } else {
        if (stackTop === undefined) {
          findImport();
        }
      }

      last = c;
      current++;
    }
  }
  function findImport() {
    if (script.slice(current, current + IMPORT_LEN) === IMPORT_STR) {
      anchorList.push(current);
      findQuotationMark();
    }
  }
  function findQuotationMark() {
    while (current < script.length) {
      if (findSingleQuotationMark() || findDoubleQuotationMarks()) {
        current++;
        return true;
      }
      current++;
    }
  }
  function findSingleQuotationMark() {
    if (script[current] === "'") {
      //是第二次找到单引号 import {} from 'xxx'
      if (singleQuotationMarkFound) {
        findPossibleSemicolons(current);
        init();
        return true;
      } else {
        singleQuotationMarkFound = true;
      }
    }
  }
  function findDoubleQuotationMarks() {
    if (script[current] === '"') {
      //是第二次找到单引号 import {} from 'xxx'
      if (doubleQuotationMarksFound) {
        findPossibleSemicolons(current);
        init();
        return true;
      } else {
        doubleQuotationMarksFound = true;
      }
    }
  }
  function findPossibleSemicolons(lastCurrent: number) {
    while (current < script.length) {
      current++;

      if (script[current] === ";") {
        break;
      } else if (script[current] === " " || script[current] === "\n") {
        //忽略空格和换行
        current++;
      } else {
        //回退
        current = lastCurrent;
        break;
      }
    }

    const includeBracket = findFrontBracket(
      anchorList[anchorList.length - 1] + IMPORT_STR.length,
      current + 1,
      script
    );

    // 匹配 import("") 这种情况，这种情况是异步的就需要管了
    if (includeBracket) {
      anchorList.pop();
      return;
    }
    anchorList.push(current + 1);
    //import也有可能正好结束
  }
  //最后的位置
  anchorList.push(script.length);
  return anchorList;
}
//找前括号，用与区分放着 import("")语法给混入了
function findFrontBracket(start: number, end: number, str: string) {
  while (start < end) {
    const c = str[start];

    if (c === "(") {
      return true;
    } else if (str[start] === " " || str === "\n") {
      start++;
    } else {
      return false;
    }
  }
  return false;
}
function ignoreStartWithEnterOrSpace(script: string) {
  let current = 0;
  while (current < script.length) {
    if (script[current] === " " || script[current] === "\n") {
      current++;
    } else {
      return script.slice(current);
    }
  }
  return "";
}
