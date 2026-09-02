import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { whoWeAre, mission, principles, stats } from "@/lib/content";
import Faq from "@/components/Faq";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Canadia Impact Fund’s mission, vision, and values. We partner with entrepreneurs and organizations to drive lasting social and environmental impact.",
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <PageHero
        lead="Shaping Tomorrow through"
        tail="Responsible Investment"
        lede="We partner with visionary entrepreneurs and organizations to create lasting social, environmental, and economic impact. By combining rigorous investment strategies with purpose-driven projects, we turn capital into measurable change, empowering communities and shaping a sustainable future for Cambodia and beyond."
      />

      <section className="container section">
        <p className="eyebrow">Who we are</p>
        <p style={{ fontSize: "var(--text-xl)", maxWidth: "70ch", marginTop: "var(--space-6)" }}>
          {whoWeAre}
        </p>
      </section>

      <section className="container section">
        {/* Runs the full container: the Infinity Horizon gradient is a
            90deg sweep, and a narrow measure compressed all three stops
            into a few words. */}
        <p className="mission gradient-text">{mission}</p>
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
        <Faq />
      </section>
    </>
  );
}
