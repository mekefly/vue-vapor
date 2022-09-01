import { resolve } from "path";
import {
  createCommendList,
  createDeclarationCommendList,
  createFormatCommendList,
  createInputCommendList,
  createNameCommendList,
  createOutputCommendList,
  createPackagePathCommendList,
  createProdCommendList,
} from "./createCommendList";

const packagePath = resolve("./");
describe("createCommendList", () => {
  test("createCommendList1", () => {
    const buildOptions = createCommendList(
      {
        inputPath: ["./src/index.ts"],
        workSpace: [], //当前函数无用,
        //过滤
        includePackages: [] as string[], //当前函数无用
        include: [], //当前函数无用
        packages: [], //当前函数无用
        output: "dist",
        format: ["cjs"],
        prod: ["true"],
        declaration: true,
      },
      {},
      packagePath
    );
    expect(buildOptions).toMatchInlineSnapshot(`
      [
        [
          "ROLLUP_BUILD_INPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\src\\\\index.ts",
          "ROLLUP_BUILD_FORMAT:cjs",
          "ROLLUP_BUILD_PROD:true",
          "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\dist.cjs.prod.js",
          "ROLLUP_BUILD_NAME:Dist",
          "ROLLUP_BUILD_PACKAGE_PATH:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor",
          "ROLLUP_BUILD_DECLARATION:true",
        ],
      ]
    `);
  });
  test("createCommendList2", () => {
    const buildOptions = createCommendList(
      {
        inputPath: ["./src/index.ts"],
        workSpace: [], //当前函数无用,
        //过滤
        includePackages: [] as string[], //当前函数无用
        include: [], //当前函数无用
        packages: [], //当前函数无用
        output: "dist",
        format: ["cjs"],
        prod: ["true", "false"],
        declaration: true,
      },
      {},
      packagePath
    );
    expect(buildOptions).toMatchInlineSnapshot(`
      [
        [
          "ROLLUP_BUILD_INPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\src\\\\index.ts",
          "ROLLUP_BUILD_FORMAT:cjs",
          "ROLLUP_BUILD_PROD:true",
          "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\dist.cjs.prod.js",
          "ROLLUP_BUILD_NAME:Dist",
          "ROLLUP_BUILD_PACKAGE_PATH:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor",
          "ROLLUP_BUILD_DECLARATION:false",
        ],
        [
          "ROLLUP_BUILD_INPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\src\\\\index.ts",
          "ROLLUP_BUILD_FORMAT:cjs",
          "ROLLUP_BUILD_PROD:false",
          "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\dist.cjs.js",
          "ROLLUP_BUILD_NAME:Dist",
          "ROLLUP_BUILD_PACKAGE_PATH:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor",
          "ROLLUP_BUILD_DECLARATION:false",
        ],
      ]
    `);
  });

  test("createCommendList3", () => {
    const buildOptions = createCommendList(
      {
        inputPath: ["./src/index.ts"],
        workSpace: [], //当前函数无用,
        //过滤
        includePackages: [] as string[], //当前函数无用
        include: [], //当前函数无用
        packages: [], //当前函数无用
        output: "dist",
        format: ["cjs", "esm"],
        prod: ["true"],
        declaration: true,
      },
      {},
      packagePath
    );
    expect(buildOptions).toMatchInlineSnapshot(`
      [
        [
          "ROLLUP_BUILD_INPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\src\\\\index.ts",
          "ROLLUP_BUILD_FORMAT:cjs",
          "ROLLUP_BUILD_PROD:true",
          "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\dist.cjs.prod.js",
          "ROLLUP_BUILD_NAME:Dist",
          "ROLLUP_BUILD_PACKAGE_PATH:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor",
          "ROLLUP_BUILD_DECLARATION:true",
        ],
        [
          "ROLLUP_BUILD_INPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\src\\\\index.ts",
          "ROLLUP_BUILD_FORMAT:esm",
          "ROLLUP_BUILD_PROD:true",
          "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\dist.esm.prod.js",
          "ROLLUP_BUILD_NAME:Dist",
          "ROLLUP_BUILD_PACKAGE_PATH:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor",
          "ROLLUP_BUILD_DECLARATION:true",
        ],
      ]
    `);
  });
  test("createCommendList4", () => {
    const buildOptions = createCommendList(
      {
        inputPath: ["./src/index.ts"],
        workSpace: [], //当前函数无用,
        //过滤
        includePackages: [] as string[], //当前函数无用
        include: [], //当前函数无用
        packages: [], //当前函数无用
        output: "dist",
        format: ["cjs", "esm", "iife"],
        prod: ["true", "false"],
        declaration: true,
      },
      {},
      packagePath
    );
    expect(buildOptions).toMatchSnapshot();
  });
});

