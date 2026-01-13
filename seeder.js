import fs from "fs";
import path from "path";
import TurndownService from "turndown";

const data = JSON.parse(fs.readFileSync("output.json", "utf8"));

const blogs = data.blogs ?? [];
const categories = data.categories ?? [];

const BLOG_DIR = "./src/content/blog";
const ASSET_DIR = "./src/assets";
const DEFAULT_HERO = "../../assets/blog-placeholder.jpg";

if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

// ================= CATEGORY MAP =================
const categoryMap = {};
for (const c of categories) {
  categoryMap[c.id] = c.name;
}

// ================= TURNDOWN =================
const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});
turndown.keep(["br"]);

// ================= HELPERS =================
function formatDate(sqlDate) {
  return sqlDate ? new Date(sqlDate).toDateString() : "";
}

function estimateReadTime(html) {
  const text = html.replace(/<[^>]+>/g, "");
  return Math.max(1, Math.ceil(text.length / 1000));
}

function resolveHero(imagePath) {
  if (!imagePath) return DEFAULT_HERO;

  // imagePath = "blog-images/xxx.jpg"
  const abs = path.join(ASSET_DIR, imagePath);

  if (fs.existsSync(abs)) {
    return `../../assets/${imagePath}`;
  }

  return DEFAULT_HERO;
}

// ================= MAIN =================
for (const blog of blogs) {
  if (!blog.slug || !blog.content) continue;

  const categoryIds = JSON.parse(blog.categories || "[]");
  const categoryNames = categoryIds.map(
    (id) => categoryMap[id] ?? `Category ${id}`
  );

  const markdown = turndown.turndown(blog.content).trim();

  const frontmatter = `---
title: "${blog.title.replace(/"/g, '\\"')}"
description: "${(blog.description || "").replace(/"/g, '\\"')}"
pubDate: "${formatDate(blog.published_at || blog.created_at)}"
heroImage: "${resolveHero(blog.image)}"
slug: "${blog.slug}"
read_time: ${estimateReadTime(blog.content)}
categories: ${JSON.stringify(categoryNames)}
---
`;

  const outPath = path.join(BLOG_DIR, `${blog.slug}.mdx`);
  fs.writeFileSync(outPath, frontmatter + "\n\n" + markdown);

  console.log("✔", blog.slug);
}

console.log(`\nDONE: ${blogs.length} blogs exported`);
