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
  ast: Node,
  nodeType: T
): ast is NodeTypeMap[T] {
  return ast.type === nodeType;
}
export class RootAst implements Node {
  type = NodeType.RootAst;
  constructor(private children: Node[]) {}
  getChildren(): Node[] {
    return this.children;
  }
}
export interface Node {
  type: NodeType;
  getChildren(): Node[] | null;
}
export class HTMLAst implements Node {
  type = NodeType.HTMLAst;
  constructor() {}
  getChildren(): Node[] | null {
    return null;
  }
}

export type HTMLAstChildren = Array<HTMLElementAst | HTMLTextAst>;
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

  getChildren(): Node[] {
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
  constructor(public sentence: string) {
    super();
  }
}
