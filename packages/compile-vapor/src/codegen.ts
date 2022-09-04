import { SFC } from "@vue-vapor/compile-sfc";
import { createSnippetOptionsByAst } from "./snippet/createSnippet";
import {
  moduleTemplate,
  renderCodeSnippetTemplate,
  setupSnippetTemplate,
} from "./template";
import { MarginSnippetOptions } from "./type";

export function codegen(sfc: SFC) {
  if (!(sfc.setup && sfc.vapor))
    throw new Error("这里无法处理，你可以使用 `@vue-vapor/compile-core` 试试");

  const snippetsOptions = createSnippetOptionsByAst(sfc.template);
  const importSnippet = sfc.importSnippets.join("\n");
  const scriptSnippet = sfc.script;
  const code = marginSnippet({
    importSnippet,
    scriptSnippet,
    ...snippetsOptions,
  });
  return format(code);
}

export function format(code: string) {
  return code;
}

export function marginSnippet(options: MarginSnippetOptions) {
  const {
    createSnippet,
    appendSnippet,
    attributeSnippet,
    importSnippet,
    scriptSnippet,
  } = options;
  return moduleTemplate(
    importSnippet,
    setupSnippetTemplate(
      scriptSnippet,
      renderCodeSnippetTemplate(createSnippet, appendSnippet, attributeSnippet)
    )
  );
}
