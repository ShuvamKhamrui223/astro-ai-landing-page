import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      author: z.string(),
      heroImage: image(),
      categories: z.array(z.string()),
      tags: z.array(z.string()),
      publishDate: z.date().default(() => new Date()),
    }),
});

export const collections = { blog };
