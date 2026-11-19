import { beforeEach, expect, it, vi } from "vitest";
import { addHost, hostPattern, reconcileHosts, removeHost } from "../src/hosts";

let data: Record<string, unknown>;
let registered: { id: string }[];
let granted: boolean;
let scripting: {
  registerContentScripts: ReturnType<typeof vi.fn>;
  unregisterContentScripts: ReturnType<typeof vi.fn>;
};

beforeEach(() => {
  data = {};
  registered = [];
  granted = false;
  scripting = {
    registerContentScripts: vi.fn(async (items: { id: string }[]) => {
      registered.push(...items);
    }),
    unregisterContentScripts: vi.fn(async ({ ids }: { ids: string[] }) => {
      registered = registered.filter((item) => !ids.includes(item.id));
    }),
  };
  vi.stubGlobal("chrome", {
    storage: {
      local: {
        get: vi.fn(async () => ({ ...data })),
        set: vi.fn(async (patch: Record<string, unknown>) => {
          Object.assign(data, patch);
        }),
      },
    },
    permissions: {
      contains: vi.fn(async () => granted),
      remove: vi.fn(async () => {
        granted = false;
        return true;
      }),
    },
    scripting: {
      ...scripting,
      getRegisteredContentScripts: vi.fn(
        async ({ ids }: { ids?: string[] } = {}) =>
          ids ? registered.filter((item) => ids.includes(item.id)) : registered,
      ),
    },
  });
});

it("requests exact origin patterns and registers only granted hosts", async () => {
  expect(hostPattern("github.company.example")).toBe(
    "https://github.company.example/*",
  );
  await expect(addHost("github.company.example")).rejects.toThrow("permission");
  granted = true;
  await addHost("github.company.example");
  expect(data.hosts).toEqual(["github.company.example"]);
  expect(scripting.registerContentScripts).toHaveBeenCalledWith([
    expect.objectContaining({
      matches: ["https://github.company.example/*"],
      persistAcrossSessions: true,
    }),
  ]);
  await reconcileHosts();
  expect(registered).toHaveLength(1);
  await removeHost("github.company.example");
  expect(registered).toHaveLength(0);
  expect(data.hosts).toEqual([]);
});
