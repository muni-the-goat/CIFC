"use client";

import { useEffect, useId, useState } from "react";
import dynamic from "next/dynamic";
import { faq } from "@/lib/content";

/* liquid-gooey runs SVG feGaussianBlur + feColorMatrix over the whole
   group. On iOS those filters are expensive enough that recomputing
   them every frame — which is what `observe` does while the height
   animates — drops frames badly.

   So the goo is opt-in: fine pointer, wide viewport, no reduced-motion
   preference. Everywhere else gets plain surfaces and the same CSS
   height transition, which is smooth on any device.

   next/dynamic with ssr:false means phones never download the library
   at all, rather than shipping 18 kB to be discarded. */
const FaqSurface = dynamic(() => import("./FaqSurface"), { ssr: false });

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const [rich, setRich] = useState(false);
  const uid = useId();

  useEffect(() => {
    const ok = window.matchMedia(
      "(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)"
    );
    const sync = () => setRich(ok.matches);
    sync();
    ok.addEventListener("change", sync);
    return () => ok.removeEventListener("change", sync);
  }, []);

  return (
    <div className="faq" data-rich={rich}>
      {faq.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;

        const question = (
          <button
            id={btnId}
            type="button"
            className="faq__q"
            aria-expanded={isOpen}
            aria-controls={panelId}
            onClick={() => setOpen(isOpen ? null : i)}
          >
            <span>{item.q}</span>
            <span className="faq__sign" aria-hidden="true" />
          </button>
        );

        const answer = (
          <div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            className="faq__a"
            /* Hidden from AT and tab order while collapsed — a
               zero-height region is still focusable otherwise. */
            {...(!isOpen && { inert: true })}
          >
            <div className="faq__a-inner">
              <p>{item.a}</p>
            </div>
          </div>
        );

        return (
          <div key={item.q} className="faq__item" data-open={isOpen}>
            {rich ? (
              <FaqSurface question={question} answer={answer} />
            ) : (
              <>
                {question}
                {answer}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
