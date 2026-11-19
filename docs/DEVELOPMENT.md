# Development

The extension uses strict TypeScript, esbuild, native DOM APIs, and local CSS. There is no React or MDX runtime. Node.js 22+ is the documented build environment.

```sh
npm ci
npm run build
npm run check
```

`npm run build` creates `dist/` for Chromium and `dist-firefox/` for Firefox. The committed packages are also loadable without running a build. `npm run check` runs type checking, ESLint, Prettier, unit tests, both builds, and manifest validation. Browser checks need Chrome for Testing installed with `npx playwright install chromium`; then run `npm run test:browser`. The Firefox package can be checked with `npx -y web-ext lint --source-dir dist-firefox`.

The [build script](../scripts/build.mjs) has no mdxcn dependency. mdxcn is used only to author plain Markdown figures and as a project-local agent skill. It is not fetched during extension builds. See [testing](TESTING.md) for coverage and [releasing](RELEASING.md) for the manual packaging workflow.

## Updating the mdxcn skill

The pinned upstream revision and copy instructions are in [the skill provenance note](../.agents/skills/mdxcn/UPSTREAM.md). Review a new upstream `SKILL.md`, `recipes.md`, and license before replacing the local copy. When changing documentation, use the official figure fences and verify that their labels still match source code. No documentation website exists in this repository, so the MDX registry and `withMdxcn` are intentionally not installed.
