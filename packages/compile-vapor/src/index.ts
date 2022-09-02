import {
  AstNode,
  HTMLElementAst,
  HTMLTextAst,
  NodeType,
  typeFor,
} from "@vue-vapor/compile-core";
import { SFC } from "@vue-vapor/compile-sfc";
import {
  appendTemplate,
  createElementTemplate,
  createSnippetTemplate,
  createTextTemplate,
  createWatchEffectSnippet,
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
  return marginSFC(sfc, snippetsOptions as any);
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
      throw new Error("todo");
    }
    throw new Error("不适合的标签");
  });
}

function createSnippets(codeSnippets: CodeSnippet[]) {
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

function genAppendSnippet(codeSnippets: CodeSnippet[]) {
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

function genAstList(ast: HTMLElementAst) {
  const bfsAstList: AstNode[] = [...ast.children];
  bfsAstList.forEach((ast, i) => {
    const id = i + 1;
    const children = ast.getChildren();
    if (!children) {
      return;
    }
    children.forEach((child) => {
      bfsAstList.push(child);
      parentIdMap.set(child, id);
    });
  });
  return bfsAstList;
}

function createCodeSnippetByEl(ast: HTMLElementAst, id: number): CodeSnippet {
  const parentId = parentIdMap.get(ast) ?? 0;

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
  const parentId = parentIdMap.get(ast) ?? 0;
  return {
    parentId,
    id,
    createSnippet: createTextTemplate(ast, id),
    attributeSnippet: ``,
    mount: appendTemplate(parentId, id),
  };
}
