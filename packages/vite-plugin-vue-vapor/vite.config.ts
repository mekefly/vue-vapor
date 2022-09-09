import { defineConfig } from "vite";
import vueVapor from "./src";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vueVapor()],
});
