import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: { url: "https://github.company.example/acme/tool" },
    },
    clearMocks: true,
  },
});
