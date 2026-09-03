import Link from "next/link";
import Image from "next/image";
import HeroGradient from "@/components/HeroGradient";
import HomeMotion from "@/components/HomeMotion";
import SectorGrid from "@/components/SectorGrid";
import { hero, whoWeAre, principles, imagery } from "@/lib/content";
import { client } from "@/sanity/lib/client";
import { NEWS_QUERY, type NewsListItem } from "@/sanity/lib/queries";

/* Matches /news — the two render the same list and must not disagree. */
export const revalidate = 60;

export default async function Home() {
  const news = await client.fetch<NewsListItem[]>(NEWS_QUERY);

  return (
    <>
      <HomeMotion />

      <section className="hero">
        <HeroGradient />
        <div className="container hero__inner">
          <h1 className="hero__title">
            <span className="hero__lead">
              {hero.titleLead.map((line, i) => (
                <span key={line} className="hero__line">
                  <span className="hero__line-inner" style={{ ["--i" as string]: i }}>
                    {line}
                  </span>
                </span>
              ))}
            </span>
            <span className="hero__tail">
              {hero.titleTail.map((line, i) => (
                <span key={line} className="hero__line">
                  <span
                    className="hero__line-inner"
                    style={{ ["--i" as string]: i + hero.titleLead.length }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </span>
          </h1>
        </div>
      </section>

      <section className="section intro">
        {/* Decorative: empty alt + aria-hidden so it is not announced. */}
        <Image
          src="/cifc-mark.png"
          alt=""
          aria-hidden="true"
          width={845}
          height={714}
          className="intro__mark"
        />
        <div className="container intro__inner">
          <p className="lede hero__displaced" data-anim>{hero.body}</p>
          <div className="intro__actions" data-anim>
            <Link href="/portfolio" className="btn btn--primary">Explore the portfolio</Link>
            <Link href="/contact-us" className="btn btn--ghost">Get in touch</Link>
          </div>
        </div>
      </section>

      <section className="feature">
        <Image
          src={imagery.kohPich.src}
          alt={imagery.kohPich.alt}
          fill
          sizes="100vw"
          className="feature__img"
        />
        <div className="container feature__inner">
          <h2 className="feature__label" data-anim>Who we are</h2>
          <p className="feature__copy" data-anim>{whoWeAre}</p>
        </div>
      </section>

      <section className="container section">
        <h2 data-anim>How we invest</h2>
        <div className="grid grid--3" data-anim data-anim-stagger style={{ marginTop: "var(--space-12)" }}>
          {principles.map((p) => (
            <article key={p.title} className="card">
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2 data-anim>Where we invest</h2>
        <SectorGrid />
      </section>

      <section className="container section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <h2 data-anim>Latest news</h2>
          <Link href="/news" className="btn btn--ghost">View all</Link>
        </div>
        <div className="grid grid--3" data-anim data-anim-stagger style={{ marginTop: "var(--space-12)" }}>
          {news.slice(0, 3).map((n) => (
            <article key={n._id} className="card">
              <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--fw-subtitle)" }}>
                {n.title}
              </h3>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
