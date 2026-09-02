"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sectors } from "@/lib/content";

/* Horizontal gallery, one sector at a time.

   Native overflow scrolling does the heavy lifting: on touch it already
   gives momentum, rubber-banding at the edges and full interruptibility
   — re-implementing those by hand is how carousels end up feeling worse
   than the platform.

   Desktop pointers get 1:1 drag on top, with Apple's momentum
   projection at release so a flick lands where the gesture was heading
   rather than snapping back to the nearest card.

   Deliberately NO data-lenis-prevent: that attribute stops Lenis
   handling ANY scroll over the element, vertical included, so the page
   freezes while the pointer is here. Lenis is vertical-only by default
   and leaves this container's horizontal scrolling alone. */

/* Designing Fluid Interfaces (WWDC18): exponential decay, not the
   textbook v²/2a. 0.998 is the normal scroll feel. */
const project = (velocity: number, deceleration = 0.998) =>
  (velocity / 1000) * deceleration / (1 - deceleration);

export default function SectorGallery() {
  const viewport = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  /* Scroll offset that parks each card at the leading edge. The track's
     own padding is the page gutter, so subtracting it lands the card
     flush with the container. */
  const cardStops = useCallback(() => {
    const vp = viewport.current;
    const track = vp?.querySelector<HTMLElement>(".gal__track");
    if (!vp || !track) return [];
    const pad = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    return Array.from(track.querySelectorAll<HTMLElement>(".gal__card")).map(
      (c) => c.offsetLeft - pad
    );
  }, []);

  const goTo = useCallback(
    (i: number) => {
      const vp = viewport.current;
      const centers = cardStops();
      if (!vp || !centers.length) return;
      const idx = Math.max(0, Math.min(centers.length - 1, i));
      /* Clamp: a stop computed past maxScroll would leave the browser
         resting somewhere we never treat as an index. */
      const max = vp.scrollWidth - vp.clientWidth;
      vp.scrollTo({ left: Math.min(centers[idx], max), behavior: "smooth" });
    },
    [cardStops]
  );

  /* Which card is nearest the viewport centre. */
  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const centers = cardStops();
        if (!centers.length) return;
        const x = vp.scrollLeft;
        const max = vp.scrollWidth - vp.clientWidth;
        /* Scrolled to the end is always the last card, whether or not
           its stop was reachable. */
        if (max - x < 2) { setActive(centers.length - 1); return; }
        let best = 0;
        centers.forEach((c, i) => {
          if (Math.abs(c - x) < Math.abs(centers[best] - x)) best = i;
        });
        setActive(best);
      });
    };
    vp.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      vp.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [cardStops]);

  /* --- Pointer drag (desktop) -------------------------------- */
  useEffect(() => {
    const vp = viewport.current;
    if (!vp) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch already does this

    let startX = 0;
    let startScroll = 0;
    let active = false;
    let history: { x: number; t: number }[] = [];

    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      active = true;
      startX = e.clientX;
      startScroll = vp.scrollLeft;
      history = [{ x: e.clientX, t: performance.now() }];
      vp.setPointerCapture(e.pointerId);
      /* Feedback on press, not release. */
      setDragging(true);
      vp.style.scrollSnapType = "none";
    };

    const onMove = (e: PointerEvent) => {
      if (!active) return;
      /* 1:1 with the pointer, the whole way through. */
      vp.scrollLeft = startScroll - (e.clientX - startX);
      history.push({ x: e.clientX, t: performance.now() });
      if (history.length > 6) history.shift();
    };

    const onUp = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      setDragging(false);
      vp.releasePointerCapture(e.pointerId);
      vp.style.scrollSnapType = "";

      const first = history[0];
      const last = history[history.length - 1];
      const dt = last && first ? last.t - first.t : 0;
      const velocity = dt > 0 ? ((last.x - first.x) / dt) * -1000 : 0; // px/s, scroll dir

      const projected = vp.scrollLeft + project(velocity);
      const centers = cardStops();
      let best = 0;
      centers.forEach((c, i) => {
        if (Math.abs(c - projected) < Math.abs(centers[best] - projected)) best = i;
      });
      goTo(best);
    };

    vp.addEventListener("pointerdown", onDown);
    vp.addEventListener("pointermove", onMove);
    vp.addEventListener("pointerup", onUp);
    vp.addEventListener("pointercancel", onUp);
    return () => {
      vp.removeEventListener("pointerdown", onDown);
      vp.removeEventListener("pointermove", onMove);
      vp.removeEventListener("pointerup", onUp);
      vp.removeEventListener("pointercancel", onUp);
    };
  }, [cardStops, goTo]);

  return (
    <section className="gal">
      <div className="container gal__head">
        <h2 className="reveal">Backing bold solutions creating real impact</h2>
      </div>

      <div className="gal__stage">
      <div
        className="gal__viewport"
        ref={viewport}
        data-dragging={dragging}
      >
        <ul className="gal__track">
          {sectors.map((s, i) => (
            <li key={s.name} className="gal__card" data-on={i === active}>
              {s.image && (
                <Image
                  src={s.image}
                  alt={s.alt ?? ""}
                  fill
                  sizes="(max-width: 700px) 82vw, 34vw"
                  className="gal__img"
                  draggable={false}
                />
              )}
              <div className="gal__body">
                <h3>{s.name}</h3>
                <p>{s.tagline}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating translucent capsule over the card, Apple-style —
          material as a layer above content rather than chrome that
          consumes its own strip of layout. */}
      <div className="gal__nav">
        <div className="gal__rail" role="tablist" aria-label="Sectors">
          {sectors.map((s, i) => (
            <button
              key={s.name}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={s.name}
              className="gal__dot"
              data-on={i === active}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        <span className="gal__nav-sep" aria-hidden="true" />

        <div className="gal__arrows">
          <button
            type="button"
            className="gal__arrow"
            aria-label="Previous sector"
            disabled={active === 0}
            onClick={() => goTo(active - 1)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            className="gal__arrow"
            aria-label="Next sector"
            disabled={active === sectors.length - 1}
            onClick={() => goTo(active + 1)}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}
