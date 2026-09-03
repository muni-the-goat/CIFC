import type { MetadataRoute } from "next";

import { site } from "@/lib/content";
import { client } from "@/sanity/lib/client";
import { NEWS_SLUGS_QUERY } from "@/sanity/lib/queries";

/* Regenerated on the same timer as the pages themselves, so a newly
   published article is discoverable without a redeploy. */
export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/portfolio", "/our-team", "/news", "/contact-us"];

  const now = new Date();
  const pages: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: now,
    changeFrequency: r === "/news" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.8,
  }));

  /* Only articles with a body exist as pages — the same rule the list
     uses to decide what to link. */
  const slugs = await client.fetch<string[]>(NEWS_SLUGS_QUERY);

  return [
    ...pages,
    ...slugs.filter(Boolean).map((slug) => ({
      url: `${site.url}/news/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
