import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import NewsBody from "@/components/NewsBody";
import ShareRow from "@/components/ShareRow";
import { site } from "@/lib/content";
import { client } from "@/sanity/lib/client";
import {
  CATEGORY_LABEL,
  NEWS_ITEM_QUERY,
  NEWS_SLUGS_QUERY,
  type NewsArticle,
} from "@/sanity/lib/queries";

export const revalidate = 60;

/* Only items that actually have a body get a page. A headline with
   nothing behind it would render an empty article, so it stays a plain
   card on /news and this route 404s for it. The same count(body) > 0
   rule lives in the article query and the sitemap. */
export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false })
    .fetch<string[]>(NEWS_SLUGS_QUERY);
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

async function getArticle(slug: string) {
  return client.fetch<NewsArticle | null>(NEWS_ITEM_QUERY, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "News" };

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: { canonical: `/news/${slug}` },
    openGraph: {
      type: "article",
      url: `/news/${slug}`,
      title: article.title,
      description: article.excerpt ?? undefined,
      publishedTime: article.publishedAt ?? undefined,
      images: article.cover?.url ? [article.cover.url] : undefined,
    },
  };
}

const formatDate = (iso: string | null) =>
  iso
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(iso))
    : null;

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const date = formatDate(article.publishedAt);
  const label = article.category ? CATEGORY_LABEL[article.category] : null;
  const url = `${site.url}/news/${slug}`;

  return (
    <article className="article">
      {/* Kicker, headline and standfirst sit in a narrow measure; the
          cover breaks wider below them. */}
      <header className="container article__head">
        <p className="article__kicker">
          {label && <span className="article__category">{label}</span>}
          {date && (
            <time dateTime={article.publishedAt ?? undefined}>{date}</time>
          )}
        </p>

        <h1 className="article__title">{article.title}</h1>

        {article.excerpt && (
          <p className="article__standfirst">{article.excerpt}</p>
        )}

        <ShareRow url={url} title={article.title} />
      </header>

      {article.cover?.url && (
        <figure className="article__cover">
          <Image
            src={article.cover.url}
            alt={article.cover.alt ?? ""}
            width={2000}
            height={1125}
            sizes="(max-width: 1180px) 100vw, 1180px"
            className="article__cover-img"
            placeholder={article.cover.lqip ? "blur" : "empty"}
            blurDataURL={article.cover.lqip ?? undefined}
            priority
          />
        </figure>
      )}

      {article.body && article.body.length > 0 && (
        <div className="container article__body">
          <NewsBody value={article.body} />
        </div>
      )}

      {/* At the end, not the top: a back link under the nav collided
          with it, and Apple's newsroom puts the way out after the read. */}
      <footer className="container article__foot">
        <Link href="/news" className="article__back">
          <span aria-hidden="true">←</span> All news
        </Link>
      </footer>
    </article>
  );
}
