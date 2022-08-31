import { Node, NodeType } from "../ast";
import { Callbacks } from "./types";

export function traverser(ast: Node, callbacks: Callbacks<true>) {
  const cs = standardization(callbacks);

  traverserNode(ast, cs);
}

function standardization(callbacks: Callbacks<true>): Callbacks {
  Object.keys(callbacks).forEach((key) => {
    const value = (callbacks as any)[key];
    if (typeof value === "function") {
      (callbacks as any)[key] = { enter: value };
    }
  });
  return callbacks as any;
}

function traverserArray(nodes: Node[] | null, callbacks: Callbacks) {
  if (nodes === null) {
    return;
  }
  for (const node of nodes) {
    traverserNode(node, callbacks);
  }
}
function traverserNode(ast: Node | null, callbacks: Callbacks) {
  const {
    HTMLAst,
    HTMLElementAst,
    HTMLTextAst,
    HTMLTemplateStatementAst,
    RootAst,
  } = NodeType;
  if (ast === null) {
    return;
  }
  const callback = callbacks[ast.type];

  callback?.enter?.(ast as any);

  traverserArray(ast.getChildren(), callbacks);

  callback?.leave?.(ast as any);
}
