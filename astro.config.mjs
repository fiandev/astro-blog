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
        defaultLocale: "id", // Locale default
        locales: {
          en: "en", // Sesuai folder src/pages/en
          id: "id", // Sesuai folder src/pages/id
        },
      },
      // Hapus halaman redirect root dari sitemap (opsional)
      filter: (page) => page !== "https://fiandev.com/",
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "static",
});
