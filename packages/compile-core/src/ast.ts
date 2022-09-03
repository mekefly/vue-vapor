export enum NodeType {
  HTMLAst = "HTMLAst",
  HTMLElementAst = "HTMLElementAst",
  HTMLTextAst = "HTMLTextAst",
  HTMLTemplateStatementAst = "HTMLTemplateStatementAst",
  RootAst = "RootAst",
}
export type NodeTypeMap = {
  HTMLAst: HTMLAst;
  HTMLElementAst: HTMLElementAst;
  HTMLTextAst: HTMLTextAst;
  HTMLTemplateStatementAst: HTMLTemplateStatementAst;
  RootAst: RootAst;
};
export function typeFor<T extends NodeType>(
  ast: AstNode,
  nodeType: T
): ast is NodeTypeMap[T] {
  return ast.type === nodeType;
}
export class RootAst implements AstNode {
  type = NodeType.RootAst;
  constructor(private children: AstNode[]) {}
  getChildren(): AstNode[] {
    return this.children;
  }
}
export interface AstNode {
  type: NodeType;
  getChildren(): AstNode[] | null;
}
export class HTMLAst implements AstNode {
  type = NodeType.HTMLAst;
  constructor() {}
  getChildren(): AstNode[] {
    return [];
  }
}

export type HTMLAstChildren = Array<
  HTMLElementAst | HTMLTextAst | HTMLTemplateStatementAst
>;
export class HTMLElementAst extends HTMLAst {
  type = NodeType.HTMLElementAst;
  tag: string;
  props: Record<string, string>;
  children: HTMLAstChildren;
  constructor(
    type: string = "",
    props: Record<string, string> = {},
    children: HTMLAstChildren = []
  ) {
    super();
    this.tag = type;
    this.props = props;
    this.children = children;
  }

  getChildren(): AstNode[] {
    return this.children;
  }
}
export class HTMLTextAst extends HTMLAst {
  type = NodeType.HTMLTextAst;
  constructor(public text: string) {
    super();
  }
}
export class HTMLTemplateStatementAst extends HTMLAst {
  type = NodeType.HTMLTemplateStatementAst;
  getChildren(): AstNode[] {
    return [];
  }
  constructor(public snippet: string) {
    super();
  }
}
