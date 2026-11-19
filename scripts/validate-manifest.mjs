import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const manifest = JSON.parse(await readFile("dist/manifest.json", "utf8"));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.version, "0.1.0");
assert.equal(manifest.minimum_chrome_version, "123");
assert.deepEqual(manifest.permissions.sort(), ["scripting", "storage"]);
assert.deepEqual(manifest.host_permissions, ["https://github.com/*"]);
assert.deepEqual(manifest.optional_host_permissions, ["https://*/*"]);
assert.equal(manifest.content_scripts[0].all_frames, undefined);
for (const file of [
  manifest.background.service_worker,
  manifest.options_page,
  ...manifest.content_scripts.flatMap((script) => script.js),
]) {
  assert.equal((await stat(`dist/${file}`)).isFile(), true);
}
for (const [size, file] of Object.entries(manifest.icons)) {
  const png = await readFile(`dist/${file}`);
  assert.equal(png.readUInt32BE(16), Number(size));
  assert.equal(png.readUInt32BE(20), Number(size));
}
console.log("Manifest and referenced assets are valid.");
const firefox = JSON.parse(
  await readFile("dist-firefox/manifest.json", "utf8"),
);
assert.equal(firefox.manifest_version, 3);
assert.deepEqual(firefox.background, { scripts: ["background.js"] });
assert.equal(
  firefox.browser_specific_settings.gecko.strict_min_version,
  "142.0",
);
assert.deepEqual(
  firefox.browser_specific_settings.gecko.data_collection_permissions.required,
  ["none"],
);
assert.equal(firefox.minimum_chrome_version, undefined);
for (const file of [
  "background.js",
  "content.js",
  "options.js",
  "options.html",
]) {
  assert.equal((await stat(`dist-firefox/${file}`)).isFile(), true);
}
assert.equal(
  (await readFile("dist-firefox/background.js", "utf8")).includes(
    "globalThis.browser ?? globalThis.chrome",
  ),
  true,
);
console.log("Firefox manifest and assets are valid.");
