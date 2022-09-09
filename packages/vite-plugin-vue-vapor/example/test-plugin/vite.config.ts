import vue from "@vitejs/plugin-vue";
import vueVapor from "@vue-vapor/vite-plugin-vue-vapor";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vueVapor(), vue()],
});
