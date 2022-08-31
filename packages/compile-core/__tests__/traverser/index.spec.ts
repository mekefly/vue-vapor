import {
  HTMLElementAst,
  HTMLTextAst,
  RootAst,
} from "packages/compile-core/src/ast";
import { traverser } from "packages/compile-core/src/traverser";

describe("traverser", () => {
  test("简化写法回调", () => {
    traverser(new HTMLTextAst("hello"), {
      HTMLTextAst(ast) {
        expect(ast).toMatchInlineSnapshot(`
          HTMLTextAst {
            "text": "hello",
            "type": "HTMLTextAst",
          }
        `);
      },
    });
  });
  test("回调", () => {
    traverser(new HTMLTextAst("hello"), {
      HTMLTextAst: {
        enter(ast) {
          expect(ast).toMatchInlineSnapshot(`
            HTMLTextAst {
              "text": "hello",
              "type": "HTMLTextAst",
            }
          `);
        },
      },
    });
  });
  test("顺序", () => {
    const logs: string[] = [];
    traverser(
      new RootAst([
        new HTMLTextAst("hello"),
        new HTMLElementAst("div", {}, [new HTMLTextAst("hello")]),
      ]),
      {
        RootAst: {
          enter() {
            logs.push("RootAst:enter");
          },
          leave() {
            logs.push("RootAst:leave");
          },
        },
        HTMLTextAst: {
          enter() {
            logs.push("HTMLTextAst:enter");
          },
          leave() {
            logs.push("HTMLTextAst:leave");
          },
        },
        HTMLElementAst: {
          enter() {
            logs.push("HTMLElementAst:enter");
          },
          leave() {
            logs.push("HTMLElementAst:leave");
          },
        },
      }
    );
    expect(logs).toMatchInlineSnapshot(`
      [
        "RootAst:enter",
        "HTMLTextAst:enter",
        "HTMLTextAst:leave",
        "HTMLElementAst:enter",
        "HTMLTextAst:enter",
        "HTMLTextAst:leave",
        "HTMLElementAst:leave",
        "RootAst:leave",
      ]
    `);
  });
});
