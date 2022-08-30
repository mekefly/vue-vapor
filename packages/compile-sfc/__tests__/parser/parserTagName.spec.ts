import { parserTagName } from "packages/compile-sfc/src/parser/parserTagName";

describe("parserTagName", () => {
  test("<div>", ({ meta: { name } }) => {
    const current = 1;
    const value = parserTagName(name, current);
    expect(value).toEqual({ char: ">", current: 4, type: "div" });
  });
  test("<div >", ({ meta: { name } }) => {
    const current = 1;
    const value = parserTagName(name, current);
    expect(value).toEqual({ char: " ", current: 4, type: "div" });
  });
});
