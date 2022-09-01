import { createPlugin } from "./createPlugin";
export function createConfig(options) {
  const { input, output, name, format } = options;
  const plugins = createPlugin(options);
  return {
    input,
    plugins: plugins,
    output: {
      file: output,
      format,
      name,
    },
  };
}
