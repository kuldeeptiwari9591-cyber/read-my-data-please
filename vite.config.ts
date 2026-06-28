// Vercel-target Vite config. Used ONLY when self-hosting on Vercel.
// Activate by renaming this file to `vite.config.ts` AFTER moving off Lovable.
//
// The Lovable preset `@lovable.dev/vite-tanstack-config` defaults nitro to
// Cloudflare Workers, which Vercel cannot run. This file uses the official
// TanStack Start plugin chain with nitro preset = "vercel".

import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import path from "node:path";

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
    viteReact(),
  ],
});
