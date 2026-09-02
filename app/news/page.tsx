import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { news } from "@/lib/content";

export const metadata: Metadata = {
  title: "News",
  description:
    "Updates from Canadia Impact Fund and Canadia Group — partnerships, investments, and community initiatives across Cambodia.",
  alternates: { canonical: "/news" },
};

export default function News() {
  return (
    <>
      <PageHero
        tail="News & updates"
        lede="Partnerships, investments, and community initiatives from across Canadia Group."
      />

      <section className="container section">
        <ul className="grid grid--2" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {news.map((n) => (
            <li key={n.slug} className="card">
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
