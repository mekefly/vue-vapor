import { HTMLElementAst, HTMLTextAst } from "@vue-vapor/compile-core";
import {
  CONTEXT_VAR_NAME,
  CREATE_COMPONENT_FUNCTION_NAME,
  CREATE_ELEMENT_FUNCTION_NAME,
  CREATE_TEXT_FUNCTION_NAME,
  EFFECT_FUNCTION_NAME,
  ELEMENT_ARRAY_VAR_NAME,
} from "../constant";
import { AstCodeSnippetOptions, ModuleImport } from "../type";
import { ignoreEndWithEnter, indent } from "../utils";
import {
  addImport,
  createImportTemplate,
  moduleImport,
  moduleSnippets,
} from "./moduleTemplate";

export function moduleTemplate(importSnippet: string, setupSnippet: string) {
  importSnippet = marginImportSnippet(importSnippet, moduleImport);
  return `\
${ignoreEndWithEnter(importSnippet)}\n\n${[...moduleSnippets].join(
    "\n"
  )}${setupSnippet}\
`;
}

export function marginImportSnippet(
  importSnippet: string,
  moduleImport: ModuleImport
): string {
  return `\
${Object.entries(moduleImport)
  .map(([packageName, vars]) => createImportTemplate(vars, packageName))
  .join()}\
${importSnippet}`;
}

// prettier-ignore
export function setupSnippetTemplate(
  scriptSnippet: string,
  renderSnippet: string
) {
  return `\
export default function (props,${CONTEXT_VAR_NAME}){
${indent(`${ignoreEndWithEnter(scriptSnippet)}
(function(){
${indent(renderSnippet)}
})()`)}
}`;
}

// prettier-ignore
export function renderCodeSnippetTemplate(
  createSnippet: string,
  appendSnippet: string,
  attributeSnippet: string
) {
  return `\
${createSnippet}
${appendSnippet}
${ignoreEndWithEnter(attributeSnippet)}`;
}

export function createSnippetTemplate(codeSnippets: AstCodeSnippetOptions[]) {
  return `\
const ${ELEMENT_ARRAY_VAR_NAME} = ${CONTEXT_VAR_NAME}.el;
${codeSnippets.map((codeSnippet) => codeSnippet.createSnippet).join("")}\
`;
}

export function appendTemplate(parentId: number, ...ids: number[]) {
  return `${getElVarTemplate(parentId)}.append(${ids
    .map((id) => getElVarTemplate(id))
    .join(",")});\n`;
}

export function getElVarTemplate(id: number) {
  return `${ELEMENT_ARRAY_VAR_NAME}[${id}]`;
}


export function createComponentTemplate(
  ComponentName: string,
  parentId: number,
  id: number
) {
  return setElTemplate(
    id,
    `${CREATE_COMPONENT_FUNCTION_NAME}(${ComponentName},${getElVarTemplate(
      parentId
    )})`
  );
}

export function createTextTemplate(ast: HTMLTextAst, id: number) {
  return setElTemplate(
    id,
    `${CREATE_TEXT_FUNCTION_NAME}(${JSON.stringify(ast.text)})`
  );
}

export function createElementTemplate(ast: HTMLElementAst, id: number) {
  return setElTemplate(id, `${CREATE_ELEMENT_FUNCTION_NAME}("${ast.tag}")`);
}

export function createTemplateStatementTemplate(
  id: number,
  defaul: string = '""'
) {
  return setElTemplate(id, `${CREATE_TEXT_FUNCTION_NAME}(${defaul})`);
}

export function setElTemplate(id: number, snip: string) {
  return `${ELEMENT_ARRAY_VAR_NAME}[${id}] = ${snip};\n`;
}
