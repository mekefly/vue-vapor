import { HTMLElementAst, HTMLTextAst } from "@vue-vapor/compile-core";
import { CodeSnippet } from "./type";
import { indent } from "./utils";

export const SET_ATTRIBUTE_VAR_NAME = "sa";
export const RENDER_VAR_NAME = `$render`;
export const VARIABLE_NAME = "node";
export const EFFECT_NAME = "effect";

const compileImport: Record<string, Set<string>> = {};

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

  return `${importSnippet ? `${importSnippet}\n\n` : "\n"}${setupSnippet}`;
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

const saTemplate = `function ${SET_ATTRIBUTE_VAR_NAME}(e, key, value) {e.setAttribute(key, value);}`;
export function setAttributeTemplate(id: number, key: string, value: string) {
  const dyn = ["@", ":", "v-"].some((item) => key.startsWith(item));
  addImport("@vue/reactivity", "unref");

  if (key.startsWith(":")) {
    return `${getElVarTemplate(id)}.setAttribute("${key.slice(
      1
    )}",${`unref(${value})`});`;
  } else if (key.startsWith("@")) {
    return `${getElVarTemplate(id)}.addEventListener("${key.slice(
      1
    )}",${value});`;
  } else {
    return `${getElVarTemplate(id)}.setAttribute("${key}","${value}"});`;
  }
}

export function getElVarTemplate(id: number) {
  return `${VARIABLE_NAME}.$${id}`;
}

export function createElementTemplate(ast: HTMLElementAst, id: number) {
  return `$${id}: document.createElement("${ast.tag}")`;
}

export function createTextTemplate(ast: HTMLTextAst, id: number) {
  return `$${id}: document.createTextNode(${JSON.stringify(ast.text)})`;
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
