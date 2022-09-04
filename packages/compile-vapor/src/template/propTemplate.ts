import { HTMLElementAst } from "@vue-vapor/compile-core";
import {
  ADD_EVENT_LISTENER_FUNCTION_NAME,
  SET_ATTRIBUTE_FUNCTION_NAME,
} from "../constant";
import { addImport } from "./moduleTemplate";
import { stringTemplate, unrefTemplate } from "./simpleTemplate";
import { getElVarTemplate } from ".";

export function elementPropTemplate(id: number, key: string, value: string) {
  const dyn = ["@", ":", "v-"].some((item) => key.startsWith(item));
  addImport("@vue/reactivity", "unref");

  const { DYN, EVENT } = PropType;
  switch (propTypeOf(key)) {
    case DYN:
      return setElementPropKeyValueTemplate(
        id,
        key.slice(1),
        stringTemplate(unrefTemplate(value))
      );
    case EVENT:
      return addEventTemplate(id, key, value);
    default:
      return setElementPropKeyValueTemplate(id, key, `"${value}"`);
  }
}

function addEventTemplate(id: number, key: string, value: string) {
  return `${ADD_EVENT_LISTENER_FUNCTION_NAME}(${getElVarTemplate(
    id
  )},"${key.slice(1)}",${value});\n`;
}

function setElementPropKeyValueTemplate(
  id: number,
  keySnip: string,
  valueSnip: string
) {
  return `${SET_ATTRIBUTE_FUNCTION_NAME}(${getElVarTemplate(
    id
  )},"${keySnip}",${valueSnip});\n`;
}

export function componentPropsTemplate(
  ast: HTMLElementAst,
  id: number
): string {
  return Object.entries(ast.props)
    .map(([k, v]) => `${componentPropTemplate(k, v, id)}`)
    .join("");
}

export function componentPropTemplate(k: string, v: string, id: number) {
  const snip = componentPropValueTemplate(k, v);
  return `${getElVarTemplate(id)}.props['${snip.key}'] = ${snip.value};\n`;
}

export function componentPropValueTemplate(keySnip: string, valueSnip: string) {
  const { DYN, EVENT } = PropType;
  switch (propTypeOf(keySnip)) {
    case DYN:
      return { key: `${keySnip.slice(1)}`, value: unrefTemplate(valueSnip) };
    case EVENT:
      return { key: `${keySnip}`, value: valueSnip };
    default:
      return { key: `${keySnip}`, value: `'${valueSnip}'` };
  }
}
export enum PropType {
  DYN,
  EVENT,
  TEXT,
}
export function propTypeOf(key: string) {
  if (key.startsWith(":")) {
    return PropType.DYN;
  } else if (key.startsWith("@")) {
    return PropType.EVENT;
  } else {
    return PropType.TEXT;
  }
}
