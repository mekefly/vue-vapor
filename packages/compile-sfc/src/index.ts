import {
  AstNode,
  HTMLElementAst,
  parser,
  traverser,
} from "@vue-vapor/compile-core";
import { extractImport } from "./extractImport";
// import { codegen as vaporCodegen } from "@vue-vapor/compile-vapor";

// export function codegen(ast: AstNode) {
//   const sfc = compileSFC(ast);
//   if (sfc.vapor && sfc.setup) {
//     vaporCodegen(sfc);
//   } else {
//     throw new Error("");
//   }
// }
export function compileSFCByText(text: string) {
  const ast = parser(text);
  compileSFC(ast);
}
export type SFC = {
  template: HTMLElementAst;
  script: string;
  importSnippets: string[];
  style: string;
  vapor: boolean;
  setup: boolean;
};
export function compileSFC(ast: AstNode): SFC {
  let template: HTMLElementAst | undefined = new HTMLElementAst("template");
  let script: string = "";
  let style: string = "";
  let setup = true;
  let vapor = true;
  traverser(ast, {
    HTMLElementAst(ast) {
      switch (ast.tag) {
        case "template":
          template = ast;
          break;
        case "style":
          style = astGetTests(ast, style);
          break;
        case "script":
          script = astGetTests(ast, style);
          setup = !!ast.props.setup;
          vapor = !!ast.props.vapor;
          break;
        default:
          break;
      }
    },
  });
  return {
    template,
    style,
    setup,
    vapor,
    ...extractImport(script),
  };
}
function astGetTests(ast: HTMLElementAst, style: string) {
  traverser(ast, {
    HTMLTextAst(ast) {
      style += ast.text;
    },
  });
  return style;
}
