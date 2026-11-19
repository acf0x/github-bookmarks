# GitHub Enterprise Server

The extension stores repository URLs locally. It does not sign in to GHES, inspect cookies, or call the GitHub API. Sign in to your Enterprise instance in the browser before using the extension.

## Add a host

The following uses mdxcn's [Steps Markdown representation](https://mdxcn.dev/docs/steps). Each permission grant is for the hostname entered, not every HTTPS site.

```text
+------------------ [ SETUP ] ---------------------+
|                                                  |
| 1  Open settings                                 |
|    Click the extension toolbar icon.             |
| │                                                |
| 2  Enter the hostname                            |
|    Example: github.company.example.              |
| │                                                |
| 3  Grant access                                  |
|    Approve that HTTPS host in the browser.       |
| │                                                |
| 4  Reload existing tabs                          |
|    The new script runs on future page loads.     |
|                                                  |
+--------------------------------------------------+
```

The input accepts a hostname or `https://` plus a hostname. HTTP, paths, ports, wildcards, `localhost`, and `github.com` are rejected. GitHub.com is already enabled by the manifest. You may add multiple Enterprise hosts; bookmarks include the origin in their identity, so identical `owner/repository` names on different hosts remain separate.

To remove a host, open the same settings page and choose **Remove**. The extension unregisters that host's content script and revokes its exact permission. Reload already open pages to remove their existing UI. Existing bookmarks from that host remain in local storage until you remove them individually.

## When the button is missing

The sidebar is available on an approved host even outside repositories. The header button appears on repository landing pages only when the URL and repository metadata or heading agree. On repository subpages, use **Add current repository** in the sidebar. On an unusual GHES layout that omits recognized repository markers, the extension declines to guess; see [repository detection](architecture.md#data-and-page-lifecycle). A browser or corporate policy may also block extension installation or host permissions.

Real corporate GHES layouts and SSO have not been verified by this project. Automated tests use synthetic Enterprise pages. See [testing](TESTING.md) for the exact evidence.
