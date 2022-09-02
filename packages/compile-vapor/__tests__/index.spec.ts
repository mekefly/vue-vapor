import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { parser } from "../../compile-core";
import { compileSFC } from "../../compile-sfc";
import { codegen } from "../src";
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

  test("case2", ({ meta: { name } }) => {
    const sfc = getSFC(name);
    expect(sfc).toMatchInlineSnapshot(`
      {
        "importSnippets": [
          "
      import { ref } from \\"@vue/reactivity\\";",
        ],
        "script": "
      const count = ref(0);
      count.value++;
      console.log(count.value);
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
    const code = codegen(sfc);
    writeCode(name, code);
    expect(code).toMatchInlineSnapshot(`
      "import { effect } from \\"@vue/reactivity\\";

      import { ref } from \\"@vue/reactivity\\";

      export default function (){
        
      const count = ref(0);
      count.value++;
      console.log(count.value);


        
        var node = {$0: document.createTextNode(\\"\\\\n  \\"),$1: document.createElement(\\"div\\"),$2: document.createTextNode(\\"\\\\n\\")};
        node.$0.append(node.$0,node.$1,node.$2);
        effect(()=>{effect(()=>{});});
      }"
    `);
  });
});
