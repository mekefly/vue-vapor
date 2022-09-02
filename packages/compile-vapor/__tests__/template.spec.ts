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
      '"$0:_document.createTextNode(\\"hello\\")"'
    );
  });
  test("createWatchEffectSnippet", () => {
    const s1 = "const xxx = 'xxx';";
    const xxx = parser("<div></div>").getChildren()[0] as any;

    expect(spaceDisplay(createElementTemplate(xxx, 0))).toMatchInlineSnapshot(
      '"$0:_document.createElement(\\"div\\")"'
    );
  });
  test("getElVarTemplate", () => {
    expect(getElVarTemplate(0)).toMatchInlineSnapshot('"node.$0"');
    expect(getElVarTemplate(2)).toMatchInlineSnapshot('"node.$2"');
  });
  test("setAttributeTemplate", () => {
    expect(setAttributeTemplate(0, "class", "c-xx")).toMatchInlineSnapshot(
      '"node.$0.setAttribute(\\"class\\",\\"c-xx\\"});"'
    );
  });
  let appendSnippet = "";
  test("appendTemplate", () => {
    expect((appendSnippet = appendTemplate(0, 1, 2, 3))).toMatchInlineSnapshot(
      '"node.$0.append(node.$1,node.$2,node.$3);"'
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
      '"var node = {$1: document.createElement(\\"div\\"),$2: document.createElement(\\"span\\")};"'
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
        var node = {$1: document.createElement(\\"div\\"),$2: document.createElement(\\"span\\")};
        node.$0.append(node.$1);
        effect(()=>{node.$1.setAttribute(\\"class\\",\\"class-name\\"});});"
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
        

          
          var node = {$1: document.createElement(\\"div\\"),$2: document.createElement(\\"span\\")};
          node.$0.append(node.$1);
          effect(()=>{node.$1.setAttribute(\\"class\\",\\"class-name\\"});});
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

      export default function (props,context){
          const count = ref(0);
        

          
          var node = {$1: document.createElement(\\"div\\"),$2: document.createElement(\\"span\\")};
          node.$0.append(node.$1);
          effect(()=>{node.$1.setAttribute(\\"class\\",\\"class-name\\"});});
      }"
    `);
  });
});
