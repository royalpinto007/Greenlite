import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The control tower is served under /app by the Greenlite worker, so all
// asset URLs and the router basename are prefixed with /app. The build is
// emitted straight into the deploy folder (../dist/app).
export default defineConfig({
  base: "/app/",
  plugins: [react()],
  build: {
    outDir: "../dist/app",
    emptyOutDir: true,
  },
});
