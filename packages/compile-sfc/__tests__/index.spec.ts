import { readFileSync } from "fs";
import { resolve } from "path";
import { parser } from "../../compile-core";
import { compileSFC } from "../src";

describe("compileSFC", () => {
  test("vaporTrueSetupTrue", () => {
    const path = resolve(__dirname, "./case/vaporTrueSetupTrue.vue");
    const code = readFileSync(path, "utf-8");
    const ast = parser(code);
    const sfc = compileSFC(ast);
    expect(sfc).toMatchInlineSnapshot(`
      {
        "importSnippets": [],
        "script": "
      console.log(\\"333\\");
      ",
        "setup": true,
        "style": "",
        "template": HTMLElementAst {
          "children": [
            HTMLTextAst {
              "text": "
        ",
              "type": "HTMLTextAst",
            },
            HTMLElementAst {
              "children": [],
              "props": {},
              "tag": "div",
              "type": "HTMLElementAst",
            },
            HTMLTextAst {
              "text": "
      ",
              "type": "HTMLTextAst",
            },
          ],
          "props": {},
          "tag": "template",
          "type": "HTMLElementAst",
        },
        "vapor": true,
      }
    `);
  });
  test("vaporFalse", () => {
    const path = resolve(__dirname, "./case/vaporFalse.vue");
    const code = readFileSync(path, "utf-8");
    const ast = parser(code);
    const sfc = compileSFC(ast);
    expect([sfc.setup, sfc.vapor]).toMatchInlineSnapshot(`
      [
        true,
        false,
      ]
    `);
  });
  test("setupFalse", () => {
    const path = resolve(__dirname, "./case/setupFalse.vue");
    const code = readFileSync(path, "utf-8");
    const ast = parser(code);
    const sfc = compileSFC(ast);
    expect([sfc.setup, sfc.vapor]).toMatchInlineSnapshot(`
      [
        false,
        true,
      ]
    `);
  });
});
