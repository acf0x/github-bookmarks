import {
  isRepositoryDocument,
  parseRepository,
  type Bookmark,
  type Repository,
  type State,
} from "./domain";
import { readState } from "./store";
import { send } from "./client";
import { Sidebar } from "./sidebar";
import { icon } from "./ui";
import buttonCss from "./button.css";

if (!document.querySelector("gh-bookmarks")) {
  void start();
}

async function start(): Promise<void> {
  let state: State;
  try {
    state = await send<State>({ type: "state" });
  } catch {
    return;
  }
  if (document.querySelector("gh-bookmarks")) return;
  const sidebar = new Sidebar(state);
  const buttonStyle = document.createElement("style");
  buttonStyle.dataset.ghb = "button";
  buttonStyle.textContent = buttonCss;
  document.head.append(buttonStyle);
  let current: Repository | null = null;
  let action: HTMLButtonElement | null = null;
  let wrapper: HTMLElement | null = null;
  let lastUrl = "";
  let timer = 0;

  function isLanding(): boolean {
    return location.pathname.split("/").filter(Boolean).length === 2;
  }

  function getCurrent(): Repository | null {
    const repo = parseRepository(location.href);
    return repo && isRepositoryDocument(document, repo) ? repo : null;
  }

  function target(): HTMLElement | null {
    const known = document.querySelector<HTMLElement>(
      '[data-testid="repo-header-actions"], ul.pagehead-actions, .pagehead-actions, #repository-container-header ul, [data-testid="repository-container-header"] .d-flex, #repository-container-header, [data-testid="repository-container-header"], #repo-title-component',
    );
    if (known) return known;
    const heading = Array.from(
      document.querySelectorAll<HTMLElement>(
        "header h1, .repohead h1, .pagehead h1, h1",
      ),
    ).find((item) =>
      item.textContent
        ?.toLocaleLowerCase()
        .includes(current?.name.toLocaleLowerCase() ?? "\0"),
    );
    return (
      heading?.closest<HTMLElement>("header, .repohead, .pagehead") ??
      heading?.parentElement ??
      null
    );
  }

  function updateAction(): void {
    if (!action || !current) return;
    const saved = state.bookmarks.some((item) => item.id === current?.id);
    action.setAttribute("aria-pressed", String(saved));
    action.setAttribute(
      "aria-label",
      saved ? "Remove from favorites" : "Add to favorites",
    );
    action.title = saved ? "Remove from favorites" : "Add to favorites";
    const label = action.querySelector(".ghb-label");
    if (label) label.textContent = saved ? "Favorited" : "Add favorite";
    action.classList.toggle("ghb-saved", saved);
  }

  function clearAction(): void {
    wrapper?.remove();
    wrapper = null;
    action = null;
  }

  function injectAction(): void {
    const parent = current && isLanding() ? target() : null;
    if (!parent) {
      clearAction();
      return;
    }
    if (wrapper?.isConnected && wrapper.parentElement === parent) {
      updateAction();
      return;
    }
    clearAction();
    const list = parent.tagName === "UL";
    wrapper = document.createElement(list ? "li" : "span");
    wrapper.className = "ghb-action-wrap";
    action = document.createElement("button");
    action.type = "button";
    action.className = "ghb-action";
    action.append(
      icon("bookmark"),
      Object.assign(document.createElement("span"), { className: "ghb-label" }),
    );
    action.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!current) return;
      const repo = current;
      const wasSaved = state.bookmarks.some((item) => item.id === repo.id);
      state.bookmarks = wasSaved
        ? state.bookmarks.filter((item) => item.id !== repo.id)
        : [{ ...repo, addedAt: Date.now() }, ...state.bookmarks];
      updateAction();
      sidebar.setState(state);
      sidebar.announce(wasSaved ? "Repository removed" : "Repository saved");
      try {
        await send<Bookmark[]>({ type: "toggle", url: repo.url });
      } catch (error) {
        state = await readState();
        sidebar.setState(state);
        updateAction();
        sidebar.announce(String(error));
      }
    });
    wrapper.append(action);
    parent.append(wrapper);
    updateAction();
  }

  function refresh(): void {
    const url = location.href;
    const repo = getCurrent();
    const changed = url !== lastUrl || current?.id !== repo?.id;
    lastUrl = url;
    current = repo;
    if (changed) sidebar.setCurrent(repo);
    if (
      changed ||
      (current &&
        isLanding() &&
        (!wrapper?.isConnected || !action?.isConnected))
    )
      injectAction();
  }

  function schedule(): void {
    window.clearTimeout(timer);
    timer = window.setTimeout(refresh, 90);
  }

  refresh();
  const observer = new MutationObserver((mutations) => {
    if (
      location.href !== lastUrl ||
      (current && isLanding() && !wrapper?.isConnected) ||
      mutations.some(
        (change) =>
          change.target instanceof HTMLElement &&
          (change.target.id === "repository-container-header" ||
            change.target.classList.contains("pagehead-actions")),
      )
    )
      schedule();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  for (const name of [
    "turbo:load",
    "turbo:render",
    "soft-nav:end",
    "pjax:end",
    "popstate",
  ]) {
    window.addEventListener(name, schedule);
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (
      area !== "local" ||
      !["bookmarks", "settings", "hosts", "folders"].some(
        (key) => key in changes,
      )
    )
      return;
    void readState().then((next) => {
      state = next;
      sidebar.setState(state);
      updateAction();
    });
  });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) schedule();
  });
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    observer.disconnect();
    sidebar.destroy();
    clearAction();
    buttonStyle.remove();
  });
}
