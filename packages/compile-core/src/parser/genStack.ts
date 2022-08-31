import { HTMLElementAst } from "../ast";

export function genStack() {
  const stack: HTMLElementAst[] = [];
  let steakTop = new HTMLElementAst();
  function push() {
    const grandpa = steakTop;
    stack.push(steakTop);

    steakTop = new HTMLElementAst();
    grandpa.children.push(steakTop);
  }
  function pop() {
    const value = stack.pop();
    if (!value) {
      throw new Error("多出来的");
    }
    steakTop = value;
  }
  function getStackTop() {
    return steakTop;
  }
  function getLength() {
    return stack.length;
  }
  return { push, pop, getStackTop, getLength };
}
