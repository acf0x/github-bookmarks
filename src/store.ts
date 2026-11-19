import {
  DEFAULT_SETTINGS,
  moveBookmark,
  parseRepository,
  validateBookmarks,
  validateFolders,
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
    "folders",
  ]);
  return {
    bookmarks: validateBookmarks(data.bookmarks),
    folders: validateFolders(data.folders),
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

export async function renameBookmark(id: string, label: string): Promise<void> {
  await serialize(async () => {
    const { bookmarks } = await readState();
    const item = bookmarks.find((entry) => entry.id === id);
    if (!item) return;
    const next = bookmarks.map((entry) =>
      entry.id === id
        ? { ...entry, label: label.trim().slice(0, 100) || undefined }
        : entry,
    );
    await chrome.storage.local.set({ bookmarks: next });
  });
}

export async function addFolder(name: string): Promise<void> {
  await serialize(async () => {
    const { folders } = await readState();
    await chrome.storage.local.set({
      folders: [
        ...folders,
        { id: crypto.randomUUID(), name: name.trim().slice(0, 100) },
      ],
    });
  });
}

export async function removeFolder(id: string): Promise<void> {
  await serialize(async () => {
    const { folders, bookmarks } = await readState();
    await chrome.storage.local.set({
      folders: folders.filter((folder) => folder.id !== id),
      bookmarks: bookmarks.map((item) =>
        item.folderId === id ? { ...item, folderId: undefined } : item,
      ),
    });
  });
}

export async function moveToFolder(
  id: string,
  folderId: string | null,
): Promise<void> {
  await serialize(async () => {
    const { bookmarks, folders } = await readState();
    if (folderId && !folders.some((folder) => folder.id === folderId)) return;
    await chrome.storage.local.set({
      bookmarks: bookmarks.map((item) =>
        item.id === id ? { ...item, folderId: folderId ?? undefined } : item,
      ),
    });
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
