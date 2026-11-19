# Architecture and security

## Data and page lifecycle

`src/domain.ts` parses a repository root from the current HTTPS URL. A repository is offered only when the document also exposes repository-specific metadata or header controls. The bookmark ID includes normalized origin, owner, and repository name; the stored URL preserves owner/repository casing for display. The extension keeps the ordered bookmark list, approved GHES hosts, and sidebar preferences in `chrome.storage.local`.

The Manifest V3 service worker is the only writer for bookmark and preference mutations. It queues read-modify-write operations, so simultaneous clicks from multiple tabs cannot overwrite each other. Content scripts use `chrome.storage.onChanged` to update their button and sidebar. The queue is an in-memory coordination device only; the durable source of truth is storage, which survives worker restarts.

GitHub.com uses a manifest content script. GHES hosts are registered dynamically after an exact optional HTTPS host permission is granted from the options page. Registration persists across browser sessions. Startup reconciliation drops hosts whose permission was revoked and unregisters stale scripts. Removal unregisters the specific host script and revokes its specific origin permission.

The content script mounts one closed Shadow DOM sidebar per page. The closed tree limits direct access to cross-host bookmark names from page scripts, though a rendered sidebar is not a hard security boundary against the host page. It watches GitHub navigation events and a debounced DOM observer for repository header replacement. The compact repository action is inserted into the existing action list where available, with a repository-header fallback. It never calls GitHub's native Star control. Search, reordering, docking, pinning, and resizing are local UI operations; persistent changes go through the service worker.

## Trust boundaries

- The service worker validates message shapes and rejects messages from outside the extension or an unapproved page origin. A toggle can only name a repository on the sending page's origin.
- Enterprise host input is parsed as an HTTPS hostname and converted to an exact match pattern. The permission request happens in the options page's submit event before any asynchronous work, preserving the browser user gesture.
- Repository-derived strings enter the UI only through `textContent` or DOM properties. No repository data is interpolated into HTML or code.
- The extension does not inspect cookies, tokens, page scripts, or network responses. It performs no outbound `fetch` and does not bundle remote resources.
- Manifest CSP restricts extension pages to local scripts. No `eval`, inline script, remote font, or runtime dependency is used.

## Modern Web Guidance applied

The implementation follows [GoogleChrome modern-web-guidance](https://github.com/GoogleChrome/modern-web-guidance), especially its [Chrome extensions guidance](https://github.com/GoogleChrome/modern-web-guidance/tree/main/skills/chrome-extensions). It uses native content scripts and storage change events, exact optional host grants, CSS tokens, `color-scheme`, Shadow DOM isolation, semantic controls, visible focus indicators, one polite status region, and reduced-motion handling. The sidebar remains a nonmodal side workspace because pinning and normal GitHub interaction must stay possible; it is not a modal navigation drawer.

The two design references were studied for observable interactions only. No code or assets from either project were copied; see [attribution](../ATTRIBUTION.md).
