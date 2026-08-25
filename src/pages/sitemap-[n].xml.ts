import type { APIRoute } from "astro";
import { fetchBlogs } from "../utils/blog-api";

export const prerender = false;

const SITE_URL = "https://blog.fiandev.com";
const URLS_PER_SITEMAP = 50;

const staticPages = [
  { path: "/", priority: "1.0", changefreq: "daily" },
  { path: "/en", priority: "0.9", changefreq: "daily" },
  { path: "/id", priority: "0.9", changefreq: "daily" },
  { path: "/en/about", priority: "0.7", changefreq: "monthly" },
  { path: "/id/about", priority: "0.7", changefreq: "monthly" },
  { path: "/en/blogs", priority: "0.8", changefreq: "weekly" },
  { path: "/id/blogs", priority: "0.8", changefreq: "weekly" },
];

function formatDate(date: string | Date): string {
  return new Date(date).toISOString().split("T")[0];
}

function generateSitemapXml(
  urls: Array<{ loc: string; lastmod: string; priority: string; changefreq: string }>
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

export const GET: APIRoute = async ({ params }) => {
  const pageNum = parseInt(params?.n || "1", 10);
  const blogs = await fetchBlogs();

  const allUrls: Array<{ loc: string; lastmod: string; priority: string; changefreq: string }> = [
    ...staticPages.map((p) => ({
      loc: `${SITE_URL}${p.path}`,
      lastmod: formatDate(new Date()),
      priority: p.priority,
      changefreq: p.changefreq,
    })),
  ];

  for (const blog of blogs) {
    allUrls.push({
      loc: `${SITE_URL}/id/blogs/${blog.slug}`,
      lastmod: formatDate(blog.updatedAt || blog.createdAt),
      priority: "0.9",
      changefreq: "daily",
    });
    allUrls.push({
      loc: `${SITE_URL}/en/blogs/${blog.slug}`,
      lastmod: formatDate(blog.updatedAt || blog.createdAt),
      priority: "0.9",
      changefreq: "daily",
    });
  }

  const start = (pageNum - 1) * URLS_PER_SITEMAP;
  const end = start + URLS_PER_SITEMAP;
  const pageUrls = allUrls.slice(start, end);

  if (pageUrls.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(generateSitemapXml(pageUrls), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
