import { chromium } from "playwright-core";
import { readFile, writeFile, cp, mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import assert from "node:assert/strict";

const profile = await mkdtemp(join(tmpdir(), "ghb-browser-"));
const extension = join(profile, "extension");
await cp(resolve("dist"), extension, { recursive: true });
const contentPath = join(extension, "content.js");
const content = await readFile(contentPath, "utf8");
// Expose the test copy's shadow tree to Playwright; production keeps it closed.
assert.equal(content.includes('attachShadow({mode:"closed"})'), true);
await writeFile(
  contentPath,
  content.replace(
    'attachShadow({mode:"closed"})',
    'attachShadow({mode:"open"})',
  ),
);
const manifestPath = join(extension, "manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
// The test profile grants one exact fixture host; the production manifest stays optional.
manifest.host_permissions.push("https://github.company.example/*");
await writeFile(manifestPath, JSON.stringify(manifest));
const context = await chromium.launchPersistentContext(profile, {
  executablePath: chromium.executablePath(),
  headless: true,
  args: [
    `--disable-extensions-except=${extension}`,
    `--load-extension=${extension}`,
  ],
});

try {
  const worker =
    context.serviceWorkers()[0] ??
    (await context.waitForEvent("serviceworker"));
  const extensionId = new URL(worker.url()).host;
  const repoHtml = await readFile("tests/fixtures/ghes-repo.html", "utf8");
  const fallbackHtml = await readFile(
    "tests/fixtures/ghes-repo-fallback.html",
    "utf8",
  );
  const orgHtml = await readFile("tests/fixtures/ghes-org.html", "utf8");
  const page = await context.newPage();
  await page.route("https://github.com/**", async (route) => {
    await route.fulfill({
      contentType: "text/html",
      body: /\/acme\/(tool|other)/.test(route.request().url())
        ? route.request().url().includes("/acme/other")
          ? repoHtml.replaceAll("acme / tool", "acme / other")
          : repoHtml
        : orgHtml,
    });
  });
  await page.goto("https://github.com/acme/tool");
  await page.locator("gh-bookmarks").waitFor();
  await page.locator(".ghb-action").waitFor();
  assert.equal(await page.locator(".ghb-action").count(), 1);
  await page.locator(".ghb-action").click();
  await page.waitForFunction(
    () =>
      document.querySelector(".ghb-action")?.getAttribute("aria-pressed") ===
      "true",
  );
  await page.locator("gh-bookmarks").locator(".edge-handle").click();
  await page.locator("gh-bookmarks").locator(".repo-link").waitFor();
  await page.waitForFunction(
    () =>
      getComputedStyle(
        document
          .querySelector("gh-bookmarks")
          .shadowRoot.querySelector(".panel"),
      ).transform === "matrix(1, 0, 0, 1, 0, 0)",
  );
  assert.match(
    await page.locator("gh-bookmarks").locator(".repo-link").innerText(),
    /acme \/ tool/,
  );
  await mkdir("screenshots", { recursive: true });
  await page.screenshot({ path: "screenshots/light.png", fullPage: false });
  await page.evaluate(() =>
    document.documentElement.setAttribute("data-color-mode", "dark"),
  );
  await page.waitForFunction(
    () =>
      document.querySelector("gh-bookmarks")?.getAttribute("data-theme") ===
      "dark",
  );
  await page.waitForFunction(
    () =>
      getComputedStyle(
        document
          .querySelector("gh-bookmarks")
          .shadowRoot.querySelector(".bookmark-row"),
      ).backgroundColor === "rgb(21, 27, 35)",
  );
  await page.screenshot({ path: "screenshots/dark.png", fullPage: false });

  const second = await context.newPage();
  await second.route("https://github.com/**", (route) =>
    route.fulfill({ contentType: "text/html", body: repoHtml }),
  );
  await second.goto("https://github.com/acme/tool");
  await second.locator(".ghb-action").waitFor();
  assert.equal(
    await second.locator(".ghb-action").getAttribute("aria-pressed"),
    "true",
  );
  await page.locator(".ghb-action").click();
  await second.waitForFunction(
    () =>
      document.querySelector(".ghb-action")?.getAttribute("aria-pressed") ===
      "false",
  );
  await page.locator(".ghb-action").click();
  await second.waitForFunction(
    () =>
      document.querySelector(".ghb-action")?.getAttribute("aria-pressed") ===
      "true",
  );
  await second.close();

  await page.evaluate(() => {
    history.pushState({}, "", "/acme/other");
    document.querySelector("main h1").textContent = "acme / other";
    document.querySelector("#repository-container-header h1").textContent =
      "acme / other";
    dispatchEvent(new Event("soft-nav:end"));
  });
  await page.waitForFunction(
    () =>
      document.querySelector(".ghb-action")?.getAttribute("aria-pressed") ===
      "false",
  );
  await page.evaluate(() => {
    document.querySelector("#repository-container-header").innerHTML =
      '<h1>acme / other</h1><ul class="pagehead-actions"><li><button>Star</button></li></ul>';
  });
  await page.locator(".ghb-action").waitFor();
  assert.equal(await page.locator(".ghb-action").count(), 1);
  await page.evaluate(() => {
    document.querySelector("#repository-container-header").innerHTML =
      "<h1>acme / other</h1><div>Repository actions unavailable</div>";
  });
  await page.locator("#repository-container-header .ghb-action").waitFor();
  assert.equal(await page.locator(".ghb-action").count(), 1);
  await page.locator(".ghb-action").click();
  await page.locator("gh-bookmarks").locator(".bookmark-row").last().waitFor();
  await page.evaluate(() => {
    history.pushState({}, "", "/acme/other/issues/1");
    dispatchEvent(new Event("soft-nav:end"));
  });
  await page.waitForFunction(() => !document.querySelector(".ghb-action"));
  assert.equal(await page.locator("gh-bookmarks").count(), 1);
  await page.evaluate(() => {
    history.pushState({}, "", "/acme/projects");
    dispatchEvent(new Event("soft-nav:end"));
  });
  await page.waitForFunction(
    () =>
      document
        .querySelector("gh-bookmarks")
        ?.shadowRoot.querySelector(".add-current")?.hidden === true,
  );
  await page.evaluate(() => {
    history.pushState({}, "", "/acme/other");
    dispatchEvent(new Event("soft-nav:end"));
  });
  await page.locator(".ghb-action").waitFor();
  const search = page.locator("gh-bookmarks").locator('input[type="search"]');
  await search.fill("other");
  assert.equal(
    await page.locator("gh-bookmarks").locator(".bookmark-row:visible").count(),
    1,
  );
  await search.fill("");
  await page
    .locator("gh-bookmarks")
    .locator(".bookmark-row")
    .filter({ hasText: "other" })
    .locator('[data-action="down"]')
    .click();
  await page.waitForFunction(
    () =>
      document
        .querySelector("gh-bookmarks")
        .shadowRoot.querySelector(".bookmark-row .repo-link strong")
        ?.textContent === "acme / tool",
  );
  await page
    .locator("gh-bookmarks")
    .getByRole("button", { name: "Pin sidebar" })
    .click();
  assert.equal(
    await page.evaluate(() => document.documentElement.style.paddingRight),
    "320px",
  );
  await page
    .locator("gh-bookmarks")
    .getByRole("button", { name: "Move sidebar to left" })
    .click();
  assert.equal(
    await page.evaluate(() => document.documentElement.style.paddingLeft),
    "320px",
  );
  await page
    .locator("gh-bookmarks")
    .getByRole("separator", { name: "Resize bookmarks sidebar" })
    .press("ArrowRight");
  assert.equal(
    await page.evaluate(() => document.documentElement.style.paddingLeft),
    "336px",
  );
  assert.equal(
    await page
      .locator("gh-bookmarks")
      .getByRole("separator")
      .getAttribute("aria-valuenow"),
    "336",
  );
  await page
    .locator("gh-bookmarks")
    .getByRole("button", { name: "Close sidebar" })
    .click();
  assert.equal(
    await page.evaluate(() => document.documentElement.style.paddingLeft),
    "",
  );

  const bar = page.locator("gh-bookmarks");
  const edge = bar.locator(".edge-handle");
  const box = await edge.boundingBox();
  const viewport = page.viewportSize() ?? { width: 1280, height: 720 };
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(viewport.width - 8, box.y + 150, { steps: 8 });
  await page.mouse.up();
  await page.waitForFunction(
    () => document.querySelector("gh-bookmarks").dataset.side === "right",
  );
  assert.equal(await edge.count(), 1);
  assert.equal(
    await page.evaluate(
      () => document.querySelector("gh-bookmarks").dataset.open,
    ),
    "false",
  );
  const themeBefore = await page.evaluate(
    () => document.querySelector("gh-bookmarks").dataset.theme,
  );
  await edge.click();
  await bar.getByRole("button", { name: "Change theme" }).click();
  assert.notEqual(
    await page.evaluate(
      () => document.querySelector("gh-bookmarks").dataset.theme,
    ),
    themeBefore,
  );
  page.once("dialog", (dialog) => dialog.accept("Renamed repo"));
  await bar
    .getByRole("button", { name: /^Rename/ })
    .first()
    .click({ force: true });
  await bar.locator(".repo-link strong", { hasText: "Renamed repo" }).waitFor();
  page.once("dialog", (dialog) => dialog.accept("Infra"));
  await bar.getByRole("button", { name: "Create folder" }).click();
  await bar.locator(".folder-toggle", { hasText: "Infra" }).waitFor();
  await bar
    .locator(".bookmark-row select")
    .first()
    .selectOption({ label: "Infra" });
  await bar.locator(".folder-items .bookmark-row").first().waitFor();
  await bar.locator(".folder-toggle", { hasText: "Infra" }).click();
  assert.equal(await bar.locator(".folder-items .bookmark-row").count(), 0);
  await bar.getByRole("button", { name: "Close sidebar" }).click();

  await page.reload();
  await page
    .locator("gh-bookmarks")
    .locator(".repo-link")
    .first()
    .waitFor({ state: "attached" });
  assert.equal(
    await page.locator(".ghb-action").getAttribute("aria-pressed"),
    "true",
  );
  await page.goto("https://github.com/acme/projects");
  await page.locator("gh-bookmarks").waitFor();
  assert.equal(await page.locator(".ghb-action").count(), 0);
  await page
    .locator("gh-bookmarks")
    .locator(".repo-link")
    .first()
    .waitFor({ state: "attached" });

  const options = await context.newPage();
  await options.goto(`chrome-extension://${extensionId}/options.html`);
  await options.locator("#host").waitFor();
  await worker.evaluate(async () => {
    await chrome.storage.local.set({ hosts: ["github.company.example"] });
    await chrome.scripting.registerContentScripts([
      {
        id: "ghb-company-fixture",
        matches: ["https://github.company.example/*"],
        js: ["content.js"],
        runAt: "document_idle",
      },
    ]);
  });
  const enterprise = await context.newPage();
  await enterprise.route("https://github.company.example/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: route.request().url().includes("/acme/fallback")
        ? fallbackHtml
        : repoHtml,
    }),
  );
  await enterprise.goto("https://github.company.example/acme/tool");
  await enterprise.locator("gh-bookmarks").waitFor();
  await enterprise.locator(".ghb-action").waitFor();
  assert.equal(
    await enterprise.locator(".ghb-action").getAttribute("aria-pressed"),
    "false",
  );
  await enterprise.locator(".ghb-action").click();
  await enterprise.locator("gh-bookmarks").locator(".edge-handle").click();
  await enterprise
    .locator("gh-bookmarks")
    .locator(".bookmark-row")
    .filter({ hasText: "github.company.example" })
    .waitFor();
  await enterprise.goto("https://github.company.example/acme/fallback");
  await enterprise.locator("header .ghb-action").waitFor();
  await enterprise.close();
  console.log(
    "Browser checks passed: button, sidebar, persistence, themes, org pages, Enterprise fixture.",
  );
} finally {
  await context.close();
  await rm(profile, { recursive: true, force: true });
}
