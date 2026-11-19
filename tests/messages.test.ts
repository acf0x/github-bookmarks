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