test("createPackagePathCommendList", () => {
  expect(createPackagePathCommendList(resolve("./"))).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_PACKAGE_PATH:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor",
      ],
    ]
  `);
});
test("createDeclarationCommendList1", () => {
  expect(createDeclarationCommendList(true, false)).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_DECLARATION:true",
      ],
    ]
  `);
  expect(createDeclarationCommendList(false, false)).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_DECLARATION:false",
      ],
    ]
  `);
  expect(createDeclarationCommendList(true, true)).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_DECLARATION:false",
      ],
    ]
  `);
  expect(createDeclarationCommendList(false, true)).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_DECLARATION:false",
      ],
    ]
  `);
});

test("createNameCommendList1", () => {
  expect(createNameCommendList("name")).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_NAME:name",
      ],
    ]
  `);
});
test("createFormatCommendList2", () => {
  expect(createFormatCommendList(["cjs"])).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_FORMAT:cjs",
      ],
    ]
  `);
  expect(createFormatCommendList(["cjs", "esm"])).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_FORMAT:cjs",
      ],
      [
        "ROLLUP_BUILD_FORMAT:esm",
      ],
    ]
  `);
});
test("createInputCommendList3", () => {
  expect(createInputCommendList(packagePath, ["./src/index.ts"]))
    .toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_INPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\src\\\\index.ts",
      ],
    ]
  `);
  expect(
    createInputCommendList(packagePath, ["./src/index.ts", "./src/index.js"])
  ).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_INPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\src\\\\index.ts",
      ],
      [
        "ROLLUP_BUILD_INPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\src\\\\index.js",
      ],
    ]
  `);
});
test("createProdCommendList4", () => {
  expect(createProdCommendList(["true"])).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_PROD:true",
      ],
    ]
  `);
  expect(createProdCommendList(["false"])).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_PROD:false",
      ],
    ]
  `);
});
test("createOutputCommendList5", () => {
  expect(
    createOutputCommendList(packagePath, "dist", ["cjs"], "Name", ["true"])
  ).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_FORMAT:cjs",
        "ROLLUP_BUILD_PROD:true",
        "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\Name.cjs.prod.js",
      ],
    ]
  `);
  expect(
    createOutputCommendList(packagePath, "dist", ["cjs", "esm"], "Name", [
      "false",
    ])
  ).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_FORMAT:cjs",
        "ROLLUP_BUILD_PROD:false",
        "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\Name.cjs.js",
      ],
      [
        "ROLLUP_BUILD_FORMAT:esm",
        "ROLLUP_BUILD_PROD:false",
        "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\Name.esm.js",
      ],
    ]
  `);
  expect(
    createOutputCommendList(packagePath, "dist", ["cjs", "esm"], "Name", [
      "false",
      "true",
    ])
  ).toMatchInlineSnapshot(`
    [
      [
        "ROLLUP_BUILD_FORMAT:cjs",
        "ROLLUP_BUILD_PROD:false",
        "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\Name.cjs.js",
      ],
      [
        "ROLLUP_BUILD_FORMAT:esm",
        "ROLLUP_BUILD_PROD:false",
        "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\Name.esm.js",
      ],
      [
        "ROLLUP_BUILD_FORMAT:cjs",
        "ROLLUP_BUILD_PROD:true",
        "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\Name.cjs.prod.js",
      ],
      [
        "ROLLUP_BUILD_FORMAT:esm",
        "ROLLUP_BUILD_PROD:true",
        "ROLLUP_BUILD_OUTPUT:R:\\\\Users\\\\meke\\\\Documents\\\\study\\\\mini\\\\vue-vapor\\\\dist\\\\Name.esm.prod.js",
      ],
    ]
  `);
});
