// @ts-check
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
// sitemap disabled - using custom dynamic routes (sitemap_index.xml + sitemap-N.xml)
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: "https://blog.alfiansa.web.id",
  integrations: [
    mdx(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
});
