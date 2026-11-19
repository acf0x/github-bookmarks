import type { Settings } from "./domain";

export type Message =
  | { type: "state" }
  | { type: "toggle"; url: string }
  | { type: "remove"; id: string }
  | { type: "reorder"; id: string; targetId: string }
  | { type: "settings"; patch: Partial<Settings> }
  | { type: "add-host"; host: string }
  | { type: "remove-host"; host: string };

export function validateMessage(value: unknown): Message | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  switch (data.type) {
    case "state":
      return { type: "state" };
    case "toggle":
      return typeof data.url === "string" && data.url.length < 2048
        ? { type: "toggle", url: data.url }
        : null;
    case "remove":
      return typeof data.id === "string" && data.id.length < 2048
        ? { type: "remove", id: data.id }
        : null;
    case "reorder":
      return typeof data.id === "string" &&
        typeof data.targetId === "string" &&
        data.id.length < 2048 &&
        data.targetId.length < 2048
        ? { type: "reorder", id: data.id, targetId: data.targetId }
        : null;
    case "settings": {
      if (
        !data.patch ||
        typeof data.patch !== "object" ||
        Array.isArray(data.patch)
      )
        return null;
      const patch = data.patch as Record<string, unknown>;
      if (
        Object.keys(patch).some(
          (key) => !["open", "pinned", "side", "width"].includes(key),
        )
      )
        return null;
      if ("open" in patch && typeof patch.open !== "boolean") return null;
      if ("pinned" in patch && typeof patch.pinned !== "boolean") return null;
      if ("side" in patch && patch.side !== "left" && patch.side !== "right")
        return null;
      if (
        "width" in patch &&
        (typeof patch.width !== "number" || !Number.isFinite(patch.width))
      )
        return null;
      return { type: "settings", patch: patch as Partial<Settings> };
    }
    case "add-host":
    case "remove-host":
      return typeof data.host === "string" && data.host.length < 254
        ? { type: data.type, host: data.host }
        : null;
    default:
      return null;
  }
}
