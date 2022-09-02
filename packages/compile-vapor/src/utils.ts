export const INDENT_UNIT = 2;

/**
 * 控制代码缩进
 *
 * @export
 * @param {string} snippets 代码段
 * @param {number} num 正数为增加缩进，负数为减少缩进
 */
export function indent(snippets: string, num: number = 1) {
  const isPN = num >= 0;
  const spaces = space((num = isPN ? num : -num) * INDENT_UNIT);

  const callback: (s: string) => string = isPN
    ? // 正数增加空格
      (snippet) => `${spaces}${snippet}`
    : // 负数减少空格
      (snippet) => (snippet.startsWith(spaces) ? snippet.slice(-num) : snippet);

  return snippets.split("\n").map(callback).join("\n");
}
export function space(num: number) {
  return "".padStart(num, " ");
}

export function spaceDisplay(str: string, invalid: boolean = false) {
  if (invalid) return;
  return str.replaceAll(" ", "_");
}
