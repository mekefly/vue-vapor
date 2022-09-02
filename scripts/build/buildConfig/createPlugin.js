import pluginNodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import { resolve as pathResolve, resolve } from "path";
import { terser } from "rollup-plugin-terser";
import ts from "rollup-plugin-typescript2";

// 可能会用到的
// import pluginNodeResolve from "@rollup/plugin-node-resolve";
// import replace from "@rollup/plugin-replace";
// import commonjs from "@rollup/plugin-commonjs";
// import ts from "rollup-plugin-typescript2";
// import { terser } from "rollup-plugin-terser";
// import path from "path";
// import { babel } from "@rollup/plugin-babel";
// import packageJson from "./package.json";

export function createPlugin({
  input: inputPath,
  format,
  prod: isProd = false,
  declaration = true,
  packagePath,
  output,
  packageJson,
}) {
  function packageRelativePathResolve(path) {
    return resolve(packagePath, path);
  }
  const isSourceMap = !isProd;
  const ret = [];

  ret.push(
    ts({
      tsconfig: pathResolve("scripts/build/buildConfig/tsconfig.json"),
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          module: "esnext",
          baseUrl: packagePath,
          rootDir: packageRelativePathResolve("src"),
          removeComments: isProd,
          sourceMap: true,
          declaration: declaration,
          declarationMap: declaration,
          declarationDir: packageRelativePathResolve("dist/types"),
          noUnusedLocals: false, //未使用的报错
        },
        include: [packageRelativePathResolve("./src")],
        exclude: ["node_modules"],
      },
    })
  );
  ret.push(createReplacePlugin(isProd, packageJson));

  ret.push(pluginNodeResolve(["js", "ts", "json"]));

  // ret.push(babelPlugin);
  if (isProd) {
    ret.push(
      terser({
        module: /esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true,
        },
        safari10: true,
        format: {
          comments: function () {
            return false;
          },
        },
      })
    );
  }

  return ret;
}

export function createReplacePlugin(isProd, packageJson) {
  const isDEV = !isProd;
  return replace({
    preventAssignment: true,
    values: {
      "global.__DEV__ = true": "",
      "global.__PROD__ = false": "",
      __DEV__: isDEV,
      __PROD__: isProd,
      "false || ": "",
      __VERSION__: packageJson.version,
    },
  });
}
