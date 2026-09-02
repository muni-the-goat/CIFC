import Image from "next/image";
import { sectors } from "@/lib/content";

/* Shared by the home page and /portfolio — the two had drifted apart
   once already, with only one of them showing the photography. */
export default function SectorGrid() {
  return (
    <div
      className="grid grid--3"
      data-anim
      data-anim-stagger
      style={{ marginTop: "var(--space-12)" }}
    >
      {sectors.map((s) => (
        <article key={s.name} className={s.image ? "sector" : "sector sector--bare"}>
          {s.image && (
            <Image
              src={s.image}
              alt={s.alt ?? ""}
              fill
              sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
              className="sector__img"
            />
          )}
          <div className="sector__body">
            <h3>{s.name}</h3>
            <p>{s.tagline}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
