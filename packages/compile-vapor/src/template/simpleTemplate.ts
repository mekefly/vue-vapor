import { EFFECT_FUNCTION_NAME } from "../constant";
import { ignoreEndWithEnter, indent } from "../utils";
import { addImport } from "./moduleTemplate";

export function stringTemplate(value: string) {
  return `String(${value})`;
}
export function unrefTemplate(value: string): string {
  return `unref(${value})`;
}
export function effectTemplate(snippet: string) {
  if (!snippet) return "";
  addImport("@vue/reactivity", EFFECT_FUNCTION_NAME);

  return `${EFFECT_FUNCTION_NAME}(()=>{\n${indent(
    ignoreEndWithEnter(snippet)
  )}\n});\n`;
}
