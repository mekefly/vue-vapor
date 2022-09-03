import {
  AstNode,
  HTMLElementAst,
  HTMLTemplateStatementAst,
  HTMLTextAst,
  NodeType,
  typeFor,
} from "@vue-vapor/compile-core";
import { SFC } from "@vue-vapor/compile-sfc";
import {
  addImport,
  appendTemplate,
  createElementTemplate,
  createSnippetTemplate,
  createTemplateStatementTemplate,
  createTextTemplate,
  createWatchEffectSnippet,
  getElVarTemplate,
  moduleSnippetTemplate,
  renderCodeSnippetTemplate,
  setAttributeTemplate,
  setupSnippetTemplate,
} from "./template";
import { CodeSnippet } from "./type";

export function codegen(sfc: SFC) {
  if (!(sfc.setup && sfc.vapor))
    throw new Error("这里无法处理，你可以使用 `@vue-vapor/compile-core` 试试");

  const snippetsOptions = createSnippetsByAst(sfc.template);
  const code = marginSFC(sfc, snippetsOptions as any);
  return format(code);
}
function format(code: string) {
  return code.replaceAll(/\s{0,}$/g, "");
}

function marginSFC(
  sfc: SFC,
  { createSnippet, appendSnippet, attributeSnippet }: RenderSnippetOption
) {
  return moduleSnippetTemplate(
    sfc.importSnippets.join("\n"),
    setupSnippetTemplate(
      sfc.script,
      renderCodeSnippetTemplate(createSnippet, appendSnippet, attributeSnippet)
    )
  );
}

const parentIdMap = new Map<any, number>();

type RenderSnippetOption = {
  createSnippet: string;
  appendSnippet: string;
  attributeSnippet: string;
};
function createSnippetsByAst(ast: HTMLElementAst): RenderSnippetOption {
  const astList = genAstList(ast);

  const astNodeList = genAstNodeList(astList);

  return createSnippets(astNodeList);
}

function genAstNodeList(astList: AstNode[]) {
  const { HTMLElementAst, HTMLTemplateStatementAst, HTMLTextAst } = NodeType;

  return astList.map((ast, id) => {
    if (typeFor(ast, HTMLElementAst)) {
      return createCodeSnippetByEl(ast, id);
    } else if (typeFor(ast, HTMLTextAst)) {
      return createCodeSnippetByText(ast, id);
    } else if (typeFor(ast, HTMLTemplateStatementAst)) {
      return createCodeSnippetByTemplateStatement(ast as any, id);
    }

    throw new Error(`不适合的签: ${ast.type}`);
  });
}
function createCodeSnippetByTemplateStatement(
  ast: HTMLTemplateStatementAst,
  id: number
) {
  const parentId = parentIdMap.get(ast) ?? -1;
  addImport("@vue/reactivity", "unref");

  return {
    parentId,
    id,
    createSnippet: createTemplateStatementTemplate(id, "''"),
    attributeSnippet: createWatchEffectSnippet(
      `${getElVarTemplate(id)}.nodeValue = String(unref(${ast.snippet}))`
    ),
    mount: appendTemplate(parentId, id),
  };
}

function createSnippets(codeSnippets: CodeSnippet[]): {
  createSnippet: string;
  appendSnippet: string;
  attributeSnippet: string;
} {
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

function genAppendSnippet(codeSnippets: CodeSnippet[]): string {
  const appendMap: number[][] = [];
  codeSnippets.forEach((codeSnippet) => {
    const appends = (appendMap[codeSnippet.parentId] =
      appendMap[codeSnippet.parentId] ?? []);
    appends.push(codeSnippet.id);
  });

  const appendSnippet = appendMap
    .map((ids, parentId) => appendTemplate(parentId, ...ids))
    .join("\n");
  return appendSnippet;
}

export function genAstList(ast: HTMLElementAst): AstNode[] {
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

function createCodeSnippetByEl(ast: HTMLElementAst, id: number): CodeSnippet {
  const parentId = parentIdMap.get(ast) ?? -1;
  if (ast.tag === "template") {
    return {
      parentId,
      id,
      createSnippet: `$0:context.parentEl`,
      attributeSnippet: "",
      mount: "",
    };
  }
  return {
    parentId,
    id,
    createSnippet: createElementTemplate(ast, id),
    attributeSnippet: createWatchEffectSnippet(
      Object.entries(ast.props)
        .map(([key, value]) => setAttributeTemplate(id, key, value))
        .join("")
    ),
    mount: appendTemplate(parentId, id),
  };
}
function createCodeSnippetByText(ast: HTMLTextAst, id: number) {
  const parentId = parentIdMap.get(ast) ?? -1;
  return {
    parentId,
    id,
    createSnippet: createTextTemplate(ast, id),
    attributeSnippet: ``,
    mount: appendTemplate(parentId, id),
  };
}
