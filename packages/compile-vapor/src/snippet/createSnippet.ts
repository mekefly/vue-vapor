import {
  AstNode,
  HTMLElementAst,
  HTMLTemplateStatementAst,
  HTMLTextAst,
  NodeType,
  typeFor,
} from "@vue-vapor/compile-core";
import { CONTEXT_VAR_NAME } from "../constant";
import {
  appendTemplate,
  createComponentTemplate,
  createElementTemplate,
  createSnippetTemplate,
  createTemplateStatementTemplate,
  createTextTemplate,
  getElVarTemplate,
} from "../template";
import { addImport } from "../template/moduleTemplate";
import {
  componentPropsTemplate,
  elementPropTemplate,
} from "../template/propTemplate";
import { effectTemplate } from "../template/simpleTemplate";
import { AstCodeSnippetOptions, SnippetOptions } from "../type";
import { filterNoUndefined } from "../utils";

export function createSnippetOptionsByAst(ast: HTMLElementAst): SnippetOptions {
  const astList = createAstList(ast);

  const astSnippetOptionsList = createAstCodeSnippetOptionsList(astList);

  return createSnippetOptionsByAstSnippetOptionsList(astSnippetOptionsList);
}

export function createAstList(ast: HTMLElementAst): AstNode[] {
  const bfsAstList: AstNode[] = [ast];
  let id = 0;
  while (id < bfsAstList.length) {
    const bfsAst = bfsAstList[id];

    const children = bfsAst.getChildren();

    if (!children) {
      break;
    }

    children.forEach((child) => {
      bfsAstList.push(child);
      parentIdMap.set(child, id);
    });
    id++;
  }

  return bfsAstList;
}

function createAstCodeSnippetOptionsList(
  astList: AstNode[]
): AstCodeSnippetOptions[] {
  const { HTMLElementAst, HTMLTemplateStatementAst, HTMLTextAst } = NodeType;

  return filterNoUndefined(
    astList.map((ast, id) => {
      if (typeFor(ast, HTMLElementAst)) {
        return createElementAstCodeSnippetOptions(ast, id);
      } else if (typeFor(ast, HTMLTextAst)) {
        return createTextAstCodeSnippetOptions(ast, id);
      } else if (typeFor(ast, HTMLTemplateStatementAst)) {
        return createTemplateStatementAstCodeSnippetOptions(ast as any, id);
      } else {
        console.warn(`不适合的签: ${ast.type} id: ${id}`, ast);
      }
    })
  );
}

function createSnippetOptionsByAstSnippetOptionsList(
  codeSnippets: AstCodeSnippetOptions[]
): SnippetOptions {
  // 创建语句
  const createSnippet = createSnippetTemplate(codeSnippets);

  // append生成
  const appendSnippet = genAppendSnippet(codeSnippets);

  // 属性设置
  const attributeSnippet = codeSnippets
    .map((codeSnippet) => codeSnippet.attributeSnippet)
    .join("");
  return { createSnippet, appendSnippet, attributeSnippet };
}

function genAppendSnippet(codeSnippets: AstCodeSnippetOptions[]): string {
  const appendMap: number[][] = [];
  codeSnippets.forEach((codeSnippet) => {
    const appends = (appendMap[codeSnippet.parentId] =
      appendMap[codeSnippet.parentId] ?? []);
    appends.push(codeSnippet.id);
  });

  const appendSnippet = appendMap
    .map((ids, parentId) => appendTemplate(parentId, ...ids))
    .join("");
  return appendSnippet;
}

const parentIdMap = new Map<any, number>();
function createElementAstCodeSnippetOptions(
  ast: HTMLElementAst,
  id: number
): AstCodeSnippetOptions {
  const parentId = parentIdMap.get(ast) ?? -1;
  if (ast.tag === "template") {
    return createRootTemplateCodeSnippetOptions(parentId, id);
  }

  if (/[A-Z]/.test(ast.tag.slice(0, 1))) {
    return createComponentCodeSnippetOptions(parentId, id, ast);
  }

  return createElementCodeSnippetOptions(parentId, id, ast);
}

function createTextAstCodeSnippetOptions(ast: HTMLTextAst, id: number) {
  const parentId = parentIdMap.get(ast) ?? -1;
  return {
    parentId,
    id,
    createSnippet: createTextTemplate(ast, id),
    attributeSnippet: ``,
    mount: appendTemplate(parentId, id),
  };
}
function createTemplateStatementAstCodeSnippetOptions(
  ast: HTMLTemplateStatementAst,
  id: number
) {
  const parentId = parentIdMap.get(ast) ?? -1;
  addImport("@vue/reactivity", "unref");

  return {
    parentId,
    id,
    createSnippet: createTemplateStatementTemplate(id, "''"),
    attributeSnippet: effectTemplate(
      `${getElVarTemplate(id)}.nodeValue = String(unref(${ast.snippet}))`
    ),
    mount: appendTemplate(parentId, id),
  };
}

function createRootTemplateCodeSnippetOptions(
  parentId: number,
  id: number
): AstCodeSnippetOptions {
  return {
    parentId,
    id,
    createSnippet: `${getElVarTemplate(0)} = ${CONTEXT_VAR_NAME}.parentEl;\n`,
    attributeSnippet: "",
    mount: "",
  };
}
function createComponentCodeSnippetOptions(
  parentId: number,
  id: number,
  ast: HTMLElementAst
): AstCodeSnippetOptions {
  return {
    parentId,
    id,
    createSnippet: createComponentTemplate(ast.tag, parentId, id),
    attributeSnippet: effectTemplate(componentPropsTemplate(ast, id)),
    mount: "",
  };
}

function createElementCodeSnippetOptions(
  parentId: number,
  id: number,
  ast: HTMLElementAst
): AstCodeSnippetOptions {
  return {
    parentId,
    id,
    createSnippet: createElementTemplate(ast, id),
    attributeSnippet: effectTemplate(
      Object.entries(ast.props)
        .map(([key, value]) => elementPropTemplate(id, key, value))
        .join("")
    ),
    mount: appendTemplate(parentId, id),
  };
}
