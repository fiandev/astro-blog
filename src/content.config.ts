import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      // Transform string to Date object
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: image().optional(),
      read_time: z.number().optional(),
      categories: z.array(z.string()).optional(),
      slug: z.string(),
      views: z.number().default(0),
      author: z
        .object({
          name: z.string(),
          bio: z.string().optional(),
          gravatar: z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { blog };
