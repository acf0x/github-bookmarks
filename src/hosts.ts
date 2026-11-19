import { normalizeHostname } from "./domain";
import { readState, serialize } from "./store";

export function hostPattern(host: string): string {
  return `https://${host}/*`;
}

function scriptId(host: string): string {
  return `ghb-${host.replaceAll(".", "_")}`;
}

export async function addHost(input: string): Promise<string> {
  const host = normalizeHostname(input);
  if (!host) throw new Error("Enter a valid HTTPS hostname");
  if (!(await chrome.permissions.contains({ origins: [hostPattern(host)] })))
    throw new Error("Host permission was not granted");
  return serialize(async () => {
    const { hosts } = await readState();
    await registerHost(host);
    if (!hosts.includes(host))
      await chrome.storage.local.set({ hosts: [...hosts, host] });
    return host;
  });
}

export async function removeHost(input: string): Promise<void> {
  const host = normalizeHostname(input);
  if (!host) throw new Error("Invalid hostname");
  await serialize(async () => {
    const { hosts } = await readState();
    await chrome.storage.local.set({
      hosts: hosts.filter((item) => item !== host),
    });
    const registered = await chrome.scripting.getRegisteredContentScripts({
      ids: [scriptId(host)],
    });
    if (registered.length)
      await chrome.scripting.unregisterContentScripts({
        ids: [scriptId(host)],
      });
    await chrome.permissions.remove({ origins: [hostPattern(host)] });
  });
}

export async function registerHost(host: string): Promise<void> {
  const id = scriptId(host);
  const registered = await chrome.scripting.getRegisteredContentScripts({
    ids: [id],
  });
  if (registered.length) return;
  await chrome.scripting.registerContentScripts([
    {
      id,
      matches: [hostPattern(host)],
      js: ["content.js"],
      runAt: "document_idle",
      persistAcrossSessions: true,
    },
  ]);
}

export async function reconcileHosts(): Promise<void> {
  const { hosts } = await readState();
  const valid: string[] = [];
  for (const entry of hosts) {
    const host = normalizeHostname(entry);
    if (
      !host ||
      !(await chrome.permissions.contains({ origins: [hostPattern(host)] }))
    )
      continue;
    await registerHost(host);
    valid.push(host);
  }
  if (valid.length !== hosts.length)
    await chrome.storage.local.set({ hosts: valid });
  const registered = await chrome.scripting.getRegisteredContentScripts();
  const stale = registered
    .filter(
      (script) =>
        script.id.startsWith("ghb-") &&
        !valid.some((host) => script.id === scriptId(host)),
    )
    .map((script) => script.id);
  if (stale.length)
    await chrome.scripting.unregisterContentScripts({ ids: stale });
}
