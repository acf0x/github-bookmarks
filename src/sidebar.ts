import {
  filterBookmarks,
  type Bookmark,
  type Folder,
  type Repository,
  type Settings,
  type State,
} from "./domain";
import { send } from "./client";
import { button, icon } from "./ui";
import styleText from "./sidebar.css";

export class Sidebar {
  readonly host: HTMLElement;
  private root: ShadowRoot;
  private panel: HTMLElement;
  private handle: HTMLButtonElement;
  private list: HTMLUListElement;
  private search: HTMLInputElement;
  private count: HTMLElement;
  private addCurrent: HTMLButtonElement;
  private pin: HTMLButtonElement;
  private status: HTMLElement;
  private settings: Settings;
  private bookmarks: Bookmark[] = [];
  private folders: Folder[] = [];
  private collapsed = new Set<string>();
  private current: Repository | null = null;
  private themeObserver: MutationObserver;
  private colorScheme = matchMedia("(prefers-color-scheme: dark)");
  private resizeCleanup: (() => void) | null = null;
  private oldPadding = { left: "", right: "" };

  constructor(state: State) {
    this.settings = state.settings;
    this.bookmarks = state.bookmarks;
    this.folders = state.folders;
    this.host = document.createElement("gh-bookmarks");
    this.root = this.host.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = styleText;
    this.root.append(style);

    this.handle = button("Open bookmarks", "bookmark", "edge-handle");
    this.handle.addEventListener(
      "click",
      () => void this.setSettings({ open: true }, true),
    );
    this.handle.addEventListener("pointerdown", (event) =>
      this.startHandleDrag(event),
    );
    this.root.append(this.handle);

    this.panel = document.createElement("aside");
    this.panel.className = "panel";
    this.panel.setAttribute("aria-label", "Repository bookmarks");
    this.panel.id = "bookmarks-panel";
    this.root.append(this.panel);

    const header = document.createElement("header");
    header.className = "panel-header";
    const brand = document.createElement("div");
    brand.className = "brand";
    const mark = document.createElement("span");
    mark.className = "brand-mark";
    mark.append(icon("bookmark", 18));
    const title = document.createElement("div");
    title.className = "brand-text";
    const eyebrow = document.createElement("span");
    eyebrow.className = "eyebrow";
    eyebrow.textContent = "YOUR WORKSPACE";
    const heading = document.createElement("strong");
    heading.textContent = "Bookmarks";
    title.append(eyebrow, heading);
    brand.append(mark, title);
    const actions = document.createElement("div");
    actions.className = "header-actions";
    this.pin = button("Pin sidebar", "pin");
    this.pin.addEventListener(
      "click",
      () => void this.setSettings({ pinned: !this.settings.pinned }),
    );
    const side = button("Move sidebar to left", "arrow");
    side.classList.add("side-toggle");
    side.addEventListener(
      "click",
      () =>
        void this.setSettings({
          side: this.settings.side === "left" ? "right" : "left",
        }),
    );
    const close = button("Close sidebar", "close");
    close.addEventListener(
      "click",
      () => void this.setSettings({ open: false }, true),
    );
    actions.append(this.pin, side, close);
    header.append(brand, actions);
    this.panel.append(header);

    const searchBox = document.createElement("label");
    searchBox.className = "search";
    searchBox.append(icon("search"));
    this.search = document.createElement("input");
    this.search.type = "search";
    this.search.placeholder = "Find a repository…";
    this.search.setAttribute("aria-label", "Search bookmarks");
    this.search.addEventListener("input", () => this.filter());
    searchBox.append(this.search);
    this.panel.append(searchBox);

    const section = document.createElement("section");
    section.className = "favorites";
    const sectionHeader = document.createElement("div");
    sectionHeader.className = "section-header";
    const sectionTitle = document.createElement("h2");
    sectionTitle.textContent = "SAVED REPOSITORIES";
    this.count = document.createElement("span");
    this.count.className = "count";
    sectionHeader.append(sectionTitle, this.count);
    const addFolder = button("Create folder", "plus");
    addFolder.addEventListener("click", () => void this.createFolder());
    sectionHeader.append(addFolder);
    this.list = document.createElement("ul");
    this.list.className = "bookmark-list";
    section.append(sectionHeader, this.list);
    this.panel.append(section);

    const footer = document.createElement("footer");
    this.addCurrent = document.createElement("button");
    this.addCurrent.type = "button";
    this.addCurrent.className = "add-current";
    this.addCurrent.append(
      icon("plus"),
      document.createTextNode("Add current repository"),
    );
    this.addCurrent.addEventListener("click", () => void this.toggleCurrent());
    const settingsButton = button("Manage Enterprise hosts", "settings");
    settingsButton.addEventListener(
      "click",
      () => void chrome.runtime.openOptionsPage(),
    );
    const themeButton = button("Change theme", "sun");
    themeButton.addEventListener(
      "click",
      () =>
        void this.setSettings({
          theme: this.host.dataset.theme === "dark" ? "light" : "dark",
        }),
    );
    themeButton.dataset.action = "theme";
    footer.append(this.addCurrent, themeButton, settingsButton);
    this.panel.append(footer);

    const resize = document.createElement("div");
    resize.className = "resize";
    resize.setAttribute("role", "separator");
    resize.setAttribute("aria-label", "Resize bookmarks sidebar");
    resize.setAttribute("aria-orientation", "vertical");
    resize.setAttribute("aria-valuemin", "260");
    resize.setAttribute("aria-valuemax", "520");
    resize.tabIndex = 0;
    resize.addEventListener("pointerdown", (event) =>
      this.startResize(event, resize),
    );
    resize.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const sign = this.settings.side === "right" ? -1 : 1;
      void this.setSettings({
        width:
          this.settings.width +
          (event.key === "ArrowRight" ? sign : -sign) * 16,
      });
    });
    this.panel.append(resize);
    this.status = document.createElement("div");
    this.status.className = "sr-only";
    this.status.setAttribute("role", "status");
    this.status.setAttribute("aria-live", "polite");
    this.root.append(this.status);

    this.oldPadding = {
      left: document.documentElement.style.paddingLeft,
      right: document.documentElement.style.paddingRight,
    };
    document.body.append(this.host);
    this.themeObserver = new MutationObserver(() => this.syncTheme());
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-color-mode", "data-dark-theme", "class", "style"],
    });
    this.colorScheme.addEventListener("change", this.syncTheme);
    this.syncTheme();
    this.render();
  }

  setCurrent(repo: Repository | null): void {
    if (this.current?.id === repo?.id) return;
    this.current = repo;
    this.render();
  }

  setState(state: State): void {
    const bookmarksChanged =
      JSON.stringify(this.bookmarks) !== JSON.stringify(state.bookmarks);
    const foldersChanged =
      JSON.stringify(this.folders) !== JSON.stringify(state.folders);
    this.bookmarks = state.bookmarks;
    this.folders = state.folders;
    this.settings = state.settings;
    if (bookmarksChanged || foldersChanged) this.renderList();
    this.renderSettings();
    this.renderFooter();
  }

  announce(message: string): void {
    this.status.textContent = message;
  }

  private syncTheme = (): void => {
    const html = document.documentElement;
    const mode = html.getAttribute("data-color-mode");
    const dark =
      mode === "dark" ||
      (mode === "auto" && this.colorScheme.matches) ||
      (!mode &&
        (html.getAttribute("data-dark-theme") !== null ||
          getComputedStyle(html).colorScheme.includes("dark")));
    this.host.dataset.theme =
      this.settings.theme === "auto"
        ? dark
          ? "dark"
          : "light"
        : this.settings.theme;
  };

  private async setSettings(
    patch: Partial<Settings>,
    focus = false,
  ): Promise<void> {
    this.settings = { ...this.settings, ...patch };
    this.renderSettings();
    if (focus) (this.settings.open ? this.search : this.handle).focus();
    try {
      await send({ type: "settings", patch });
    } catch (error) {
      this.announce(String(error));
    }
  }

  private render(): void {
    this.renderList();
    this.renderSettings();
    this.renderFooter();
  }

  private renderSettings(): void {
    this.host.dataset.open = String(this.settings.open);
    this.host.dataset.side = this.settings.side;
    this.host.style.setProperty("--panel-width", `${this.settings.width}px`);
    this.host.style.setProperty(
      "--handle-ratio",
      String(this.settings.handleY / 100),
    );
    this.syncTheme();
    const themeButton = this.root.querySelector<HTMLButtonElement>(
      '[data-action="theme"]',
    );
    if (themeButton)
      themeButton.title = `Theme: ${this.settings.theme}. Click to switch light/dark`;
    const resize = this.root.querySelector<HTMLElement>(".resize");
    resize?.setAttribute("aria-valuenow", String(this.settings.width));
    resize?.setAttribute("aria-valuetext", `${this.settings.width} pixels`);
    this.handle.setAttribute("aria-expanded", String(this.settings.open));
    this.handle.setAttribute("aria-controls", this.panel.id);
    this.panel.setAttribute("aria-hidden", String(!this.settings.open));
    this.panel.inert = !this.settings.open;
    this.pin.setAttribute("aria-pressed", String(this.settings.pinned));
    this.pin.setAttribute(
      "aria-label",
      this.settings.pinned ? "Unpin sidebar" : "Pin sidebar",
    );
    const sideButton =
      this.root.querySelector<HTMLButtonElement>(".side-toggle");
    if (sideButton)
      sideButton.setAttribute(
        "aria-label",
        `Move sidebar to ${this.settings.side === "left" ? "right" : "left"}`,
      );
    document.documentElement.style.paddingLeft =
      this.settings.open &&
      this.settings.pinned &&
      this.settings.side === "left"
        ? `${this.settings.width}px`
        : this.oldPadding.left;
    document.documentElement.style.paddingRight =
      this.settings.open &&
      this.settings.pinned &&
      this.settings.side === "right"
        ? `${this.settings.width}px`
        : this.oldPadding.right;
  }

  private renderFooter(): void {
    this.addCurrent.hidden =
      !this.current ||
      this.bookmarks.some((item) => item.id === this.current?.id);
  }

  private filter(): void {
    this.renderList();
  }

  private renderList(): void {
    const focused = this.root.activeElement as HTMLElement | null;
    const focusedId = focused?.closest("[data-id]")?.getAttribute("data-id");
    const focusedAction = focused?.dataset.action;
    this.list.replaceChildren();
    this.count.textContent = String(this.bookmarks.length);
    const visible = filterBookmarks(this.bookmarks, this.search.value);
    for (const folder of this.folders) {
      const group = document.createElement("li");
      group.className = "folder";
      const header = document.createElement("div");
      header.className = "folder-header";
      const toggle = button(
        `${this.collapsed.has(folder.id) ? "Expand" : "Collapse"} ${folder.name}`,
        "chevron",
      );
      toggle.classList.add("folder-toggle");
      toggle.setAttribute(
        "aria-expanded",
        String(!this.collapsed.has(folder.id)),
      );
      toggle.append(document.createTextNode(` ${folder.name}`));
      toggle.addEventListener("click", () => {
        if (!this.collapsed.delete(folder.id)) this.collapsed.add(folder.id);
        this.renderList();
      });
      const remove = button(`Delete folder ${folder.name}`, "trash");
      remove.addEventListener(
        "click",
        () => void send({ type: "remove-folder", id: folder.id }),
      );
      header.append(toggle, remove);
      const children = document.createElement("ul");
      children.className = "folder-items";
      if (!this.collapsed.has(folder.id) || this.search.value)
        for (const item of visible.filter(
          (item) => item.folderId === folder.id,
        ))
          children.append(this.row(item));
      group.addEventListener("dragover", (event) => {
        event.preventDefault();
        group.classList.add("drop-target");
      });
      group.addEventListener("dragleave", () =>
        group.classList.remove("drop-target"),
      );
      group.addEventListener("drop", (event) => {
        event.preventDefault();
        group.classList.remove("drop-target");
        const id = event.dataTransfer?.getData("text/plain");
        if (id) void send({ type: "move-folder", id, folderId: folder.id });
      });
      group.append(header, children);
      this.list.append(group);
    }
    for (const item of visible.filter(
      (item) =>
        !item.folderId ||
        !this.folders.some((folder) => folder.id === item.folderId),
    ))
      this.list.append(this.row(item));
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = this.bookmarks.length
      ? "No repositories match your search."
      : "No bookmarks yet. Open a repository and save it here.";
    empty.hidden = visible.length > 0;
    this.list.append(empty);
    if (focusedId && focusedAction) {
      const row = Array.from(this.list.children).find(
        (element) => (element as HTMLElement).dataset.id === focusedId,
      );
      row
        ?.querySelector<HTMLElement>(`[data-action="${focusedAction}"]`)
        ?.focus();
    }
  }

  private row(item: Bookmark): HTMLLIElement {
    const row = document.createElement("li");
    row.className = "bookmark-row";
    row.dataset.id = item.id;
    if (item.id === this.current?.id) row.dataset.active = "true";
    row.draggable = true;
    row.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData("text/plain", item.id);
      if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", () => row.classList.remove("dragging"));
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      row.classList.add("drop-target");
    });
    row.addEventListener("dragleave", () =>
      row.classList.remove("drop-target"),
    );
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("drop-target");
      const id = event.dataTransfer?.getData("text/plain");
      if (id) void this.reorder(id, item.id);
    });
    const grip = document.createElement("span");
    grip.className = "grip";
    grip.append(icon("grip"));
    const link = document.createElement("a");
    link.href = item.url;
    link.className = "repo-link";
    link.dataset.action = "link";
    const name = document.createElement("strong");
    name.textContent = item.label || `${item.owner} / ${item.name}`;
    const host = document.createElement("small");
    host.textContent = new URL(item.origin).hostname;
    link.append(name, host);
    const actions = document.createElement("div");
    actions.className = "row-actions";
    const up = button(`Move ${item.name} up`, "up");
    up.dataset.action = "up";
    up.addEventListener("click", () => void this.moveBy(item.id, -1));
    const down = button(`Move ${item.name} down`, "down");
    down.dataset.action = "down";
    down.addEventListener("click", () => void this.moveBy(item.id, 1));
    const remove = button(`Remove ${item.name}`, "trash");
    remove.dataset.action = "remove";
    remove.addEventListener("click", () => void this.remove(item.id));
    const rename = button(`Rename ${item.name}`, "edit");
    rename.dataset.action = "rename";
    rename.addEventListener("click", () => void this.rename(item));
    const folder = document.createElement("select");
    folder.setAttribute("aria-label", `Folder for ${item.label || item.name}`);
    folder.append(new Option("No folder", ""));
    for (const entry of this.folders)
      folder.append(new Option(entry.name, entry.id));
    folder.value = item.folderId ?? "";
    folder.addEventListener(
      "change",
      () =>
        void send({
          type: "move-folder",
          id: item.id,
          folderId: folder.value || null,
        }),
    );
    actions.append(folder, rename, up, down, remove);
    row.append(grip, link, actions);
    return row;
  }

  private async reorder(id: string, targetId: string): Promise<void> {
    try {
      await send({ type: "reorder", id, targetId });
      this.announce("Bookmark moved");
    } catch (error) {
      this.announce(String(error));
    }
  }

  private async moveBy(id: string, offset: number): Promise<void> {
    const index = this.bookmarks.findIndex((item) => item.id === id);
    const target = this.bookmarks[index + offset];
    if (target) await this.reorder(id, target.id);
  }

  private async remove(id: string): Promise<void> {
    try {
      await send({ type: "remove", id });
      this.announce("Bookmark removed");
    } catch (error) {
      this.announce(String(error));
    }
  }

  private async toggleCurrent(): Promise<void> {
    if (!this.current) return;
    try {
      await send({ type: "toggle", url: this.current.url });
      this.announce("Repository saved");
    } catch (error) {
      this.announce(String(error));
    }
  }

  private async rename(item: Bookmark): Promise<void> {
    const label = prompt(
      "Bookmark name (leave empty to restore the original)",
      item.label ?? `${item.owner} / ${item.name}`,
    );
    if (label !== null) await send({ type: "rename", id: item.id, label });
  }

  private async createFolder(): Promise<void> {
    const name = prompt("New folder name");
    if (name?.trim())
      await send({ type: "add-folder", name: name.trim().slice(0, 100) });
  }

  private startHandleDrag(event: PointerEvent): void {
    if (event.button !== 0) return;
    const startX = event.clientX;
    const startY = event.clientY;
    let moved = false;
    this.handle.setPointerCapture(event.pointerId);
    const move = (next: PointerEvent) => {
      if (Math.abs(next.clientY - startY) + Math.abs(next.clientX - startX) > 6)
        moved = true;
      if (!moved) return;
      const ratio = (next.clientY - 36) / Math.max(1, innerHeight - 72);
      this.settings.handleY = Math.max(0, Math.min(1, ratio)) * 100;
      this.settings.side = next.clientX < innerWidth / 2 ? "left" : "right";
      this.renderSettings();
    };
    const end = () => {
      this.handle.removeEventListener("pointermove", move);
      this.handle.removeEventListener("pointerup", end);
      this.handle.removeEventListener("pointercancel", end);
      if (moved) {
        const swallow = (click: Event) => click.stopImmediatePropagation();
        this.handle.addEventListener("click", swallow, { capture: true });
        window.setTimeout(
          () => this.handle.removeEventListener("click", swallow, true),
          0,
        );
        void this.setSettings({
          handleY: this.settings.handleY,
          side: this.settings.side,
        });
      }
    };
    this.handle.addEventListener("pointermove", move);
    this.handle.addEventListener("pointerup", end);
    this.handle.addEventListener("pointercancel", end);
  }

  private startResize(event: PointerEvent, grip: HTMLElement): void {
    if (event.button !== 0) return;
    event.preventDefault();
    grip.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startWidth = this.settings.width;
    const move = (next: PointerEvent) => {
      const direction = this.settings.side === "right" ? -1 : 1;
      this.settings.width = Math.max(
        260,
        Math.min(520, startWidth + (next.clientX - startX) * direction),
      );
      this.renderSettings();
    };
    const end = () => {
      grip.removeEventListener("pointermove", move);
      grip.removeEventListener("pointerup", end);
      grip.removeEventListener("pointercancel", end);
      void this.setSettings({ width: this.settings.width });
    };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", end);
    grip.addEventListener("pointercancel", end);
    this.resizeCleanup = end;
  }

  destroy(): void {
    this.resizeCleanup?.();
    this.themeObserver.disconnect();
    this.colorScheme.removeEventListener("change", this.syncTheme);
    document.documentElement.style.paddingLeft = this.oldPadding.left;
    document.documentElement.style.paddingRight = this.oldPadding.right;
    this.host.remove();
  }
}
