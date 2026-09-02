/* Shared inner-page hero. Lines ride up out of their own masks, the
   same CSS keyframe the home hero uses — no JS, so a heading can never
   be stranded invisible by a script failing. */
export default function PageHero({
  lead,
  tail,
  lede,
}: {
  lead?: string;
  tail: string;
  lede?: string;
}) {
  const lines = lead ? [lead, tail] : [tail];

  return (
    <section className="container page-hero">
      <h1>
        {lines.map((line, i) => (
          <span key={line} className="hero__line">
            <span
              className={`hero__line-inner${lead && i === 0 ? " hero__light" : ""}`}
              style={{ ["--i" as string]: i }}
            >
              {line}
            </span>
          </span>
        ))}
      </h1>
      {lede && <p className="lede page-hero__lede">{lede}</p>}
    </section>
  );
}
