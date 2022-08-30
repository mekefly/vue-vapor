import { HTMLAst } from "./HTMLAst";

export function genStack() {
  const stack: HTMLAst[] = [];
  let steakTop = new HTMLAst();
  function push() {
    const grandpa = steakTop;
    stack.push(steakTop);

    steakTop = new HTMLAst();
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
