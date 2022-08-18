import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import ts from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import path from "path";
import { babel } from "@rollup/plugin-babel";
import packageJson from "./package.json";
/**
 * 驼峰命名
 */
function camelize(str) {
  const camelizeRE = /-(\w)/g;
  return str.replace(camelizeRE, (_, r) => r.toUpperCase());
}
/**
 *首字母大写
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const name = packageJson.shortName;

const moduleDir = path.resolve(__dirname, "./");

const getPath = (_path) => path.resolve(moduleDir, _path);

const buildOptions = ["cjs", "esm", "iife"];

function genFileName(format, name, isProd) {
  const prefix = getPath("dist");
  const middle = `.${format}`;
  const suffix = isProd ? ".prod.js" : ".js";
  return path.resolve(prefix, name + middle + suffix);
}

function createConfig(format, isProd = false) {
  const output = {
    file: genFileName(format, name, isProd),
    format: format,
    name: capitalize(camelize(name)),
  };

  return {
    input: getPath("./src/index.ts"),
    plugins: createPlugin(name, isProd),
    output,
  };
}

function defIfProdGet(isProd) {
  return function ifProdGet(fn, fn2 = () => undefined) {
    return isProd ? fn() : fn2();
  };
}

function createReplacePlugin(isProd) {
  const isDEV = !isProd;
  return replace({
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
let isDeclaration = false;

const babelPlugin = babel({
  babelHelpers: "bundled",
  exclude: "node_modules/**",
});

function createPlugin(format, isProd) {
  // const ifProdGet = defIfProdGet(isProd)

  const isSourceMap = !isProd;
  const ret = [];

  if (!isProd) {
    isDeclaration = true;
  }
  ret.push(
    ts({
      tsconfig: getPath("./tsconfig.json"), // 导入本地ts配置
      tsconfigOverride: {
        compilerOptions: {
          module: "esnext",
          sourceMap: isSourceMap,
          removeComments: isProd,
          declaration: isDeclaration,
          declarationMap: isDeclaration,
        },
        exclude: [
          "**/__tests__",
          "test-dts",
          "src/test/**",
          "src/codeGenerator/*",
        ],
      },
    })
  );
  if (!isProd) {
    isDeclaration = false;
  }
  ret.push(createReplacePlugin(isProd));

  ret.push(resolve(["js", "ts", "json"]));

  ret.push(
    commonjs({
      sourceMap: isSourceMap,
    })
  );

  ret.push(babelPlugin);

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

const buildConfig = [];

function createConfigList(isProd = false) {
  buildOptions.forEach((format) => {
    buildConfig.push(createConfig(format, isProd));
  });
}

if (process.env.NODE_ENV === "production") {
  createConfigList(true);
} else {
  createConfigList(false);
}

export default buildConfig;
