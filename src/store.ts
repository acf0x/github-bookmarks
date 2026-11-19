import {
  DEFAULT_SETTINGS,
  moveBookmark,
  parseRepository,
  validateBookmarks,
  validateSettings,
  type Bookmark,
  type Settings,
  type State,
} from "./domain";

export async function readState(): Promise<State> {
  const data = await chrome.storage.local.get([
    "bookmarks",
    "settings",
    "hosts",
  ]);
  return {
    bookmarks: validateBookmarks(data.bookmarks),
    settings: validateSettings(data.settings),
    hosts: Array.isArray(data.hosts)
      ? data.hosts.filter((host): host is string => typeof host === "string")
      : [],
  };
}

let pending: Promise<unknown> = Promise.resolve();

export function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const next = pending.then(operation, operation);
  pending = next.catch(() => undefined);
  return next;
}

export async function toggleBookmark(url: string): Promise<Bookmark[]> {
  return serialize(async () => {
    const repo = parseRepository(url);
    if (!repo) throw new Error("Invalid repository URL");
    const { bookmarks } = await readState();
    const next = bookmarks.some((item) => item.id === repo.id)
      ? bookmarks.filter((item) => item.id !== repo.id)
      : [{ ...repo, addedAt: Date.now() }, ...bookmarks];
    await chrome.storage.local.set({ bookmarks: next });
    return next;
  });
}

export async function removeBookmark(id: string): Promise<Bookmark[]> {
  return serialize(async () => {
    const { bookmarks } = await readState();
    const next = bookmarks.filter((item) => item.id !== id);
    await chrome.storage.local.set({ bookmarks: next });
    return next;
  });
}

export async function reorderBookmark(
  id: string,
  targetId: string,
): Promise<Bookmark[]> {
  return serialize(async () => {
    const { bookmarks } = await readState();
    const next = moveBookmark(bookmarks, id, targetId);
    if (next !== bookmarks) await chrome.storage.local.set({ bookmarks: next });
    return next;
  });
}

export async function updateSettings(
  patch: Partial<Settings>,
): Promise<Settings> {
  return serialize(async () => {
    const { settings } = await readState();
    const next = validateSettings({ ...settings, ...patch });
    await chrome.storage.local.set({ settings: next });
    return next;
  });
}

export async function initializeStore(): Promise<void> {
  const data = await chrome.storage.local.get(["settings"]);
  if (!data.settings)
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
}
