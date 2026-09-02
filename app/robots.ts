import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    /* /studio is the CMS admin UI, not content. */
    rules: { userAgent: "*", allow: "/", disallow: "/studio" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
