import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/PageHero";
import { team } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Team",
  description:
    "Discover the professionals behind Canadia Impact Fund. Our experienced leadership and expert team drive impact-focused investments across Cambodia.",
  alternates: { canonical: "/our-team" },
};

export default function Team() {
  return (
    <>
      <PageHero
        lead="Meet the people powering"
        tail="Canadia Impact Fund"
        lede="A team of investors, operators, and experts, united by purpose."
      />

      <section className="container section section--after-hero">
        <ul className="team-grid">
          {team.map((m, i) => (
            /* Staggered rise is a CSS keyframe, not GSAP — this page
               mounts no motion component, and a portrait must never be
               left invisible waiting on a script. */
            <li key={m.name} className="member" style={{ ["--i" as string]: i }}>
              <div className="member__frame">
                <Image
                  src={m.photo}
                  alt={`Portrait of ${m.name}`}
                  fill
                  sizes="(max-width: 560px) 46vw, (max-width: 900px) 44vw, 23vw"
                  className="member__img"
                  /* Only the first row is above the fold. */
                  priority={i < 4}
                />
              </div>
              {/* Role and location stay visible — the live site hides
                  them behind hover, unreachable on touch. */}
              <h2 className="member__name">{m.name}</h2>
              <p className="member__role">{m.role}</p>
              <p className="member__base">{m.basedIn}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
