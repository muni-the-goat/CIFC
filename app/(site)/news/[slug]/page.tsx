import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import NewsBody from "@/components/NewsBody";
import { client } from "@/sanity/lib/client";
import {
  NEWS_ITEM_QUERY,
  NEWS_SLUGS_QUERY,
  type NewsArticle,
} from "@/sanity/lib/queries";

export const revalidate = 60;

/* Only items that actually have a body get a page. A headline with
   nothing behind it would render an empty article, so it stays a plain
   card on /news and this route 404s for it. */
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

  return (
    <article className="container section section--after-hero article">
      <Link href="/news" className="article__back">
        Back to news
      </Link>

      <header className="article__head">
        {date && (
          <p className="eyebrow">
            <time dateTime={article.publishedAt ?? undefined}>{date}</time>
          </p>
        )}
        <h1 className="article__title">{article.title}</h1>
        {article.excerpt && <p className="lede">{article.excerpt}</p>}
      </header>

      {article.cover?.url && (
        <figure className="article__cover">
          <Image
            src={article.cover.url}
            alt={article.cover.alt ?? ""}
            fill
            sizes="(max-width: 900px) 100vw, 1100px"
            className="article__cover-img"
            placeholder={article.cover.lqip ? "blur" : "empty"}
            blurDataURL={article.cover.lqip ?? undefined}
            priority
          />
        </figure>
      )}

      {article.body && article.body.length > 0 && (
        <NewsBody value={article.body} />
      )}
    </article>
  );
}
