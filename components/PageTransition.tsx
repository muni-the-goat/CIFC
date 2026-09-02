"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";

/* Route-change wipe. Four panels sweep up in sequence, the brand mark
   resolves at centre, then everything clears — the gradient reading as
   a shutter with the symbol as its beat.

   Deliberately not blocking: navigation is never gated on the
   animation finishing, so a slow tween can't strand the user. The
   panels are pointer-events:none the moment they start clearing. */
export default function PageTransition() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    /* No wipe on first load — the hero has its own entrance. */
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const panels = el.querySelectorAll(".wipe__panel");
    const mark = el.querySelector(".wipe__mark");
    const tl = gsap.timeline();

    tl.set(el, { pointerEvents: "auto" })
      .fromTo(
        panels,
        { scaleY: 0, transformOrigin: "bottom" },
        { scaleY: 1, duration: 0.5, ease: "power3.inOut", stagger: 0.055 }
      )
      /* Mark resolves while the last panel is still travelling, so the
         two read as one gesture rather than two beats. */
      .fromTo(
        mark,
        { opacity: 0, scale: 0.82, rotate: -22 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.55, ease: "power3.out" },
        "-=0.26"
      )
      .to(mark, { opacity: 0, scale: 1.08, duration: 0.32, ease: "power2.in" }, "+=0.22")
      .set(el, { pointerEvents: "none" })
      .to(panels, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 0.5,
        ease: "power3.inOut",
        stagger: 0.055,
      }, "<0.06");

    return () => {
      tl.kill();
      gsap.set(el, { pointerEvents: "none" });
      gsap.set(panels, { scaleY: 0 });
      gsap.set(mark, { opacity: 0 });
    };
  }, [pathname]);

  return (
    <div ref={root} className="wipe" aria-hidden="true">
      <span className="wipe__panel" />
      <span className="wipe__panel" />
      <span className="wipe__panel" />
      <span className="wipe__panel" />
      <Image
        src="/cifc-mark.png"
        alt=""
        aria-hidden="true"
        width={845}
        height={714}
        priority
        className="wipe__mark"
      />
    </div>
  );
}
