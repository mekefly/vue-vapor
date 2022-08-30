import {
  isThePrefixOfTag,
  parser,
  ParserError,
} from "packages/compile-sfc/src/parser";

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
    expect(result).toEqual(["111"]);
  });

  test("<div/>", (content) => {
    const result = parser(content.meta.name);
    expect(result).toEqual([{ type: "div", props: {}, children: [] }]);
  });

  test("<div></div>", (content) => {
    const result = parser(content.meta.name);
    expect(result).toEqual([{ type: "div", props: {}, children: [] }]);
  });
  test("<div></ div    >", (content) => {
    const result = parser(content.meta.name);
    expect(result).toEqual([{ type: "div", props: {}, children: [] }]);
  });
  test("<div>111</div>", (content) => {
    const result = parser(content.meta.name);
    expect(result).toEqual([{ type: "div", props: {}, children: ["111"] }]);
  });
  test("<div>111<div></div></div>", (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        HTMLAst {
          "children": [
            "111",
            HTMLAst {
              "children": [],
              "props": {},
              "type": "div",
            },
          ],
          "props": {},
          "type": "div",
        },
      ]
    `);
  });
  test(`<div xxx="xxx"></div>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "xxx",
          },
          "type": "div",
        },
      ]
    `);
  });
  test(`<div xxx ></div>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
      ]
    `);
  });
  test(`<div xxx></div>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
      ]
    `);
  });
  test(`<div xxx/>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
      ]
    `);
  });
  test(`<div xxx />`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
      ]
    `);
  });
  test(`<div xxx /><div xxx/>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
      ]
    `);
  });
  test(`xxx<div xxx /><div xxx/>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        "xxx",
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
      ]
    `);
  });
  test(`xxx<div xxx /><div xxx/>yyy`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        "xxx",
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
        HTMLAst {
          "children": [],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
        "yyy",
      ]
    `);
  });
  test(`<div xxx><div value="a?b:c"></div></div>`, (content) => {
    const result = parser(content.meta.name);
    expect(result).toMatchInlineSnapshot(`
      [
        HTMLAst {
          "children": [
            HTMLAst {
              "children": [],
              "props": {
                "value": "a?b:c",
              },
              "type": "div",
            },
          ],
          "props": {
            "xxx": "true",
          },
          "type": "div",
        },
      ]
    `);
  });
  test("期待的结束标签", () => {
    try {
      parser("<div>");
      throw new Error("错误提示失效");
    } catch (error) {
      expect(error instanceof ParserError).toMatchInlineSnapshot("true");
      expect(error).toMatchInlineSnapshot("[Error: 期待的结束标签:</div>]");
      if (error instanceof ParserError) {
        expect(error.index).toMatchInlineSnapshot("5");
      }
    }
  });
});
