"use client";

import { useId, useState } from "react";
import { Liquid } from "liquid-gooey";
import { faq } from "@/lib/content";

/* Accordion built on real button/region semantics rather than <details>,
   which shipped a browser default triangle and no control over the open
   transition.

   liquid-gooey carries the surface. Closed, the answer sits flush
   under the question and the two silhouettes read as one mass. Opening
   grows it AND opens a real gap, so the bridge stretches and breaks —
   the answer detaches rather than staying fused to the bar. Bridging is
   a ratio of blur to gap, so blur sits just under the open gap.

   `observe` is the documented path when your own code animates the
   child — CSS drives height and margin, the liquid follows the rendered
   rect. The real DOM rides crisp on top, so text stays sharp. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const uid = useId();

  return (
    <div className="faq">
      {faq.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${uid}-q${i}`;
        const panelId = `${uid}-a${i}`;

        return (
          <div key={item.q} className="faq__item" data-open={isOpen}>
            <Liquid
              blur={11}
              contrast={24}
              fill="var(--grey-50)"
              filterPadding={28}
            >
              <Liquid.Item observe>
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
              </Liquid.Item>

              <Liquid.Item observe>
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
              </Liquid.Item>
            </Liquid>
          </div>
        );
      })}
    </div>
  );
}
