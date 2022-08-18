import { defineConfig } from "vitest/config";
console.log("this is config");

export default defineConfig({
  test: { globals: true },
});
