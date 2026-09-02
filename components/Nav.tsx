"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/content";

/* Duplicates the label and slides the stack one line on hover, so the
   copy replaces the original. The second copy is aria-hidden — it is
   the same word, and screen readers should not hear it twice. */
function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="roll__track">
        <span className="roll__line">{children}</span>
        <span className="roll__line" aria-hidden="true">{children}</span>
      </span>
    </span>
  );
}

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  /* Seed from the route so the first paint is already correct — the
     observer below only corrects it after mount, and starting false
     would flash dark text over the gradient. */
  const [overHero, setOverHero] = useState(pathname === "/");
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  /* White only while the gradient is actually behind the bar. Past the
     hero the page is white, so it has to flip back to dark or it
     disappears. Open, it is always dark on the cream panel. */
  const variant = open ? "menu" : overHero ? "over" : "solid";

  /* Route change closes the panel. */
  useEffect(() => { setOpen(false); }, [pathname]);

  /* Is a hero still covering the bar? Observed rather than measured on
     scroll — no scroll listener, no layout thrash. */
  useEffect(() => {
    const heroEl = document.querySelector(".hero");
    if (!heroEl) { setOverHero(false); return; }
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: "-104px 0px 0px 0px", threshold: 0 }
    );
    io.observe(heroEl);
    return () => io.disconnect();
  }, [pathname]);

  /* A 1px marker at the document top. Once it leaves, we have scrolled. */
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); triggerRef.current?.focus(); return; }
      if (e.key !== "Tab") return;

      /* Keep focus inside the panel while it is open. */
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    /* Scroll lock without layout shift from the vanishing scrollbar. */
    const { body } = document;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPad = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;

    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPad;
    };
  }, [open]);

  return (
    <>
      <div ref={sentinelRef} className="nav__sentinel" aria-hidden="true" />

      <header
        className="nav"
        data-variant={variant}
        data-backdrop={scrolled && !overHero && !open}
      >
        <div className="nav__bar">
          <button
            ref={triggerRef}
            type="button"
            className="nav__trigger"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`nav__glyph${open ? " nav__glyph--close" : ""}`} aria-hidden="true">
              <span /><span />
            </span>
            <Roll>{open ? "Close" : "Menu"}</Roll>
          </button>

          <Link href="/" className="nav__logo" aria-label={`${site.name} — home`}>
            <Image src="/cifc-logo.png" alt={site.name} width={162} height={58} priority sizes="162px" />
          </Link>

          <Link href="/contact-us" className="nav__cta">
            <Roll>Connect</Roll>
            <Arrow />
          </Link>
        </div>
      </header>

      <div
        id="site-menu"
        ref={panelRef}
        className="menu"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <nav className="menu__nav" aria-label="Primary">
          <ul className="menu__list">
            {nav.map((item, i) => (
              <li key={item.href} className="menu__item" style={{ ["--i" as string]: i }}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu__foot" style={{ ["--i" as string]: nav.length }}>
          {/* The one action among four destinations, so it reads as a
              button rather than a fifth nav item. */}
          <Link href="/contact-us" className="btn btn--primary btn--lg">
            Get in touch
          </Link>
        </div>
      </div>
    </>
  );
}
