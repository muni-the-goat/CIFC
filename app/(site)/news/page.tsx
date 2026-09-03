import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { client } from "@/sanity/lib/client";
import { NEWS_QUERY, type NewsListItem } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "News",
  description:
    "Updates from Canadia Impact Fund and Canadia Group — partnerships, investments, and community initiatives across Cambodia.",
  alternates: { canonical: "/news" },
};

/* Static, revalidated on a timer. Sanity's guidance for a marketing site
   that changes rarely — publishing does not trigger a redeploy, the next
   request after the window rebuilds the page. If a fetch fails, Next
   keeps serving the last good render rather than erroring. */
export const revalidate = 60;

export default async function News() {
  const news = await client.fetch<NewsListItem[]>(NEWS_QUERY);

  return (
    <>
      <PageHero
        tail="News & updates"
        lede="Partnerships, investments, and community initiatives from across Canadia Group."
      />

      <section className="container section section--after-hero">
        <ul className="grid grid--2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {news.map((n) => (
            <li key={n._id} className="card">
              <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--fw-subtitle)", lineHeight: "var(--leading-snug)" }}>
                {n.title}
              </h2>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
