import { parser } from "@vue-vapor/compile-core";
import {
  appendTemplate,
  createElementTemplate,
  createSnippetTemplate,
  createTextTemplate,
  getElVarTemplate,
  marginImportSnippet,
  moduleTemplate,
  renderCodeSnippetTemplate,
  setupSnippetTemplate,
} from "../../src/template";
import { createImportTemplate } from "../../src/template/moduleTemplate";
import { elementPropTemplate } from "../../src/template/propTemplate";
import { effectTemplate } from "../../src/template/simpleTemplate";
import { AstCodeSnippetOptions } from "../../src/type";
import { spaceDisplay } from "../../src/utils";

describe("template", () => {
  test("", () => {});
  test("createWatchEffectSnippet", () => {
    const s1 = "const xxx = 'xxx';";
    expect(spaceDisplay(effectTemplate(s1))).toMatchInlineSnapshot(
      `
      "effect(()=>{
      __const_xxx_=_'xxx';
      });
      "
    `
    );
  });
  test("createTextTemplate", () => {
    const s1 = "const xxx = 'xxx';";
    const xxx = parser("hello").getChildren()[0] as any;

    expect(spaceDisplay(createTextTemplate(xxx, 0))).toMatchInlineSnapshot(
      `
      "$[0]_=_ct(\\"hello\\");
      "
    `
    );
  });
  test("createElementTemplate", () => {
    const s1 = "const xxx = 'xxx';";
    const xxx = parser("<div></div>").getChildren()[0] as any;

    expect(spaceDisplay(createElementTemplate(xxx, 0))).toMatchInlineSnapshot(
      `
      "$[0]_=_ce(\\"div\\");
      "
    `
    );
  });
  test("getElVarTemplate", () => {
    expect(getElVarTemplate(0)).toMatchInlineSnapshot('"$[0]"');
    expect(getElVarTemplate(2)).toMatchInlineSnapshot('"$[2]"');
  });
  test("setAttributeTemplate", () => {
    expect(elementPropTemplate(0, "class", "c-xx")).toMatchInlineSnapshot(
      `
      "sa($[0],\\"class\\",\\"c-xx\\");
      "
    `
    );
  });
  let appendSnippet = "";
  test("appendTemplate", () => {
    expect((appendSnippet = appendTemplate(0, 1, 2, 3))).toMatchInlineSnapshot(
      `
      "$[0].append($[1],$[2],$[3]);
      "
    `
    );
  });
  const divAsp = parser("<div></div>").getChildren()[0] as any;
  const spanAsp = parser("<span></span>").getChildren()[0] as any;
  let codeSnippetList: AstCodeSnippetOptions[] = [];
  let createSnippet = "";
  test("createSnippetTemplate", () => {
    expect(
      (createSnippet = createSnippetTemplate(
        (codeSnippetList = [
          {
            id: 0,
            createSnippet: createElementTemplate(divAsp, 1),
            attributeSnippet: "",
            mount: "",
            parentId: 0,
          },
          {
            id: 1,
            createSnippet: createElementTemplate(spanAsp, 2),
            attributeSnippet: "",
            mount: "",
            parentId: 0,
          },
        ])
      ))
    ).toMatchInlineSnapshot(
      `
      "const $ = __context.el;
      $[1] = ce(\\"div\\");
      $[2] = ce(\\"span\\");
      "
    `
    );
  });
  test("renderCodeSnippetTemplate", () => {
    const createSnippet = createSnippetTemplate(codeSnippetList);
    const appendSnippet = appendTemplate(0, 1);
    const attributeSnippet = elementPropTemplate(1, "class", "class-name");
    expect(
      renderCodeSnippetTemplate(createSnippet, appendSnippet, attributeSnippet)
    ).toMatchInlineSnapshot(`
      "const $ = __context.el;
      $[1] = ce(\\"div\\");
      $[2] = ce(\\"span\\");

      $[0].append($[1]);

      sa($[1],\\"class\\",\\"class-name\\");"
    `);
  });
  test("setupSnippetTemplate", () => {
    const createSnippet = createSnippetTemplate(codeSnippetList);
    const appendSnippet = appendTemplate(0, 1);
    const attributeSnippet = elementPropTemplate(1, "class", "class-name");

    expect(
      setupSnippetTemplate(
        "const count = ref(0);\n",
        renderCodeSnippetTemplate(
          createSnippet,
          appendSnippet,
          attributeSnippet
        )
      )
    ).toMatchInlineSnapshot(`
      "export default function (props,__context){
        const count = ref(0);
        (function(){
          const $ = __context.el;
          $[1] = ce(\\"div\\");
          $[2] = ce(\\"span\\");
          
          $[0].append($[1]);
          
          sa($[1],\\"class\\",\\"class-name\\");
        })()
      }"
    `);
  });
  test("moduleTemplate", () => {
    const createSnippet = createSnippetTemplate(codeSnippetList);
    const appendSnippet = appendTemplate(0, 1);
    const attributeSnippet = elementPropTemplate(1, "class", "class-name");
    const setupSnippet = setupSnippetTemplate(
      "const count = ref(0);\n",
      renderCodeSnippetTemplate(createSnippet, appendSnippet, attributeSnippet)
    );
    expect(moduleTemplate("import {ref} from '@vue/reactivity'", setupSnippet))
      .toMatchInlineSnapshot(`
        "import { effect,unref } from \\"@vue/reactivity\\";
        import {ref} from '@vue/reactivity'

        const sa = (e, key, value)=>e.setAttribute(key, value);
        const ae = (e, key, value)=>e.addEventListener(key, value);
        const ce = document.createElement.bind(document);
        const ct = document.createTextNode.bind(document);

        const cc = (Component, parentEl) => {
          const instance = {
            Component,
            props: {},
            el:[],
            parentEl,
            emit(type,value){
              this.props[\`@\${type}\`]?.(value)
            }
          };
          Component(instance.props, instance);
          return instance;
        };
        export default function (props,__context){
          const count = ref(0);
          (function(){
            const $ = __context.el;
            $[1] = ce(\\"div\\");
            $[2] = ce(\\"span\\");
            
            $[0].append($[1]);
            
            sa($[1],\\"class\\",\\"class-name\\");
          })()
        }"
      `);
  });
  test("importTemplate", () => {
    expect(createImportTemplate(["xxx", "yyy"], "packageName"))
      .toMatchInlineSnapshot(`
      "import { xxx,yyy } from \\"packageName\\";
      "
    `);
  });
  test("marginImportSnippet", () => {
    expect(
      marginImportSnippet("import {ref} from 'vue'", {
        "@vue/reactivity": new Set(["effect"]),
      })
    ).toMatchInlineSnapshot(`
      "import { effect } from \\"@vue/reactivity\\";
      import {ref} from 'vue'"
    `);
  });
});
