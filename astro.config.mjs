// @ts-check
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import netlify from '@astrojs/netlify';

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
  adapter: netlify(),
});
