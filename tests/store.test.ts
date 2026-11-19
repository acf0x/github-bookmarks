import { beforeEach, expect, it, vi } from "vitest";
import { parseRepository } from "../src/domain";
import {
  addFolder,
  moveToFolder,
  readState,
  removeFolder,
  renameBookmark,
  removeBookmark,
  reorderBookmark,
  toggleBookmark,
  updateSettings,
} from "../src/store";

let data: Record<string, unknown>;
let writes: unknown[];

beforeEach(() => {
  data = {};
  writes = [];
  vi.stubGlobal("chrome", {
    storage: {
      local: {
        get: vi.fn(async () => ({ ...data })),
        set: vi.fn(async (patch: Record<string, unknown>) => {
          await new Promise((resolve) => setTimeout(resolve, 2));
          Object.assign(data, patch);
          writes.push(patch);
        }),
      },
    },
  });
});

it("serializes concurrent toggles without losing updates", async () => {
  const url = "https://github.company.example/acme/tool";
  await Promise.all([
    toggleBookmark(url),
    toggleBookmark(url),
    toggleBookmark(url),
  ]);
  expect((await readState()).bookmarks).toHaveLength(1);
  expect(writes).toHaveLength(3);
});

it("prevents duplicates, removes, reorders, and persists settings", async () => {
  const first = "https://github.company.example/acme/tool";
  const second = "https://github.company.example/acme/other";
  await toggleBookmark(first);
  await toggleBookmark(second);
  await reorderBookmark(
    parseRepository(first)!.id,
    parseRepository(second)!.id,
  );
  expect((await readState()).bookmarks[0]?.name).toBe("tool");
  await removeBookmark(parseRepository(first)!.id);
  expect((await readState()).bookmarks.map((item) => item.name)).toEqual([
    "other",
  ]);
  await updateSettings({ side: "left", width: 340 });
  expect((await readState()).settings).toMatchObject({
    side: "left",
    width: 340,
  });
});

it("renames bookmarks and restores the default name when empty", async () => {
  const url = "https://github.company.example/acme/tool";
  const id = parseRepository(url)!.id;
  await toggleBookmark(url);
  await renameBookmark(id, "  My tool  ");
  expect((await readState()).bookmarks[0]?.label).toBe("My tool");
  await renameBookmark(id, "   ");
  expect((await readState()).bookmarks[0]?.label).toBeUndefined();
});

it("groups bookmarks in folders and ungroups them on folder removal", async () => {
  const url = "https://github.company.example/acme/tool";
  const id = parseRepository(url)!.id;
  await toggleBookmark(url);
  await addFolder("  Infra  ");
  const folder = (await readState()).folders[0]!;
  expect(folder.name).toBe("Infra");
  await moveToFolder(id, "missing");
  expect((await readState()).bookmarks[0]?.folderId).toBeUndefined();
  await moveToFolder(id, folder.id);
  expect((await readState()).bookmarks[0]?.folderId).toBe(folder.id);
  await removeFolder(folder.id);
  const state = await readState();
  expect(state.folders).toEqual([]);
  expect(state.bookmarks[0]?.folderId).toBeUndefined();
});

it("persists handle position and theme", async () => {
  await updateSettings({ handleY: 72, theme: "dark" });
  expect((await readState()).settings).toMatchObject({
    handleY: 72,
    theme: "dark",
  });
  await updateSettings({ handleY: 500 });
  expect((await readState()).settings.handleY).toBe(100);
});
