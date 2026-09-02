import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Image from "next/image";
import SectorGallery from "@/components/SectorGallery";
import { portfolio } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Canadia Impact Fund’s investments across healthcare, biotech, sustainable tech, education, AI, and logistics.",
  alternates: { canonical: "/portfolio" },
};

export default function Portfolio() {
  return (
    <>
      <PageHero
        lead="Investments that deliver"
        tail="measurable change"
        lede="We back scalable solutions across healthcare, sustainable tech, AI, education, biotech and logistics."
      />

      <SectorGallery />

      <section className="container section">
        <h2>Portfolio companies</h2>
        <div className="grid grid--3" style={{ marginTop: "var(--space-12)" }}>
          {portfolio.map((c) => (
            <a
              key={c.name}
              href={c.url}
              target="_blank"
              rel="noreferrer noopener"
              className="holding"
            >
              <Image
                src={c.logo}
                alt={`${c.name} logo`}
                width={c.logoW}
                height={c.logoH}
                sizes="200px"
                className="holding__logo"
              />
              <div>
                <h3>{c.name}</h3>
                <p>{c.sector}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
