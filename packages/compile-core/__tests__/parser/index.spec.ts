import {
  HTMLElementAst,
  HTMLTextAst,
  RootAst,
} from "packages/compile-core/src/ast";
import {
  addHtmlTextAst,
  parser,
  parserTemplateStatement,
} from "packages/compile-core/src/parser";
import { ParserError } from "packages/compile-core/src/parser/error";
import { isThePrefixOfTag } from "packages/compile-core/src/parser/parserInTag";
describe("parserTemplateStatement", () => {
  test("fdfdfdfdfdfdfdf", ({ meta: { name } }) => {
    expect(parserTemplateStatement(name)).toMatchInlineSnapshot(`
      [
        "fdfdfdfdfdfdfdf",
      ]
    `);
  });
  test("fdfdfdfdf{{a+b}}dfdf{{3+4}}dfdfdf", ({ meta: { name } }) => {
    expect(parserTemplateStatement(name)).toMatchInlineSnapshot(`
      [
        "fdfdfdfdf",
        "a+b",
        "dfdf",
        "3+4",
        "dfdfdf",
      ]
    `);
  });
  test("fdfdfdfdf{{'{{}}'}}dfdf{{3+4}}dfdfdf", ({ meta: { name } }) => {
    expect(parserTemplateStatement(name)).toMatchInlineSnapshot(`
      [
        "fdfdfdfdf",
        "'{{}}'",
        "dfdf",
        "3+4",
        "dfdfdf",
      ]
    `);
  });
  test(`{{ "{}{}{}"}}`, ({ meta: { name } }) => {
    expect(parserTemplateStatement(name)).toMatchInlineSnapshot(`
      [
        "",
        " \\"{}{}{}\\"",
        "",
      ]
    `);
  });
});
describe("addHtmlTextAst", () => {
  test(`{{ "{}{}{}"}}`, ({ meta: { name } }) => {
    const stackTop: any = { children: [] };
    addHtmlTextAst(name, stackTop);
    expect(stackTop).toMatchInlineSnapshot(`
      {
        "children": [
          HTMLTemplateStatementAst {
            "snippet": " \\"{}{}{}\\"",
            "type": "HTMLTemplateStatementAst",
          },
        ],
      }
    `);
  });
  test(`xxx{{"1123"}}xxx`, ({ meta: { name } }) => {
    const stackTop: any = { children: [] };
    addHtmlTextAst(name, stackTop);
    expect(stackTop.children).toMatchInlineSnapshot(`
      [
        HTMLTextAst {
          "text": "xxx",
          "type": "HTMLTextAst",
        },
        HTMLTemplateStatementAst {
          "snippet": "\\"1123\\"",
          "type": "HTMLTemplateStatementAst",
        },
        HTMLTextAst {
          "text": "xxx",
          "type": "HTMLTextAst",
        },
      ]
    `);
  });
  test(`xxx{{count}}xxx`, ({ meta: { name } }) => {
    const stackTop: any = { children: [] };
    addHtmlTextAst(name, stackTop);
    expect(stackTop.children).toMatchInlineSnapshot(`
      [
        HTMLTextAst {
          "text": "xxx",
          "type": "HTMLTextAst",
        },
        HTMLTemplateStatementAst {
          "snippet": "count",
          "type": "HTMLTemplateStatementAst",
        },
        HTMLTextAst {
          "text": "xxx",
          "type": "HTMLTextAst",
        },
      ]
    `);
  });
  test(`xxx{{count\n}}xxx`, ({ meta: { name } }) => {
    const stackTop: any = { children: [] };
    addHtmlTextAst(name, stackTop);
    expect(stackTop.children).toMatchInlineSnapshot(`
      [
        HTMLTextAst {
          "text": "xxx",
          "type": "HTMLTextAst",
        },
        HTMLTemplateStatementAst {
          "snippet": "count
      ",
          "type": "HTMLTemplateStatementAst",
        },
        HTMLTextAst {
          "text": "xxx",
          "type": "HTMLTextAst",
        },
      ]
    `);
  });
  test(`xxx{{count\n}}xx{{xxx\n}}x`, ({ meta: { name } }) => {
    const stackTop: any = { children: [] };
    addHtmlTextAst(name, stackTop);
    expect(stackTop.children).toMatchInlineSnapshot(`
      [
        HTMLTextAst {
          "text": "xxx",
          "type": "HTMLTextAst",
        },
        HTMLTemplateStatementAst {
          "snippet": "count
      ",
          "type": "HTMLTemplateStatementAst",
        },
        HTMLTextAst {
          "text": "xx",
          "type": "HTMLTextAst",
        },
        HTMLTemplateStatementAst {
          "snippet": "xxx
      ",
          "type": "HTMLTemplateStatementAst",
        },
        HTMLTextAst {
          "text": "x",
          "type": "HTMLTextAst",
        },
      ]
    `);
  });
  test(`xxx{{count\n}}xx{{xxx\n}}`, ({ meta: { name } }) => {
    const stackTop: any = { children: [] };
    addHtmlTextAst(name, stackTop);
    expect(stackTop.children).toMatchInlineSnapshot(`
      [
        HTMLTextAst {
          "text": "xxx",
          "type": "HTMLTextAst",
        },
        HTMLTemplateStatementAst {
          "snippet": "count
      ",
          "type": "HTMLTemplateStatementAst",
        },
        HTMLTextAst {
          "text": "xx",
          "type": "HTMLTextAst",
        },
        HTMLTemplateStatementAst {
          "snippet": "xxx
      ",
          "type": "HTMLTemplateStatementAst",
        },
      ]
    `);
  });
  test(`{{count\n}}{{xxx\n}}`, ({ meta: { name } }) => {
    const stackTop: any = { children: [] };
    addHtmlTextAst(name, stackTop);
    expect(stackTop.children).toMatchInlineSnapshot(`
      [
        HTMLTemplateStatementAst {
          "snippet": "count
      ",
          "type": "HTMLTemplateStatementAst",
        },
        HTMLTemplateStatementAst {
          "snippet": "xxx
      ",
          "type": "HTMLTemplateStatementAst",
        },
      ]
    `);
  });
});

