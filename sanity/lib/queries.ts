import { defineQuery } from "groq";

/* Queries live together so the shapes the site depends on are visible in
   one place, and so TypeGen has a single file to read when it is set up.

   `!(_id in path("drafts.**"))` is not optional: the site reads with an
   unauthenticated client, which cannot see drafts anyway, but stating it
   keeps the query honest if a token is ever added. */

export const NEWS_QUERY = defineQuery(`
  *[_type == "newsItem" && !(_id in path("drafts.**"))]
    | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      publishedAt,
      excerpt
    }
`);

export type NewsListItem = {
  _id: string;
  title: string;
  slug: string | null;
  publishedAt: string | null;
  excerpt: string | null;
};
