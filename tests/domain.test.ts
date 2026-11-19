import { describe, expect, it } from "vitest";
import {
  filterBookmarks,
  isRepositoryDocument,
  moveBookmark,
  normalizeHostname,
  parseRepository,
  validateBookmarks,
  validateSettings,
  type Bookmark,
} from "../src/domain";

const make = (url: string): Bookmark => ({
  ...parseRepository(url)!,
  addedAt: 1,
});

describe("repository identity", () => {
  it("normalizes repository roots and keeps hosts distinct", () => {
    const one = parseRepository(
      "https://github.com/Acme/Tool/issues/12?tab=all#top",
    )!;
    const two = parseRepository("https://github.company.example/Acme/Tool/")!;
    expect(one.url).toBe("https://github.com/Acme/Tool");
    expect(one.id).toBe("https://github.com/acme/tool");
    expect(two.id).not.toBe(one.id);
    expect(parseRepository("https://github.com/acme/tool")).toEqual({
      ...one,
      owner: "acme",
      name: "tool",
      url: "https://github.com/acme/tool",
    });
  });

  it("rejects dashboards and malformed URLs while allowing valid repository names", () => {
    expect(
      parseRepository("https://github.com/orgs/acme/repositories"),
    ).toBeNull();
    expect(parseRepository("https://github.com/settings/profile")).toBeNull();
    expect(parseRepository("http://github.com/acme/tool")).toBeNull();
    expect(parseRepository("https://github.com/acme")).toBeNull();
    expect(parseRepository("https://github.com/acme/settings")?.name).toBe(
      "settings",
    );
  });

  it("requires repository DOM evidence before offering bookmark actions", () => {
    const doc = new DOMParser().parseFromString(
      "<main><h1>User profile</h1></main>",
      "text/html",
    );
    expect(isRepositoryDocument(doc)).toBe(false);
    doc.head.innerHTML =
      '<meta name="octolytics-dimension-repository_id" content="42">';
    expect(isRepositoryDocument(doc)).toBe(true);
  });
});

describe("bookmark state", () => {
  const items = [
    make("https://github.com/a/one"),
    make("https://github.com/b/two"),
    make("https://github.company.example/a/one"),
  ];

  it("deduplicates and validates stored bookmarks", () => {
    expect(
      validateBookmarks([
        items[0],
        items[0],
        { url: "javascript:alert(1)", addedAt: 1 },
      ]),
    ).toEqual([items[0]]);
  });

  it("filters by owner, repository, and host", () => {
    expect(filterBookmarks(items, "company")).toEqual([items[2]]);
    expect(filterBookmarks(items, " TWO ")).toEqual([items[1]]);
  });

  it("moves bookmarks and clamps settings", () => {
    expect(
      moveBookmark(items, items[0]!.id, items[2]!.id).map((x) => x.name),
    ).toEqual(["two", "one", "one"]);
    expect(
      validateSettings({ width: 900, side: "left", pinned: true }).width,
    ).toBe(520);
    expect(validateSettings({ width: 100 }).width).toBe(260);
  });
});

describe("enterprise hostname", () => {
  it("normalizes HTTPS hostnames and rejects paths or other schemes", () => {
    expect(normalizeHostname(" GITHUB.Company.Example ")).toBe(
      "github.company.example",
    );
    expect(normalizeHostname("https://github.company.example")).toBe(
      "github.company.example",
    );
    for (const value of [
      "http://github.company.example",
      "https://github.company.example/path",
      "github.com",
      "github.company.example:8080",
      "example.com/evil",
      "https://user@example.com",
    ]) {
      expect(normalizeHostname(value)).toBeNull();
    }
  });
});
