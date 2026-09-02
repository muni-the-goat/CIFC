import type { Metadata } from "next";
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
      <section className="container page-hero">
        <h1>
          <span className="hero__light">Meet the people powering</span>
          Canadia Impact Fund
        </h1>
        <p className="lede">
          A team of investors, operators, and experts, united by purpose.
        </p>
      </section>

      <section className="container section">
        <ul className="grid grid--3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {team.map((m) => (
            <li key={m.name} className="card">
              {/* Role and location are always visible — the live site
                  hides them behind hover, unreachable on touch. */}
              <h2 style={{ fontSize: "var(--h4)", marginBottom: "var(--space-2)" }}>{m.name}</h2>
              <p style={{ color: "var(--pulse-blue)", fontWeight: "var(--fw-title)" }}>{m.role}</p>
              <p style={{ fontSize: "var(--text-sm)", marginTop: "var(--space-2)" }}>{m.basedIn}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
