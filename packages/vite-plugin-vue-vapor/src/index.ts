import { compileSFCByText } from "@vue-vapor/compile-sfc";
import { codegen } from "@vue-vapor/compile-vapor";
import { createFilter, Plugin } from "vite";
import { parseVueRequest } from "./utils/query";
export interface Options {
  include?: string | RegExp | (string | RegExp)[];
  exclude?: string | RegExp | (string | RegExp)[];
}
export default function (options: Options = {}): Plugin {
  const { include = /\.vue$/, exclude } = options ?? {};
  const filter = createFilter(include, exclude);
  return {
    name: "vue-vapor",
    transform(code, id, opt) {
      const ssr = opt?.ssr === true;
      const { filename, query } = parseVueRequest(id);
      if (query.raw) {
        return;
      }
      if (filter(id)) {
        const sfc = compileSFCByText(code);
        if (sfc.setup && sfc.vapor) {
          const newCode = codegen(sfc);

          return newCode;
        } else {
          return;
        }
      }
    },
  };
}
