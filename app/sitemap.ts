import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/portfolio", "/our-team", "/news", "/contact-us"];
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: new Date(),
    changeFrequency: r === "/news" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.8,
  }));
}
