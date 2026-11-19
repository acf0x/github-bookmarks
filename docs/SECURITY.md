# Security and permissions

The extension holds repository identifiers in `chrome.storage.local` for the current browser profile. It does not sync them across devices or send them to a service. Private repository names can be sensitive; treat browser profile backups and screenshots accordingly. Uninstalling the extension or clearing its extension storage removes bookmarks unless the browser profile is separately backed up.

## Manifest permissions

| Declaration            | Purpose                                           | Scope                                         |
| ---------------------- | ------------------------------------------------- | --------------------------------------------- |
| `storage`              | Persist bookmarks, hosts, and sidebar settings.   | Extension local storage.                      |
| `scripting`            | Register or unregister GHES content scripts.      | Approved hosts only.                          |
| `https://github.com/*` | Load the GitHub.com content script.               | GitHub.com.                                   |
| Optional `https://*/*` | Make exact GHES HTTPS grants possible at runtime. | The browser asks only for the entered origin. |

The broad optional pattern is a declaration of what may be requested; it does not itself grant access to every site. [options.ts](../src/options.ts) calls `chrome.permissions.request()` directly from the form's submit gesture with `https://<host>/*`. [hosts.ts](../src/hosts.ts) registers the matching script only after permission is confirmed. Removing a host unregisters its script and requests revocation of that exact origin.

The [background context](../src/background.ts) validates message shapes and sender origins. A bookmark toggle must name a repository on the sender's origin. Repository labels are inserted with DOM text nodes; no bookmark text is evaluated as code. The sidebar uses a closed Shadow DOM, which limits direct DOM inspection but is not a security boundary against a malicious host page. The extension does not read cookies, tokens, source code, or network responses.

The runtime has no analytics, remote assets, external code, backend, or outbound `fetch`. The two manifest variants have the same site permission policy. See the [architecture](architecture.md) for data flow and the [Enterprise guide](GITHUB_ENTERPRISE.md) for the user-visible permission sequence.