test("isThePrefixOfTag", () => {
  let value = isThePrefixOfTag("<");
  expect(value).toBe(false);

  value = isThePrefixOfTag("</");
  expect(value).toBe(false);

  value = isThePrefixOfTag("<a");
  expect(value).toBe(true);

  value = isThePrefixOfTag("<A");
  expect(value).toBe(true);

  try {
    value = isThePrefixOfTag("<[", 15);
  } catch (error) {
    if (error instanceof ParserError) {
      expect(error.index).toBe(15);
    }
  }
});

describe("parser", () => {
  test("111", (content) => {
    const result = parser(content.meta.name);
    expect(result).toEqual(new RootAst([new HTMLTextAst("111")]));
  });

  test("<div/>", (content) => {
    const result = parser(content.meta.name);
    expect(result).toEqual(new RootAst([new HTMLElementAst("div")]));
  });

  test("<div></div>", (content) => {
    const result = parser(content.meta.name);
    expect(result).toEqual(new RootAst([new HTMLElementAst("div")]));
  });

  test("<div></ div    >", (content) => {
    const result = parser(content.meta.name);
    expect(result).toEqual(new RootAst([new HTMLElementAst("div")]));
  });

  test("<div>111</div>", (content) => {
    const result = parser(content.meta.name);
    expect(result).toEqual(
      new RootAst([
        new HTMLElementAst("div", undefined, [new HTMLTextAst("111")]),
      ])
    );
  });

  test("<div>111<div></div></div>", (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLElementAst {
            "children": [
              HTMLTextAst {
                "text": "111",
                "type": "HTMLTextAst",
              },
              HTMLElementAst {
                "children": [],
                "props": {},
                "tag": "div",
                "type": "HTMLElementAst",
              },
            ],
            "props": {},
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test(`<div xxx="xxx"></div>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "xxx",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test(`<div xxx ></div>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test(`<div xxx></div>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test(`<div xxx/>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test(`<div xxx />`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test(`<div xxx /><div xxx/>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test(`xxx<div xxx /><div xxx/>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLTextAst {
            "text": "xxx",
            "type": "HTMLTextAst",
          },
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test(`xxx<div xxx /><div xxx/>yyy`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLTextAst {
            "text": "xxx",
            "type": "HTMLTextAst",
          },
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
          HTMLElementAst {
            "children": [],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
          HTMLTextAst {
            "text": "yyy",
            "type": "HTMLTextAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test(`<div xxx><div value="a?b:c"></div></div>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      RootAst {
        "children": [
          HTMLElementAst {
            "children": [
              HTMLElementAst {
                "children": [],
                "props": {
                  "value": "a?b:c",
                },
                "tag": "div",
                "type": "HTMLElementAst",
              },
            ],
            "props": {
              "xxx": "true",
            },
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ],
        "type": "RootAst",
      }
    `);
  });

  test("期待的结束标签", () => {
    try {
      parser("<div>");
      throw new Error("错误提示失效");
    } catch (error) {
      expect(error instanceof ParserError).toMatchInlineSnapshot("false");
      expect(error).toMatchInlineSnapshot("[Error: 期待的结束标签:</div>]");
      if (error instanceof ParserError) {
        expect(error.index).toMatchInlineSnapshot("5");
      }
    }
  });
});
