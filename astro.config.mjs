// @ts-check
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://fiandev.com",
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "id",
        locales: {
          en: "en",
          id: "id",
        },
      },
      filter: (page) => page !== "https://fiandev.com/",
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
});
