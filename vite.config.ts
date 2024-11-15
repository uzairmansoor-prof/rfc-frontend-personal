import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 5173, // Change 3001 to your desired port
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
});
