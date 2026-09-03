"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";

/* Route-change wipe. Four panels sweep up in sequence, the brand mark
   resolves at centre, then everything clears — the gradient reading as
   a shutter with the symbol as its beat.

   Ordering, which is the whole point:

   This used to run entirely off usePathname(). But that only changes
   AFTER Next commits the new route, so the panels swept up over a page
   that was already on screen. It looked fine while every page was
   synchronous and the swap took a frame; the moment / and /news began
   awaiting a Sanity fetch, the new page was visible for the entire
   cover half of the animation.

   So the cover now runs on the click, before navigating, and the
   uncover runs when the new route commits. The covered screen hides the
   fetch instead of exposing it.

   Safety contract — read before editing:

   Navigation must never depend on this animation. Every intercepted
   click pushes the route on completion AND on a failsafe timer, and the
   push is guarded so it happens exactly once. If GSAP is missing or a
   tween throws, the failsafe still navigates. Under reduced motion the
   handler does not intercept at all and links behave natively. */

const COVER_MS = 620;

export default function PageTransition() {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  /* Set by the click handler, read by the uncover effect. Back/forward
     never set it, so a popstate does not trigger a stray uncover. */
  const covered = useRef(false);
  const animating = useRef(false);

  const reduced = useCallback(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  /* --- Uncover, once the new route is on screen -------------------- */
  useEffect(() => {
    const el = root.current;
    if (!el || !covered.current) return;

    covered.current = false;
    const panels = el.querySelectorAll(".wipe__panel");
    const mark = el.querySelector(".wipe__mark");

    const tl = gsap.timeline({
      onComplete: () => {
        animating.current = false;
      },
    });

    tl.to(mark, { opacity: 0, scale: 1.08, duration: 0.3, ease: "power2.in" })
      .set(el, { pointerEvents: "none" })
      .to(
        panels,
        {
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.5,
          ease: "power3.inOut",
          stagger: 0.055,
        },
        "<0.04"
      );

    return () => {
      tl.kill();
      animating.current = false;
      gsap.set(el, { pointerEvents: "none" });
      gsap.set(panels, { scaleY: 0 });
      gsap.set(mark, { opacity: 0 });
    };
  }, [pathname]);

  /* --- Cover, on the click that starts the navigation --------------- */
  useEffect(() => {
    if (reduced()) return;

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return;
      /* Left button only, and never when the user is asking the browser
         for a new tab or a download. */
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      /* Same page, or only the hash differs — nothing to cover. */
      if (url.pathname === window.location.pathname) return;

      const el = root.current;
      if (!el) return;
      if (animating.current) return;

      event.preventDefault();
      animating.current = true;
      covered.current = true;

      const target = url.pathname + url.search + url.hash;
      let pushed = false;
      const go = () => {
        if (pushed) return;
        pushed = true;
        router.push(target);
      };

      /* Navigates even if the timeline never completes. */
      const failsafe = window.setTimeout(go, COVER_MS + 260);

      const panels = el.querySelectorAll(".wipe__panel");
      const mark = el.querySelector(".wipe__mark");

      try {
        gsap
          .timeline({
            onComplete: () => {
              window.clearTimeout(failsafe);
              go();
            },
          })
          .set(el, { pointerEvents: "auto" })
          .fromTo(
            panels,
            { scaleY: 0, transformOrigin: "bottom" },
            { scaleY: 1, duration: 0.46, ease: "power3.inOut", stagger: 0.05 }
          )
          /* Mark resolves while the last panel is still travelling, so
             the two read as one gesture rather than two beats. */
          .fromTo(
            mark,
            { opacity: 0, scale: 0.82, rotate: -22 },
            { opacity: 1, scale: 1, rotate: 0, duration: 0.42, ease: "power3.out" },
            "-=0.24"
          );
      } catch {
        window.clearTimeout(failsafe);
        go();
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router, reduced]);

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
