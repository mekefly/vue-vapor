import { parser } from "@vue-vapor/compile-core";
import {
  appendTemplate,
  createElementTemplate,
  createSnippetTemplate,
  createTextTemplate,
  createWatchEffectSnippet,
  getElVarTemplate,
  moduleSnippetTemplate,
  renderCodeSnippetTemplate,
  setAttributeTemplate,
  setupSnippetTemplate,
} from "../src/template";
import { CodeSnippet } from "../src/type";
import { spaceDisplay } from "../src/utils";

describe("template", () => {
  test("", () => {});
  test("createWatchEffectSnippet", () => {
    const s1 = "const xxx = 'xxx';";
    expect(spaceDisplay(createWatchEffectSnippet(s1))).toMatchInlineSnapshot(
      '"effect(()=>{const_xxx_=_\'xxx\';});"'
    );
  });
  test("createWatchEffectSnippet", () => {
    const s1 = "const xxx = 'xxx';";
    const xxx = parser("hello").getChildren()[0] as any;

    expect(spaceDisplay(createTextTemplate(xxx, 0))).toMatchInlineSnapshot(
      '"$0:_ct(\\"hello\\")"'
    );
  });
  test("createWatchEffectSnippet", () => {
    const s1 = "const xxx = 'xxx';";
    const xxx = parser("<div></div>").getChildren()[0] as any;

    expect(spaceDisplay(createElementTemplate(xxx, 0))).toMatchInlineSnapshot(
      '"$0:_ce(\\"div\\")"'
    );
  });
  test("getElVarTemplate", () => {
    expect(getElVarTemplate(0)).toMatchInlineSnapshot('"$.$0"');
    expect(getElVarTemplate(2)).toMatchInlineSnapshot('"$.$2"');
  });
  test("setAttributeTemplate", () => {
    expect(setAttributeTemplate(0, "class", "c-xx")).toMatchInlineSnapshot(
      '"sa($.$0,\\"class\\",\\"c-xx\\"});"'
    );
  });
  let appendSnippet = "";
  test("appendTemplate", () => {
    expect((appendSnippet = appendTemplate(0, 1, 2, 3))).toMatchInlineSnapshot(
      '"$.$0.append($.$1,$.$2,$.$3);"'
    );
  });
  const divAsp = parser("<div></div>").getChildren()[0] as any;
  const spanAsp = parser("<span></span>").getChildren()[0] as any;
  let codeSnippetList: CodeSnippet[] = [];
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
      '"var $ = {$1: ce(\\"div\\"),$2: ce(\\"span\\")};"'
    );
  });
  test("renderCodeSnippetTemplate", () => {
    const createSnippet = createSnippetTemplate(codeSnippetList);
    const appendSnippet = appendTemplate(0, 1);
    const attributeSnippet = setAttributeTemplate(1, "class", "class-name");
    expect(
      renderCodeSnippetTemplate(createSnippet, appendSnippet, attributeSnippet)
    ).toMatchInlineSnapshot(`
      "
        var $ = {$1: ce(\\"div\\"),$2: ce(\\"span\\")};
        $.$0.append($.$1);
        effect(()=>{sa($.$1,\\"class\\",\\"class-name\\"});});"
    `);
  });
  test("setupSnippetTemplate", () => {
    const createSnippet = createSnippetTemplate(codeSnippetList);
    const appendSnippet = appendTemplate(0, 1);
    const attributeSnippet = setAttributeTemplate(1, "class", "class-name");

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
      "export default function (props,context){
          const count = ref(0);
        

        (function(){
            
            var $ = {$1: ce(\\"div\\"),$2: ce(\\"span\\")};
            $.$0.append($.$1);
            effect(()=>{sa($.$1,\\"class\\",\\"class-name\\"});});
        })()
      }"
    `);
  });
  test("moduleSnippetTemplate", () => {
    const createSnippet = createSnippetTemplate(codeSnippetList);
    const appendSnippet = appendTemplate(0, 1);
    const attributeSnippet = setAttributeTemplate(1, "class", "class-name");
    const setupSnippet = setupSnippetTemplate(
      "const count = ref(0);\n",
      renderCodeSnippetTemplate(createSnippet, appendSnippet, attributeSnippet)
    );
    expect(
      moduleSnippetTemplate("import {ref} from '@vue/reactivity'", setupSnippet)
    ).toMatchInlineSnapshot(`
      "import { effect,unref } from \\"@vue/reactivity\\";
      import {ref} from '@vue/reactivity'

      const sa = (e, key, value)=>e.setAttribute(key, value)
      const ae = (e, key, value)=>e.addEventListener(key, value)
      const ce = document.createElement.bind(document)


      const cc = (Component, parentEl) => {
        const instance = {
          Component,
          props: {},
          context: {},
          parentEl,
        };
        Component(instance.props, instance);
        return instance;
      };

      const ct = document.createTextNode.bind(document)
      export default function (props,context){
          const count = ref(0);
        

        (function(){
            
            var $ = {$1: ce(\\"div\\"),$2: ce(\\"span\\")};
            $.$0.append($.$1);
            effect(()=>{sa($.$1,\\"class\\",\\"class-name\\"});});
        })()
      }"
    `);
  });
});
