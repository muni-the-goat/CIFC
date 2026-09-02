import type { Metadata } from "next";
import { whoWeAre, mission, principles, stats, faq } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Canadia Impact Fund’s mission, vision, and values. We partner with entrepreneurs and organizations to drive lasting social and environmental impact.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <section className="container page-hero">
        <h1>
          <span className="hero__light">Shaping Tomorrow through</span>
          Responsible Investment
        </h1>
        <p className="lede">
          We partner with visionary entrepreneurs and organizations to create lasting
          social, environmental, and economic impact. By combining rigorous investment
          strategies with purpose-driven projects, we turn capital into measurable change,
          empowering communities and shaping a sustainable future for Cambodia and beyond.
        </p>
      </section>

      <section className="container section">
        <p className="eyebrow">Who we are</p>
        <p style={{ fontSize: "var(--text-xl)", maxWidth: "70ch", marginTop: "var(--space-6)" }}>
          {whoWeAre}
        </p>
      </section>

      <section className="container section">
        <p className="gradient-text" style={{ fontSize: "var(--h2)", fontWeight: "var(--fw-title)", lineHeight: "var(--leading-snug)", letterSpacing: "var(--tracking-tight)", maxWidth: "24ch" }}>
          {mission}
        </p>
      </section>

      <section className="container section">
        <h2>Our approach</h2>
        <div className="grid grid--3" style={{ marginTop: "var(--space-12)" }}>
          {principles.map((p) => (
            <article key={p.title} className="card">
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>Canadia Group in numbers</h2>
        <div className="grid grid--3" style={{ marginTop: "var(--space-12)" }}>
          {stats.map((s) => (
            <div key={s.label}>
              <p className="stat__value">{s.value}</p>
              <p className="stat__label">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>Quick answers to common questions</h2>
        <div style={{ marginTop: "var(--space-12)", maxWidth: "72ch" }}>
          {faq.map((f) => (
            <details key={f.q} style={{ borderTop: "1px solid color-mix(in srgb, var(--ink) 8%, transparent)", padding: "var(--space-6) 0" }}>
              <summary style={{ fontSize: "var(--h4)", fontWeight: "var(--fw-title)", cursor: "pointer" }}>
                {f.q}
              </summary>
              <p style={{ color: "var(--grey-700)", marginTop: "var(--space-4)" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
