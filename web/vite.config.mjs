import { defineConfig } from "npm:vite@^3.2.3"
import solid from "npm:vite-plugin-solid@^2.5.0"

import "solid-js"

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000
  },
  build: {
    target: "esnext",
  },
});
