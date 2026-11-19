# Releasing

Version 0.1.0 was published from `main` after [PR #1](https://github.com/acf0x/github-bookmarks/pull/1). The process remains manual; there is no release workflow or CI gate to change in this documentation update.

1. Update the version in `package.json`, `manifest.json`, and the changelog for an actual product change. Keep the Chromium and generated Firefox manifest versions aligned.
2. Run the commands in [testing](TESTING.md), including `web-ext lint`. Do not treat synthetic GHES fixtures as evidence of a real Enterprise installation.
3. Build both packages with `npm run build`. Package each directory's **contents** at the archive root, so `manifest.json` is at the root of the Chromium ZIP and Firefox XPI.
4. Inspect the archives and record SHA-256 hashes in the release notes. State explicitly whether the Firefox XPI is unsigned and temporary or Mozilla-signed.
5. Create a PR to `main`, review its documentation and permission impact, merge it, then tag the merged commit and attach both archives to the GitHub release.

The [0.1.0 release](https://github.com/acf0x/github-bookmarks/releases/tag/v0.1.0) contains a Chromium ZIP and an unsigned Firefox XPI. Firefox stable requires Mozilla signing for permanent installation. The mdxcn skill and Markdown figures are source documentation; neither belongs in the extension archives.
