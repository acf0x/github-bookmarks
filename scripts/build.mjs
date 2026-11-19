import { build } from "esbuild";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";

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

await mkdir("dist-firefox", { recursive: true });
await build({
  entryPoints: {
    background: "src/background.ts",
    content: "src/content.ts",
    options: "src/options.ts",
  },
  outdir: "dist-firefox",
  bundle: true,
  minify: true,
  target: "firefox128",
  format: "iife",
  banner: { js: "const chrome = globalThis.browser ?? globalThis.chrome;" },
  loader: { ".css": "text" },
});
const firefoxManifest = JSON.parse(await readFile("manifest.json", "utf8"));
delete firefoxManifest.minimum_chrome_version;
firefoxManifest.background = { scripts: ["background.js"] };
firefoxManifest.browser_specific_settings = {
  gecko: {
    id: "github-bookmarks@acf0x.github.com",
    strict_min_version: "142.0",
    data_collection_permissions: { required: ["none"] },
  },
};
await Promise.all([
  writeFile(
    "dist-firefox/manifest.json",
    JSON.stringify(firefoxManifest, null, 2),
  ),
  cp("src/options.html", "dist-firefox/options.html"),
  cp("icons", "dist-firefox/icons", { recursive: true }),
]);
