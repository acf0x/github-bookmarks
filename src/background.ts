import { normalizeHostname, parseRepository } from "./domain";
import { addHost, hostPattern, reconcileHosts, removeHost } from "./hosts";
import { validateMessage } from "./messages";
import {
  initializeStore,
  readState,
  renameBookmark,
  addFolder,
  removeFolder,
  moveToFolder,
  removeBookmark,
  reorderBookmark,
  toggleBookmark,
  updateSettings,
} from "./store";

async function authorized(
  sender: chrome.runtime.MessageSender,
): Promise<boolean> {
  if (sender.id !== chrome.runtime.id || !sender.url) return false;
  let url: URL;
  try {
    url = new URL(sender.url);
  } catch {
    return false;
  }
  if (url.origin === "https://github.com") return true;
  const host = normalizeHostname(url.hostname);
  if (!host || url.protocol !== "https:") return false;
  const { hosts } = await readState();
  return (
    hosts.includes(host) &&
    (await chrome.permissions.contains({ origins: [hostPattern(host)] }))
  );
}

chrome.runtime.onMessage.addListener((raw: unknown, sender, respond) => {
  const message = validateMessage(raw);
  if (!message) {
    respond({ ok: false, error: "Invalid message" });
    return false;
  }
  const options =
    sender.id === chrome.runtime.id &&
    sender.url === chrome.runtime.getURL("options.html");
  void (async () => {
    try {
      if (!options && !(await authorized(sender)))
        throw new Error("Unauthorized sender");
      if (
        (message.type === "add-host" || message.type === "remove-host") &&
        !options
      )
        throw new Error("Host settings require the options page");
      switch (message.type) {
        case "state":
          respond({ ok: true, data: await readState() });
          break;
        case "toggle": {
          const repo = parseRepository(message.url);
          if (!repo || new URL(sender.url ?? "").origin !== repo.origin)
            throw new Error("Repository origin mismatch");
          respond({ ok: true, data: await toggleBookmark(repo.url) });
          break;
        }
        case "remove":
          respond({ ok: true, data: await removeBookmark(message.id) });
          break;
        case "reorder":
          respond({
            ok: true,
            data: await reorderBookmark(message.id, message.targetId),
          });
          break;
        case "rename":
          await renameBookmark(message.id, message.label);
          respond({ ok: true });
          break;
        case "add-folder":
          await addFolder(message.name);
          respond({ ok: true });
          break;
        case "remove-folder":
          await removeFolder(message.id);
          respond({ ok: true });
          break;
        case "move-folder":
          await moveToFolder(message.id, message.folderId);
          respond({ ok: true });
          break;
        case "settings":
          respond({ ok: true, data: await updateSettings(message.patch) });
          break;
        case "add-host":
          respond({ ok: true, data: await addHost(message.host) });
          break;
        case "remove-host":
          await removeHost(message.host);
          respond({ ok: true });
          break;
      }
    } catch (error) {
      respond({
        ok: false,
        error: error instanceof Error ? error.message : "Unexpected error",
      });
    }
  })();
  return true;
});

chrome.runtime.onInstalled.addListener(() => {
  void initializeStore().then(reconcileHosts);
});
chrome.runtime.onStartup.addListener(() => {
  void reconcileHosts();
});
chrome.action.onClicked.addListener(() => {
  void chrome.runtime.openOptionsPage();
});
