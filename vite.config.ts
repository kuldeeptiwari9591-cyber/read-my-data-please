// Default build emits dist/ (Lovable). Set NITRO_PRESET=vercel to emit .vercel/output for Vercel.
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "node:path";

const vercelTarget = process.env.NITRO_PRESET === "vercel";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "@tanstack/react-router", "@tanstack/react-start"],
  },
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    ...(vercelTarget ? [nitro({ preset: "vercel" })] : []),
    viteReact(),
  ],
  build: {
    chunkSizeWarningLimit: 2000,
  },
});
