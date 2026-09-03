"use client";

import { useEffect, useState } from "react";

/* Share controls.

   The copy button reports success in place rather than through a toast:
   the confirmation belongs next to the thing that caused it. It reverts
   after two seconds so the row does not stay in a changed state.

   navigator.clipboard needs a secure context and can still reject, so
   there is a real fallback rather than a silent no-op. */

type Props = { url: string; title: string };

const ICON = "currentColor";

function Facebook() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={ICON} aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.93 8.44-9.94Z" />
    </svg>
  );
}
function X() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={ICON} aria-hidden="true">
      <path d="M17.53 3H20.5l-6.49 7.42L21.5 21h-5.86l-4.6-6.02L5.78 21H2.8l6.94-7.93L2.5 3h6l4.16 5.5L17.53 3Zm-1.04 16.2h1.64L7.6 4.71H5.84l10.65 14.49Z" />
    </svg>
  );
}
function Mail() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={ICON} strokeWidth="1.6" aria-hidden="true">
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2" />
      <path d="m3.5 6.5 8.5 6 8.5-6" />
    </svg>
  );
}
function Link() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={ICON} strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M10 13.5a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1.5 1.5" />
      <path d="M14 10.5a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.5-1.5" />
    </svg>
  );
}
function Check() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={ICON} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export default function ShareRow({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      /* Blocked or insecure context — select the URL so the reader can
         still copy it by hand instead of the button doing nothing. */
      const field = document.createElement("input");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
        setCopied(true);
      } finally {
        field.remove();
      }
    }
  }

  const enc = encodeURIComponent;

  return (
    <div className="share">
      <span className="visually-hidden" id="share-label">
        Share this article
      </span>
      <ul className="share__list" aria-labelledby="share-label">
        <li>
          <a
            className="share__btn"
            href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`}
            target="_blank"
            rel="noreferrer noopener"
            title="Share on Facebook"
          >
            <Facebook />
            <span className="visually-hidden">Share on Facebook</span>
          </a>
        </li>
        <li>
          <a
            className="share__btn"
            href={`https://x.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`}
            target="_blank"
            rel="noreferrer noopener"
            title="Share on X"
          >
            <X />
            <span className="visually-hidden">Share on X</span>
          </a>
        </li>
        <li>
          <a
            className="share__btn"
            href={`mailto:?subject=${enc(title)}&body=${enc(url)}`}
            title="Share by email"
          >
            <Mail />
            <span className="visually-hidden">Share by email</span>
          </a>
        </li>
        <li>
          <button
            type="button"
            className="share__btn"
            onClick={copy}
            title={copied ? "Link copied" : "Copy link"}
            data-copied={copied ? "" : undefined}
          >
            {copied ? <Check /> : <Link />}
            <span className="visually-hidden">
              {copied ? "Link copied" : "Copy link"}
            </span>
          </button>
        </li>
      </ul>
      {/* Announced to screen readers without moving focus. */}
      <span role="status" aria-live="polite" className="visually-hidden">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
