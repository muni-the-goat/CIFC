import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { whoWeAre, mission, principles, stats, imagery, heritage } from "@/lib/content";
import Faq from "@/components/Faq";
import CountUp from "@/components/CountUp";

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

      {/* Same treatment as the home page: this block runs the identical
          copy, and two layouts for one paragraph read as two different
          claims. No data-anim here — /about mounts no motion component,
          so a gated reveal would strand the copy until the failsafe. */}
      <section className="feature feature--tall">
        <Image
          src={imagery.towerDusk.src}
          alt={imagery.towerDusk.alt}
          fill
          sizes="100vw"
          className="feature__img"
          priority
        />
        <div className="container feature__inner">
          <h2 className="feature__label">Who we are</h2>
          <p className="feature__copy">{whoWeAre}</p>
        </div>
      </section>

      <section className="container section section--statement">
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
        <h2>Rooted in Cambodia</h2>
        {/* NOTE: this line is mine, not client copy. Needs sign-off. */}
        <p className="lede heritage__lede">
          Cambodia’s inheritance runs from the temples of Angkor to the Phnom
          Penh skyline. That continuity is what our investments are built on.
        </p>
        <ul className="heritage">
          {heritage.map((h) => (
            <li key={h.src}>
              <figure className="heritage__item">
                <div className="heritage__frame">
                  <Image
                    src={h.src}
                    alt={h.alt}
                    fill
                    sizes="(max-width: 720px) 90vw, 31vw"
                    className="heritage__img"
                  />
                </div>
                <figcaption className="heritage__caption">{h.caption}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      {/* Image leads here, so the two splits on this page do not both
          run photograph-right. */}
      <section className="container section split split--flip">
        <figure className="split__figure">
          <Image
            src={imagery.towerNight.src}
            alt={imagery.towerNight.alt}
            fill
            sizes="(max-width: 880px) 100vw, 44vw"
            className="split__img"
          />
        </figure>
        <div>
          <h2>Canadia Group in numbers</h2>
          <div className="stats-stack">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="stat__value">
                  <CountUp value={s.value} />
                </p>
                <p className="stat__label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <h2>Quick answers to common questions</h2>
        <Faq />
      </section>
    </>
  );
}
