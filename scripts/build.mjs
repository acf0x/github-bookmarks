import { build } from "esbuild";
import { cp, mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });
await build({
  entryPoints: {
    background: "src/background.ts",
    content: "src/content.ts",
    options: "src/options.ts",
  },
  outdir: "dist",
  bundle: true,
  minify: true,
  target: "chrome114",
  format: "iife",
  loader: { ".css": "text" },
});
await Promise.all([
  cp("manifest.json", "dist/manifest.json"),
  cp("src/options.html", "dist/options.html"),
  cp("icons", "dist/icons", { recursive: true }),
]);
