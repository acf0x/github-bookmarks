# Testing and evidence

Run the existing checks from the repository root:

```sh
npm ci
npm run check
npx playwright install chromium
npm run test:browser
npx -y web-ext lint --source-dir dist-firefox
```

The unit tests cover repository identity, URL normalization, host validation, storage mutation ordering, settings, and message shapes. The Chromium browser script loads the unpacked package in an isolated profile and checks the button, sidebar, navigation, header fallback, cross-tab state, theme, and a synthetic GHES host. The Firefox build has been loaded as a temporary add-on with `web-ext run`; `web-ext lint` validates its manifest. Current evidence belongs to version 0.1.0 and should be rerun for later changes.

The status frame uses mdxcn's [GraphCheck Markdown representation](https://mdxcn.dev/docs/graph-check); an open box is intentionally not a passed test.

```text
+------------------- [ CHECKS ] -------------------+
|                                                  |
| [x]  TypeScript, ESLint, Prettier                |
| [x]  Unit tests and Chromium browser test        |
| [x]  Chromium and Firefox manifests              |
| [x]  Firefox temporary load and web-ext lint     |
| [ ]  Corporate GHES and native consent dialog    |
|                                                  |
+--------------------------------------------------+
```

The browser test uses a temporary copy of the extension with one exact test-host permission, so it does not automate the browser's native GHES consent dialog. No test requires corporate credentials. Review [security](SECURITY.md) before using real private repository names in any new fixture or screenshot.
