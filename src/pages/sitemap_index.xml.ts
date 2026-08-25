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

function generateSitemapIndexXml(totalSitemaps: number): string {
  const sitemaps = Array.from({ length: totalSitemaps }, (_, i) => i + 1);
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((n) => `  <sitemap>
    <loc>${SITE_URL}/sitemap-${n}.xml</loc>
  </sitemap>`).join("\n")}
</sitemapindex>`;
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

export const GET: APIRoute = async ({ params, url }) => {
  const isIndex = url.pathname === "/sitemap_index.xml" || url.pathname === "/sitemap-index.xml";

  if (isIndex) {
    const blogs = await fetchBlogs();
    const totalUrls = staticPages.length + blogs.length * 2;
    const totalSitemaps = Math.max(1, Math.ceil(totalUrls / URLS_PER_SITEMAP));

    return new Response(generateSitemapIndexXml(totalSitemaps), {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

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
