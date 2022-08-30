import { HTMLAstChildren } from "./index";

export class HTMLAst {
  type: string;
  props: Record<string, string>;
  children: HTMLAstChildren;
  constructor(
    type: string = "",
    props: Record<string, string> = {},
    children: HTMLAstChildren = []
  ) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}
