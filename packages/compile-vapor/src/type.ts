export interface AstCodeSnippetOptions {
  id: number;
  createSnippet: string;
  attributeSnippet: string;
  mount: string;
  parentId: number;
}
export interface SnippetOptions {
  createSnippet: string;
  appendSnippet: string;
  attributeSnippet: string;
}
export interface MarginSnippetOptions extends SnippetOptions {
  importSnippet: string;
  scriptSnippet: string;
}

export type ModuleImport = Record<string, Set<string>>;
