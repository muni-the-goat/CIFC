import type { Metadata } from "next";
import { sectors, portfolio } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Canadia Impact Fund’s investments across healthcare, biotech, sustainable tech, education, AI, and logistics.",
  alternates: { canonical: "/portfolio" },
};

export default function Portfolio() {
  return (
    <>
      <section className="container page-hero">
        <h1>
          <span className="hero__light">Investments that deliver</span>
          measurable change
        </h1>
        <p className="lede">
          We back scalable solutions across healthcare, sustainable tech, AI, education,
          biotech and logistics.
        </p>
      </section>

      <section className="container section">
        <h2>Backing bold solutions creating real impact</h2>
        <div className="grid grid--3" style={{ marginTop: "var(--space-12)" }}>
          {sectors.map((s) => (
            <article key={s.name} className="card">
              <h3>{s.name}</h3>
              <p>{s.tagline}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>Portfolio companies</h2>
        <div className="grid grid--3" style={{ marginTop: "var(--space-12)" }}>
          {portfolio.map((c) => (
            <a key={c.name} href={c.url} target="_blank" rel="noreferrer noopener" className="card">
              <h3>{c.name}</h3>
              <p>{c.sector}</p>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
