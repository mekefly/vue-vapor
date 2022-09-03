import { HTMLElementAst, HTMLTextAst } from "@vue-vapor/compile-core";
import { CodeSnippet } from "./type";
import { indent } from "./utils";

export const ADD_EVENT_LISTENER_VAR_NAME = "ae";
export const SET_ATTRIBUTE_VAR_NAME = "sa";
export const RENDER_VAR_NAME = `$render`;
export const VARIABLE_NAME = "node";
export const EFFECT_NAME = "effect";

const compileImport: Record<string, Set<string>> = {};
const moduleSnippets: Set<string> = new Set();

export function moduleSnippetTemplate(
  importSnippet: string,
  setupSnippet: string
) {
  importSnippet =
    Object.entries(compileImport)
      .map(
        ([packageName, vars]) =>
          `import { ${[...vars].join(",")} } from "@vue/reactivity";\n`
      )
      .join() + importSnippet;

  return `${importSnippet ? `${importSnippet}\n\n` : "\n"}${[
    ...moduleSnippets,
  ].join("\n")}${setupSnippet}`;
}

export function setupSnippetTemplate(
  scriptSnippet: string,
  renderSnippet: string
) {
  return `export default function (props,context){
  ${indent(scriptSnippet, 1)}

  ${indent(renderSnippet)}
}`;
}

export function renderCodeSnippetTemplate(
  createSnippet: string,
  appendSnippet: string,
  attributeSnippet: string
) {
  return `
  ${createSnippet}
  ${appendSnippet}
  ${createWatchEffectSnippet(attributeSnippet)}`;
}

export function createSnippetTemplate(codeSnippets: CodeSnippet[]) {
  return `var ${VARIABLE_NAME} = {${codeSnippets
    .map((codeSnippet) => {
      return codeSnippet.createSnippet;
    })
    .join(",")}};`;
}

export function appendTemplate(parentId: number, ...ids: number[]) {
  return `${getElVarTemplate(parentId)}.append(${ids
    .map((id) => getElVarTemplate(id))
    .join(",")});`;
}

moduleSnippets.add(
  `const ${SET_ATTRIBUTE_VAR_NAME} = (e, key, value)=>e.setAttribute(key, value)`
);
moduleSnippets.add(
  `const ${ADD_EVENT_LISTENER_VAR_NAME} = (e, key, value)=>e.addEventListener(key, value)`
);
export function setAttributeTemplate(id: number, key: string, value: string) {
  const dyn = ["@", ":", "v-"].some((item) => key.startsWith(item));
  addImport("@vue/reactivity", "unref");

  if (key.startsWith(":")) {
    return `${SET_ATTRIBUTE_VAR_NAME}(${getElVarTemplate(id)},"${key.slice(
      1
    )}",${`String(unref(${value})`}));`;
  } else if (key.startsWith("@")) {
    return `${ADD_EVENT_LISTENER_VAR_NAME}(${getElVarTemplate(id)},"${key.slice(
      1
    )}",${value});`;
  } else {
    return `${SET_ATTRIBUTE_VAR_NAME}(${getElVarTemplate(
      id
    )},"${key}","${value}"});`;
  }
}

export function getElVarTemplate(id: number) {
  return `${VARIABLE_NAME}.$${id}`;
}

moduleSnippets.add("const ce = document.createElement.bind(document)\n");
export function createElementTemplate(ast: HTMLElementAst, id: number) {
  return `$${id}: ce("${ast.tag}")`;
}

moduleSnippets.add("const ct = document.createTextNode.bind(document)\n");
export function createTextTemplate(ast: HTMLTextAst, id: number) {
  return `$${id}: ct(${JSON.stringify(ast.text)})`;
}
export function createTemplateStatementTemplate(
  id: number,
  defaul: string = '""'
) {
  return `$${id}: ct(${defaul})`;
}

export function createWatchEffectSnippet(snippet: string) {
  if (!snippet) return "";
  addImport("@vue/reactivity", EFFECT_NAME);
  return `${EFFECT_NAME}(()=>{${snippet}});`;
}
export function addImport<T extends `@${`vue${`/reactivity` | `-vapor`}`}`>(
  packageName: T,
  ...varName: string[]
) {
  const compileImportDeps =
    compileImport[packageName] ?? (compileImport[packageName] = new Set());

  varName.forEach((item) => compileImportDeps.add(item));
}
