import { defineQuery } from "groq";

/* Queries live together so the shapes the site depends on are visible in
   one place, and so TypeGen has a single file to read when it is set up.

   `!(_id in path("drafts.**"))` is not optional: the site reads with an
   unauthenticated client, which cannot see drafts anyway, but stating it
   keeps the query honest if a token is ever added. */

/* The list projection asks for lqip so cards can blur up rather than
   pop in, and for `hasBody` so the list knows which items have an
   article behind them. A headline with no body gets no link — better
   than a link to an empty page. */
const IMAGE_FIELDS = `{
  alt,
  "url": asset->url,
  "lqip": asset->metadata.lqip,
  "aspect": asset->metadata.dimensions.aspectRatio
}`;

export const NEWS_QUERY = defineQuery(`
  *[_type == "newsItem" && !(_id in path("drafts.**"))]
    | order(publishedAt desc) {
      _id,
      title,
      category,
      "slug": slug.current,
      publishedAt,
      excerpt,
      "cover": coverImage ${IMAGE_FIELDS},
      "hasBody": count(body) > 0
    }
`);

export const NEWS_SLUGS_QUERY = defineQuery(`
  *[_type == "newsItem" && !(_id in path("drafts.**")) && count(body) > 0]
    .slug.current
`);

/* `count(body) > 0` is the same rule NEWS_SLUGS_QUERY and the list's
   linking use. Without it here the document still resolves and the page
   renders a headline with nothing under it — a 200 for a URL nothing
   links to. */
// body[] resolves asset URLs for inline images, so the renderer never
// hits the API a second time mid-render.
//
// Note: a GROQ string only accepts double-slash comments. A block
// comment inside one is a parse error, and it surfaces only when the
// query runs — the build compiles and then fails at export.
export const NEWS_ITEM_QUERY = defineQuery(`
  *[_type == "newsItem"
      && !(_id in path("drafts.**"))
      && slug.current == $slug
      && count(body) > 0][0] {
    _id,
    title,
    category,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "cover": coverImage ${IMAGE_FIELDS},
    body[]{
      ...,
      _type == "captionedImage" => { ..., "url": asset->url, "lqip": asset->metadata.lqip }
    }
  }
`);

export type SanityImage = {
  alt: string | null;
  url: string | null;
  lqip: string | null;
  aspect: number | null;
} | null;

export type NewsCategory = "press-release" | "story" | "csr";

/* Display labels live with the type they describe, so adding a category
   in the Studio surfaces here as a type error rather than a blank chip. */
export const CATEGORY_LABEL: Record<NewsCategory, string> = {
  "press-release": "Press Release",
  story: "Story",
  csr: "CSR",
};

export type NewsListItem = {
  _id: string;
  title: string;
  category: NewsCategory | null;
  slug: string | null;
  publishedAt: string | null;
  excerpt: string | null;
  cover: SanityImage;
  hasBody: boolean;
};

export type NewsArticle = Omit<NewsListItem, "hasBody"> & {
  /* Portable Text blocks; typed loosely until TypeGen is wired. */
  body: unknown[] | null;
};
