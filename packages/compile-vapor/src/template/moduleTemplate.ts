import {
  ADD_EVENT_LISTENER_FUNCTION_NAME,
  CREATE_COMPONENT_FUNCTION_NAME,
  CREATE_ELEMENT_FUNCTION_NAME,
  CREATE_TEXT_FUNCTION_NAME,
  SET_ATTRIBUTE_FUNCTION_NAME,
} from "../constant";
import { ModuleImport } from "../type";

export const moduleImport: ModuleImport = {};
export const moduleSnippets: Set<string> = new Set();

export function addImport<T extends `@${`vue${`/reactivity` | `-vapor`}`}`>(
  packageName: T,
  ...varName: string[]
) {
  const compileImportDeps =
    moduleImport[packageName] ?? (moduleImport[packageName] = new Set());

  varName.forEach((item) => compileImportDeps.add(item));
}

export function createImportTemplate(
  vars: string[] | Set<string>,
  packageName: string
): string {
  return `import { ${[...vars].join(",")} } from "${packageName}";\n`;
}

moduleSnippets.add(
  `const ${SET_ATTRIBUTE_FUNCTION_NAME} = (e, key, value)=>e.setAttribute(key, value);`
);
moduleSnippets.add(
  `const ${ADD_EVENT_LISTENER_FUNCTION_NAME} = (e, key, value)=>e.addEventListener(key, value);`
);
moduleSnippets.add(
  `const ${CREATE_ELEMENT_FUNCTION_NAME} = document.createElement.bind(document);`
);
moduleSnippets.add(
  `const ${CREATE_TEXT_FUNCTION_NAME} = document.createTextNode.bind(document);`
);

moduleSnippets.add(`
const ${CREATE_COMPONENT_FUNCTION_NAME} = (Component, parentEl) => {
  const instance = {
    Component,
    props: {},
    el:[],
    parentEl,
    emit(type,value){
      this.props[${"`@${type}`"}]?.(value)
    }
  };
  Component(instance.props, instance);
  return instance;
};
`);
