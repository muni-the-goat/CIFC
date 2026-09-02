"use client";

import { useEffect, useRef } from "react";

/* Counts a stat up to its value when it scrolls into view.

   Safety contract — read before editing:

   The finished value is what renders on the server and on first paint.
   JS only ever animates a number that is already correct, so a script
   failure leaves the real figure on screen, never a zero. Nothing here
   may invert that.

   Two consequences fall out of it:

   - If the element is already in the viewport when we start observing,
     we leave it alone. Resetting to zero to animate would flash a wrong
     number at someone who is looking straight at it.
   - The animating text is aria-hidden, with the final value beside it
     for assistive tech, so nobody hears a half-counted figure. */

/* "17,500+" -> ["", "17,500", "+"] | "USD 15BN" -> ["USD ", "15", "BN"] */
const PARTS = /^(\D*?)([\d,.]+)(.*)$/;

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

const DURATION = 1600;

export default function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const parts = value.match(PARTS);
    if (!parts) return;

    const [, prefix, digits, suffix] = parts;
    const target = Number(digits.replace(/,/g, ""));
    if (!Number.isFinite(target)) return;

    /* Match the source's own formatting rather than guessing a locale. */
    const grouped = digits.includes(",");
    const decimals = digits.split(".")[1]?.length ?? 0;
    const format = (n: number) =>
      prefix +
      n.toLocaleString("en-US", {
        useGrouping: grouped,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix;

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1);
        el.textContent = format(target * easeOutExpo(t));
        if (t < 1) raf = requestAnimationFrame(tick);
        else el.textContent = value;
      };
      raf = requestAnimationFrame(tick);
    };

    let settled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        /* The first callback reports current state. Already on screen
           means no animation — see the contract above. */
        if (!settled) {
          settled = true;
          if (entry.isIntersecting) {
            io.disconnect();
            return;
          }
          return;
        }
        if (entry.isIntersecting) {
          io.disconnect();
          el.textContent = format(0);
          run();
        }
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="visually-hidden">{value}</span>
    </>
  );
}
