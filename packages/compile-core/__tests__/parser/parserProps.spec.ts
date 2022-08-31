import { parserProps } from "../../src/parser/parserProps";

describe("parserProps", () => {
  test.only("<div xxx >", ({ meta: { name } }) => {
    const current = 4;
    let value = parserProps(name, current);
    expect(value).toMatchInlineSnapshot(`
      {
        "char": ">",
        "current": 9,
        "props": {
          "xxx": "true",
        },
      }
    `);
  });
  test.only(`<div xxx="">`, ({ meta: { name } }) => {
    const current = 4;
    let value = parserProps(name, current);
    expect(value).toMatchInlineSnapshot(`
      {
        "char": ">",
        "current": 11,
        "props": {
          "xxx": "",
        },
      }
    `);
  });
  test.only(`<div xxx="a+b">`, ({ meta: { name } }) => {
    const current = 4;
    let value = parserProps(name, current);
    expect(value).toMatchInlineSnapshot(`
      {
        "char": ">",
        "current": 14,
        "props": {
          "xxx": "a+b",
        },
      }
    `);
  });
  test.only(`<div xxx="xxx">`, ({ meta: { name } }) => {
    const current = 4;
    let value = parserProps(name, current);
    expect(value).toMatchInlineSnapshot(`
      {
        "char": ">",
        "current": 14,
        "props": {
          "xxx": "xxx",
        },
      }
    `);
  });
  test.only(`<div xxx="xxx"/>`, ({ meta: { name } }) => {
    const current = 4;
    let value = parserProps(name, current);
    expect(value).toMatchInlineSnapshot(`
      {
        "char": "/",
        "current": 14,
        "props": {
          "xxx": "xxx",
        },
      }
    `);
  });
  test.only(`<div xxx="xxx" yyy zzz="333"/>`, ({ meta: { name } }) => {
    const current = 4;
    let value = parserProps(name, current);
    expect(value).toMatchInlineSnapshot(`
      {
        "char": "/",
        "current": 28,
        "props": {
          "xxx": "xxx",
          "yyy": "true",
          "zzz": "333",
        },
      }
    `);
  });
});
