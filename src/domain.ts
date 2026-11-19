export interface Repository {
  id: string;
  origin: string;
  owner: string;
  name: string;
  url: string;
}

export interface Bookmark extends Repository {
  addedAt: number;
}

export interface Settings {
  open: boolean;
  pinned: boolean;
  side: "left" | "right";
  width: number;
}

export interface State {
  bookmarks: Bookmark[];
  settings: Settings;
  hosts: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  open: false,
  pinned: false,
  side: "right",
  width: 320,
};

const reservedOwners = new Set([
  "about",
  "account",
  "apps",
  "codespaces",
  "collections",
  "dashboard",
  "enterprises",
  "events",
  "explore",
  "features",
  "gist",
  "issues",
  "login",
  "logout",
  "marketplace",
  "new",
  "notifications",
  "organizations",
  "orgs",
  "pricing",
  "pulls",
  "search",
  "security",
  "sessions",
  "settings",
  "signup",
  "sponsors",
  "stars",
  "team",
  "topics",
  "trending",
  "users",
]);
const part = /^[A-Za-z0-9_.-]+$/;

export function parseRepository(input: string): Repository | null {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port)
    return null;
  const segments = url.pathname.split("/").filter(Boolean);
  const owner = segments[0];
  const name = segments[1];
  if (!owner || !name || !part.test(owner) || !part.test(name)) return null;
  if (reservedOwners.has(owner.toLowerCase())) return null;
  if (name === "." || name === "..") return null;
  const origin = url.origin.toLowerCase();
  const id = `${origin}/${owner.toLowerCase()}/${name.toLowerCase()}`;
  return { id, origin, owner, name, url: `${origin}/${owner}/${name}` };
}

export function isRepositoryDocument(doc: Document): boolean {
  return Boolean(
    doc.querySelector(
      'meta[name="octolytics-dimension-repository_id"], #repository-container-header, [data-testid="repository-container-header"], [data-hydro-click*="repository_id"]',
    ),
  );
}

export function normalizeHostname(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed || /[\s/@?#]/.test(trimmed.replace(/^https:\/\//i, "")))
    return null;
  let url: URL;
  try {
    url = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
  if (
    url.protocol !== "https:" ||
    url.port ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    return null;
  const host = url.hostname.toLowerCase();
  if (
    host === "github.com" ||
    host === "localhost" ||
    !/^[a-z0-9](?:[a-z0-9.-]*[a-z0-9])$/.test(host) ||
    !host.includes(".") ||
    host.includes("..")
  )
    return null;
  return host;
}

export function filterBookmarks(
  bookmarks: Bookmark[],
  query: string,
): Bookmark[] {
  const term = query.trim().toLocaleLowerCase();
  return term
    ? bookmarks.filter((item) =>
        `${item.owner} ${item.name} ${new URL(item.origin).hostname}`
          .toLocaleLowerCase()
          .includes(term),
      )
    : bookmarks;
}

export function moveBookmark(
  bookmarks: Bookmark[],
  id: string,
  targetId: string,
): Bookmark[] {
  const from = bookmarks.findIndex((item) => item.id === id);
  const to = bookmarks.findIndex((item) => item.id === targetId);
  if (from < 0 || to < 0 || from === to) return bookmarks;
  const result = [...bookmarks];
  const [item] = result.splice(from, 1);
  if (item) result.splice(to, 0, item);
  return result;
}

export function validateSettings(value: unknown): Settings {
  const data =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  return {
    open: typeof data.open === "boolean" ? data.open : DEFAULT_SETTINGS.open,
    pinned:
      typeof data.pinned === "boolean" ? data.pinned : DEFAULT_SETTINGS.pinned,
    side: data.side === "left" ? "left" : "right",
    width:
      typeof data.width === "number" && Number.isFinite(data.width)
        ? Math.max(260, Math.min(520, Math.round(data.width)))
        : DEFAULT_SETTINGS.width,
  };
}

export function validateBookmarks(value: unknown): Bookmark[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const result: Bookmark[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object" || typeof entry.url !== "string")
      continue;
    const repo = parseRepository(entry.url);
    if (!repo || seen.has(repo.id) || typeof entry.addedAt !== "number")
      continue;
    seen.add(repo.id);
    result.push({ ...repo, addedAt: entry.addedAt });
  }
  return result;
}
