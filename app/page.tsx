import Link from "next/link";
import HeroGradient from "@/components/HeroGradient";
import HomeMotion from "@/components/HomeMotion";
import { hero, whoWeAre, principles, sectors, news } from "@/lib/content";

export default function Home() {
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

      <section className="container section">
        <p className="lede hero__displaced" data-anim>{hero.body}</p>
        <div className="intro__actions" data-anim>
          <Link href="/portfolio" className="btn btn--primary">Explore the portfolio</Link>
          <Link href="/contact-us" className="btn btn--ghost">Get in touch</Link>
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow" data-anim>Who we are</p>
        <p style={{ fontSize: "var(--text-xl)", maxWidth: "70ch", marginTop: "var(--space-6)" }}>
          {whoWeAre}
        </p>
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
        <div className="grid grid--3" data-anim data-anim-stagger style={{ marginTop: "var(--space-12)" }}>
          {sectors.map((s) => (
            <article key={s.name} className="card">
              <h3>{s.name}</h3>
              <p>{s.tagline}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "var(--space-6)", flexWrap: "wrap" }}>
          <h2 data-anim>Latest news</h2>
          <Link href="/news" className="btn btn--ghost">View all</Link>
        </div>
        <div className="grid grid--3" data-anim data-anim-stagger style={{ marginTop: "var(--space-12)" }}>
          {news.map((n) => (
            <article key={n.slug} className="card">
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
