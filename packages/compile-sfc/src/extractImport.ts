import { findStaticImports } from "mlly";
export function findInput(script: string) {
  return findStaticImports(script);
}

export function extractImport(script: string) {
  const importSnippets: string[] = [];
  const scripts: string[] = [];
  let local: number[] = [];

  findInput(script).forEach((s) => {
    local.push(s.start, s.end);
  });
  local.push(script.length);

  let last = 0;
  local.forEach((local, index) => {
    if (index % 2 === 0) {
      scripts.push(script.slice(last, local));
    } else {
      importSnippets.push(script.slice(last, local));
    }
    last = local;
  });

  return { script: scripts.join(""), importSnippets };
}
