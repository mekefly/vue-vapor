import { createOptions, includeDir, parseCliOptions } from "./buildOptions";

test("includeDir", () => {
  expect(includeDir(["xxx/yyy/zzz", "yyy"], [])).toMatchInlineSnapshot(`
    [
      "xxx/yyy/zzz",
      "yyy",
    ]
  `);
  expect(includeDir(["xxx/yyy/zzz", "/home/user/"], ["zzz"]))
    .toMatchInlineSnapshot(`
    [
      "xxx/yyy/zzz",
    ]
  `);
});
test("parseCliOptions", () => {
  const value = parseCliOptions({ workSpace: "packages,path" }, {
    workSpace: ["packages"],
  } as any);
  expect(value).toMatchInlineSnapshot(`
    {
      "workSpace": [
        "packages",
        "path",
      ],
    }
  `);
});
test("parseCliOptions1", () => {
  const value = parseCliOptions(
    { workSpace: "packages,path", output: "newDist" },
    {
      workSpace: ["packages"],
      output: "dist",
    } as any
  );
  expect(value).toMatchInlineSnapshot(`
    {
      "output": "newDist",
      "workSpace": [
        "packages",
        "path",
      ],
    }
  `);
});
test("createOptions", () => {
  expect(createOptions({})).toMatchInlineSnapshot(`
    {
      "declaration": true,
      "format": [
        "cjs",
        "esm",
        "iife",
      ],
      "include": [],
      "includePackages": [],
      "inputPath": [
        "./src/index.ts",
      ],
      "output": "dist",
      "packages": [
        "R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\packages\\\\compile-core",
        "R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor",
      ],
      "prod": [
        "true",
        "false",
      ],
      "workSpace": [
        "packages",
      ],
    }
  `);
});
