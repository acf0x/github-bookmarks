# Repository agent instructions

This repository is a small browser extension. Keep mdxcn in documentation and agent tooling; do not add React, MDX, mdxcn registry packages, or network calls to the extension runtime.

The project-local [mdxcn skill](.agents/skills/mdxcn/SKILL.md) and [recipes](.agents/skills/mdxcn/recipes.md) are available to Codex at `.agents/skills/mdxcn`. Use the official fenced ASCII from the skill's source links for GitHub Markdown. At most two figures per section, with prose between them. Do not invent ASCII, paste JSX into `.md`, or force a figure into a simple change.

Keep documentation in step with source changes:

- Repository parsing or storage model → `docs/architecture.md` and relevant tests.
- Host permissions or validation → `docs/SECURITY.md` and `docs/GITHUB_ENTERPRISE.md`.
- Sidebar controls or keyboard behavior → `README.md`.
- Build, tests, or packaging → `docs/DEVELOPMENT.md`, `docs/TESTING.md`, or `docs/RELEASING.md`.
- User-visible release changes → `CHANGELOG.md`.

Preserve the existing authentication-free and local-storage behavior. Use synthetic domains and repository names in documentation. Follow [skill provenance and update instructions](.agents/skills/mdxcn/UPSTREAM.md) when refreshing mdxcn.
