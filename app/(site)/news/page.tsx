import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import PageHero from "@/components/PageHero";
import { client } from "@/sanity/lib/client";
import {
  CATEGORY_LABEL,
  NEWS_QUERY,
  type NewsListItem,
} from "@/sanity/lib/queries";

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

const formatDate = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(iso))
    : null;

function Card({ item }: { item: NewsListItem }) {
  const date = formatDate(item.publishedAt);

  return (
    <>
      {item.cover?.url && (
        <div className="news__thumb">
          <Image
            src={item.cover.url}
            alt={item.cover.alt ?? ""}
            fill
            sizes="(max-width: 760px) 100vw, 46vw"
            className="news__img"
            placeholder={item.cover.lqip ? "blur" : "empty"}
            blurDataURL={item.cover.lqip ?? undefined}
          />
        </div>
      )}
      <div className="news__body">
        <p className="news__meta">
          {item.category && (
            <span className="news__category">
              {CATEGORY_LABEL[item.category]}
            </span>
          )}
          {date && (
            <time dateTime={item.publishedAt ?? undefined}>{date}</time>
          )}
        </p>
        <h2 className="news__title">{item.title}</h2>
        {item.excerpt && <p className="news__excerpt">{item.excerpt}</p>}
      </div>
    </>
  );
}

export default async function News() {
  const news = await client.fetch<NewsListItem[]>(NEWS_QUERY);

  return (
    <>
      <PageHero
        tail="News & updates"
        lede="Partnerships, investments, and community initiatives from across Canadia Group."
      />

      <section className="container section section--after-hero">
        <ul className="news-grid">
          {news.map((n) => (
            /* Only linked when there is an article behind it. Linking a
               headline with no body would land on an empty page. */
            <li key={n._id} className="card news">
              {n.hasBody && n.slug ? (
                <Link href={`/news/${n.slug}`} className="news__link">
                  <Card item={n} />
                </Link>
              ) : (
                <Card item={n} />
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
