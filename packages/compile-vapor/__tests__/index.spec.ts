import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { parser } from "../../compile-core";
import { compileSFC } from "../../compile-sfc";
import { codegen, genAstList } from "../src";
describe("index", () => {
  function getSFC(path1: string) {
    const path = resolve(__dirname, `./case/`, `${path1}.vue`);
    const code = readFileSync(path, "utf-8");
    const ast = parser(code);
    return compileSFC(ast);
  }
  function writeCode(name: string, code: string) {
    const path = resolve(__dirname, `./case/`, `${name}.ts`);
    writeFileSync(path, code);
  }
  describe("genAstList", () => {
    test("<div></div>", ({ meta: { name } }) => {
      const ast = parser(name).getChildren()[0] as any;
      const list = genAstList(ast);
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
      const list = genAstList(ast);
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
  });

  test("<template>\n<div></div></template>", ({ meta: { name } }) => {
    const ast = parser(name).getChildren()[0] as any;
    const list = genAstList(ast);
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
    const list = genAstList(ast);
    expect(list.length).toMatchInlineSnapshot("6");
    expect(list).toMatchSnapshot();
  });
  test("<template><div><div><div><div><div></div></div></div></div></div></template>", ({
    meta: { name },
  }) => {
    const ast = parser(name).getChildren()[0] as any;
    const list = genAstList(ast);
    expect(list.length).toMatchInlineSnapshot("6");
    expect(list).toMatchSnapshot();
  });
  test("case2", ({ meta: { name } }) => {
    const sfc = getSFC(name);
    expect(sfc).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import { ref } from \\"@vue/reactivity\\"",
        ],
        "script": "const count = ref(0);
      function handle() { 
      count.value++;
      console.log(count.value);
      };
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

    const list = genAstList(sfc.template);
    expect(list.length).toMatchInlineSnapshot('15');
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
          "HTMLElementAst => HTMLElementAst,div,[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]",
          "HTMLTextAst => HTMLTextAst,
          ",
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

  test("case2", ({ meta: { name } }) => {
    const sfc = getSFC(name);
    expect(sfc).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "import { ref } from \\"@vue/reactivity\\"",
        ],
        "script": "const count = ref(0);
      function handle() { 
      count.value++;
      console.log(count.value);
      };
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
    const code = codegen(sfc);
    writeCode(name, code);
    expect(code).toMatchInlineSnapshot(`
      "import { unref,effect } from \\"@vue/reactivity\\";
      import { ref } from \\"@vue/reactivity\\"

      const sa = (e, key, value)=>e.setAttribute(key, value)
      const ae = (e, key, value)=>e.addEventListener(key, value)
      const ce = document.createElement.bind(document)

      const ct = document.createTextNode.bind(document)
      export default function (props,context){
          const count = ref(0);
        function handle() { 
        count.value++;
        console.log(count.value);
        };
        

          
          var node = {$0:context.parentEl,$1: ct(\\"\\\\n  \\"),$2: ce(\\"div\\"),$3: ct(\\"\\\\n\\"),$4: ct(\\"\\\\n    \\"),$5: ce(\\"div\\"),$6: ct(\\"\\\\n  \\"),$7: ct(\\"\\\\n      \\"),$8: ce(\\"input\\"),$9: ct(\\"xx\\"),$10: ct(''),$11: ct(\\"\\\\n      \\"),$12: ce(\\"button\\"),$13: ct(\\"\\\\n    \\"),$14: ct(\\"Add\\")};
          node.$0.append(node.$1,node.$2,node.$3);
        
        node.$2.append(node.$4,node.$5,node.$6);
        
        
        node.$5.append(node.$7,node.$8,node.$9,node.$10,node.$11,node.$12,node.$13);
        
        
        
        
        
        
        node.$12.append(node.$14);
          effect(()=>{effect(()=>{sa(node.$8,\\"value\\",String(unref(count)));});effect(()=>{node.$10.nodeValue = String(unref( count ))});effect(()=>{ae(node.$12,\\"click\\",handle);});});
      }"
    `);
  });
});
