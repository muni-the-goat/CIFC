"use client";

import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Entrance choreography for the home page.

   Safety contract — read before editing:

   The hero headline is deliberately NOT animated here — it uses a CSS
   keyframe so it can never be stranded invisible by a JS failure.
   GSAP owns only the gradient settle, the nav, and scroll reveals.

   Those still use a `.js`-gated hidden state, so we stamp
   <html data-motion-ready> first; an inline script in the layout
   reveals everything if that stamp has not appeared shortly after
   load. Content visibility must never depend on GSAP succeeding. */
export default function HomeMotion() {
  useLayoutEffect(() => {
    /* Tell the failsafe we are alive, before any animation work. */
    document.documentElement.setAttribute("data-motion-ready", "");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealables = gsap.utils.toArray<HTMLElement>("[data-anim]");

    if (reduced) {
      gsap.set([".nav__bar", ...revealables], { opacity: 1, y: 0 });
      revealables
        .filter((el) => el.hasAttribute("data-anim-stagger"))
        .forEach((el) => gsap.set(Array.from(el.children), { opacity: 1, y: 0 }));
      return;
    }

    const tweens: gsap.core.Animation[] = [];

    /* --- Curtain-up -------------------------------------------- */
    const intro = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.15 } });
    tweens.push(intro);

    intro
      .fromTo(
        ".hero__canvas",
        { scale: 1.08, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" },
        0
      )
      .fromTo(
        ".nav__bar",
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
        0.65
      );

    /* --- Scroll reveals ----------------------------------------- */
    revealables.forEach((el) => {
      const stagger = el.hasAttribute("data-anim-stagger");
      const targets = stagger ? Array.from(el.children) : [el];

      tweens.push(
        gsap.fromTo(
          targets,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            stagger: stagger ? 0.08 : 0,
            scrollTrigger: { trigger: el, start: "top 82%", once: true },
          }
        )
      );
    });

    return () => {
      /* StrictMode mounts twice in dev; leave the DOM at its finished
         state on teardown rather than reverting to hidden. */
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      gsap.set([".nav__bar", ...revealables], { opacity: 1, y: 0 });
    };
  }, []);

  return null;
}
