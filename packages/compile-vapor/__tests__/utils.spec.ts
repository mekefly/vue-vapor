import { indent, space, spaceDisplay } from "../src/utils";

describe("utils", () => {
  test("space", () => {
    expect(space(0)).toMatchInlineSnapshot('""');
    expect(space(1)).toMatchInlineSnapshot('" "');
    expect(space(2)).toMatchInlineSnapshot('"  "');
    expect(space(-0)).toMatchInlineSnapshot('""');
    expect(space(-1)).toMatchInlineSnapshot('""');
    expect(space(-2)).toMatchInlineSnapshot('""');
  });
  test("indent", () => {
    const s1 = "const xxx = '1';";
    expect(indent(s1).replaceAll(" ", "_")).toMatchInlineSnapshot(
      "\"__const_xxx_=_'1';\""
    );
    expect(indent(`${s1}\n${s1}`).replaceAll(" ", "_")).toMatchInlineSnapshot(
      `
      "__const_xxx_=_'1';
      __const_xxx_=_'1';"
    `
    );
    const s2 = `function(){\n${indent(`${s1}`)}\n}`;

    expect(spaceDisplay(s2)).toMatchInlineSnapshot(`
      "function(){
      __const_xxx_=_'1';
      }"
    `);

    const s3 = `function(){\n${indent(s2)}\n}`;
    expect(spaceDisplay(s3)).toMatchInlineSnapshot(`
      "function(){
      __function(){
      ____const_xxx_=_'1';
      __}
      }"
    `);
  });
});

