import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { parser } from "../../../compile-core/src";
import { compileSFC } from "../../../compile-sfc/src";
import { createAstList } from "../../src/snippet/createSnippet";

export function getSFC(path1: string) {
  const path = resolve(__dirname, `../case/`, `${path1}.vue`);
  const code = readFileSync(path, "utf-8");
  const ast = parser(code);
  return compileSFC(ast);
}
export function writeCode(name: string, code: string) {
  const path = resolve(__dirname, `../case/`, `${name}.ts`);
  writeFileSync(path, code);
}
describe("createAstList", () => {
  test("<div></div>", ({ meta: { name } }) => {
    const ast = parser(name).getChildren()[0] as any;
    const list = createAstList(ast);
    expect(list).toMatchInlineSnapshot(`
      [
        HTMLElementAst {
          "children": [],
          "props": {},
          "tag": "div",
          "type": "HTMLElementAst",
        },
      ]
    `);
  });
  test("<div><div></div></div>", ({ meta: { name } }) => {
    const ast = parser(name).getChildren()[0] as any;
    const list = createAstList(ast);
    expect(list).toMatchInlineSnapshot(`
        [
          HTMLElementAst {
            "children": [
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
          HTMLElementAst {
            "children": [],
            "props": {},
            "tag": "div",
            "type": "HTMLElementAst",
          },
        ]
      `);
  });

  test("<template>\n<div></div></template>", ({ meta: { name } }) => {
    const ast = parser(name).getChildren()[0] as any;
    const list = createAstList(ast);
    expect(list.length).toMatchInlineSnapshot("3");
    expect(list).toMatchInlineSnapshot(`
      [
        HTMLElementAst {
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
          ],
          "props": {},
          "tag": "template",
          "type": "HTMLElementAst",
        },
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
      ]
    `);
  });
  test("<template><div><div><div><div><div></div></div></div></div></div></template>", ({
    meta: { name },
  }) => {
    const ast = parser(name).getChildren()[0] as any;
    const list = createAstList(ast);
    expect(list.length).toMatchInlineSnapshot("6");
    expect(list).toMatchSnapshot();
  });
  test("<template><div><div><div><div><div></div></div></div></div></div></template>", ({
    meta: { name },
  }) => {
    const ast = parser(name).getChildren()[0] as any;
    const list = createAstList(ast);
    expect(list.length).toMatchInlineSnapshot("6");
    expect(list).toMatchSnapshot();
  });
  test("case2", ({ meta: { name } }) => {
    const sfc = getSFC(name);
    expect(sfc).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import { ref } from \\"@vue/reactivity\\";
      ",
          "import Index from \\"./index.vue\\";
      ",
        ],
        "script": "
      const count = ref(0);
      console.log(Index);

      function handle() {
        count.value++;
        console.log(count.value);
      }
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
              "children": [
                HTMLTextAst {
                  "text": "
          ",
                  "type": "HTMLTextAst",
                },
                HTMLElementAst {
                  "children": [
                    HTMLTextAst {
                      "text": "
            ",
                      "type": "HTMLTextAst",
                    },
                    HTMLElementAst {
                      "children": [],
                      "props": {
                        ":value": "count",
                        "@click": "handle",
                      },
                      "tag": "Index",
                      "type": "HTMLElementAst",
                    },
                    HTMLTextAst {
                      "text": "
            ",
                      "type": "HTMLTextAst",
                    },
                    HTMLElementAst {
                      "children": [],
                      "props": {
                        ":value": "count",
                      },
                      "tag": "input",
                      "type": "HTMLElementAst",
                    },
                    HTMLTextAst {
                      "text": "xx",
                      "type": "HTMLTextAst",
                    },
                    HTMLTemplateStatementAst {
                      "snippet": " count ",
                      "type": "HTMLTemplateStatementAst",
                    },
                    HTMLTextAst {
                      "text": "
            ",
                      "type": "HTMLTextAst",
                    },
                    HTMLElementAst {
                      "children": [
                        HTMLTextAst {
                          "text": "Add",
                          "type": "HTMLTextAst",
                        },
                      ],
                      "props": {
                        "@click": "handle",
                      },
                      "tag": "button",
                      "type": "HTMLElementAst",
                    },
                    HTMLTextAst {
                      "text": "
          ",
                      "type": "HTMLTextAst",
                    },
                  ],
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

    const list = createAstList(sfc.template);
    expect(list.length).toMatchInlineSnapshot("17");
    expect(list.map((item) => item.type + " => " + Object.values(item)))
      .toMatchInlineSnapshot(`
        [
          "HTMLElementAst => HTMLElementAst,template,[object Object],[object Object],[object Object],[object Object]",
          "HTMLTextAst => HTMLTextAst,
          ",
          "HTMLElementAst => HTMLElementAst,div,[object Object],[object Object],[object Object],[object Object]",
          "HTMLTextAst => HTMLTextAst,
        ",
          "HTMLTextAst => HTMLTextAst,
            ",
          "HTMLElementAst => HTMLElementAst,div,[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]",
          "HTMLTextAst => HTMLTextAst,
          ",
          "HTMLTextAst => HTMLTextAst,
              ",
          "HTMLElementAst => HTMLElementAst,Index,[object Object],",
          "HTMLTextAst => HTMLTextAst,
              ",
          "HTMLElementAst => HTMLElementAst,input,[object Object],",
          "HTMLTextAst => HTMLTextAst,xx",
          "HTMLTemplateStatementAst => HTMLTemplateStatementAst, count ",
          "HTMLTextAst => HTMLTextAst,
              ",
          "HTMLElementAst => HTMLElementAst,button,[object Object],[object Object]",
          "HTMLTextAst => HTMLTextAst,
            ",
          "HTMLTextAst => HTMLTextAst,Add",
        ]
      `);
  });
});
