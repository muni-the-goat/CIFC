"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

/* Drives the exit of the overlay that is server-rendered in layout.tsx.

   Safety contract — the overlay covers the entire page, so it is the
   single most dangerous element on the site:

   1. CSS shows it by default, so it IS the first paint — gating
      visibility on JS guarantees a flash of content behind it. A
      <noscript> block in the layout removes it when JS is off.
   2. An inline script arms a 3.5s failsafe that clears it regardless
      of what this component does.
   3. This component only ever moves it toward "done". It can fail,
      throw, or never mount, and the page still resolves.

   Dismissal tracks the real `load` event, floored at 700ms so it does
   not flicker on a warm cache and capped at 2.6s so a slow asset never
   holds the viewer hostage. */

const MIN_MS = 700;
const MAX_MS = 2600;

function finish() {
  document.documentElement.classList.add("preloaded");
}

export default function Preloader() {
  useEffect(() => {
    const el = document.getElementById("preloader");
    if (!el || el.dataset.state === "done") { finish(); return; }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.dataset.state = "done";
      finish();
      return;
    }

    const started = performance.now();
    let done = false;

    const logo = el.querySelector(".preloader__lockup");
    const countEl = el.querySelector(".preloader__count");
    const count = { v: 0 };
    const render = () => {
      if (countEl) countEl.textContent = String(Math.round(count.v));
    };

    /* Creep toward 88 while assets are in flight — the last 12 is
       reserved for the real load event, so the number never sits at
       100 while the page is still working. */
    const creep = gsap.to(count, {
      v: 88,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: render,
    });

    const exit = () => {
      if (done) return;
      done = true;
      creep.kill();

      gsap
        .timeline({ onComplete: () => { el.dataset.state = "done"; finish(); } })
        .to(count, { v: 100, duration: 0.3, ease: "power2.out", onUpdate: render })
        .to(logo, { opacity: 0, scale: 1.06, duration: 0.34, ease: "power2.in" }, "-=0.06")
        .to(countEl, { opacity: 0, y: -14, duration: 0.3, ease: "power2.in" }, "<")
        .to(el, { yPercent: -100, duration: 0.72, ease: "expo.inOut" }, "-=0.12");
    };

    const ready = () => {
      const waited = performance.now() - started;
      window.setTimeout(exit, Math.max(0, MIN_MS - waited));
    };

    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });

    const cap = window.setTimeout(exit, MAX_MS);

    return () => {
      window.clearTimeout(cap);
      window.removeEventListener("load", ready);
      creep.kill();
    };
  }, []);

  return null;
}
