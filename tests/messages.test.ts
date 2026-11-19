import { expect, it } from "vitest";
import { validateMessage } from "../src/messages";

it("validates message shape and settings patches", () => {
  expect(
    validateMessage({ type: "toggle", url: "https://github.com/a/b" }),
  ).toEqual({ type: "toggle", url: "https://github.com/a/b" });
  expect(
    validateMessage({ type: "settings", patch: { width: 310, pinned: true } }),
  ).not.toBeNull();
  expect(
    validateMessage({ type: "settings", patch: { evil: true } }),
  ).toBeNull();
  expect(
    validateMessage({ type: "settings", patch: { open: "yes" } }),
  ).toBeNull();
  expect(validateMessage({ type: "remove", id: 7 })).toBeNull();
});

it("validates rename, folder and appearance messages", () => {
  expect(
    validateMessage({ type: "rename", id: "a", label: "x" }),
  ).not.toBeNull();
  expect(
    validateMessage({ type: "rename", id: "a", label: "x".repeat(101) }),
  ).toBeNull();
  expect(validateMessage({ type: "add-folder", name: "  " })).toBeNull();
  expect(validateMessage({ type: "add-folder", name: "Infra" })).not.toBeNull();
  expect(validateMessage({ type: "remove-folder", id: 3 })).toBeNull();
  expect(
    validateMessage({ type: "move-folder", id: "a", folderId: null }),
  ).not.toBeNull();
  expect(
    validateMessage({ type: "move-folder", id: "a", folderId: 1 }),
  ).toBeNull();
  expect(
    validateMessage({
      type: "settings",
      patch: { handleY: 50, theme: "dark" },
    }),
  ).not.toBeNull();
  expect(
    validateMessage({ type: "settings", patch: { theme: "neon" } }),
  ).toBeNull();
});
