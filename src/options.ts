import { normalizeHostname } from "./domain";
import { hostPattern } from "./hosts";
import { send } from "./client";
import type { State } from "./domain";

const form = document.querySelector<HTMLFormElement>("#host-form")!;
const input = document.querySelector<HTMLInputElement>("#host")!;
const list = document.querySelector<HTMLUListElement>("#hosts")!;
const status = document.querySelector<HTMLElement>("#status")!;

async function render(): Promise<void> {
  const state = await send<State>({ type: "state" });
  list.replaceChildren();
  for (const host of state.hosts) {
    const row = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = host;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", `Remove ${host}`);
    remove.addEventListener("click", async () => {
      try {
        await send({ type: "remove-host", host });
        status.textContent = `${host} removed`;
        await render();
      } catch (error) {
        status.textContent = String(error);
      }
    });
    row.append(name, remove);
    list.append(row);
  }
  if (!state.hosts.length) {
    const empty = document.createElement("li");
    empty.textContent = "No Enterprise hosts added.";
    list.append(empty);
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const host = normalizeHostname(input.value);
  if (!host) {
    status.textContent = "Enter a valid HTTPS hostname without a path or port.";
    return;
  }
  try {
    // This call must be made directly inside the submit gesture before any await.
    const granted = await chrome.permissions.request({
      origins: [hostPattern(host)],
    });
    if (!granted) {
      status.textContent = "Browser access was not granted.";
      return;
    }
    await send({ type: "add-host", host });
    input.value = "";
    status.textContent = `${host} added. Reload any open pages on that host.`;
    await render();
  } catch (error) {
    status.textContent = String(error);
  }
});

void render().catch((error) => {
  status.textContent = String(error);
});
