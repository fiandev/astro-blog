import rss from "@astrojs/rss";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { fetchBlogs } from "../utils/blog-api";

export async function GET(context) {
  const posts = await fetchBlogs();
  
  return rss({
    title: post.title || SITE_TITLE,
    description: post.description || SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/read/${post.slug}/`,
    })),
  });
}
