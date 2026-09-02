/**
 * Sanity Studio, mounted at /studio.
 *
 * It sits outside the (site) route group on purpose: the group's layout
 * carries the preloader, Lenis smooth scroll, the page-transition
 * overlay, nav and footer, every one of which would fight the Studio.
 * Here it inherits only the thin root layout.
 *
 * Nothing Sanity is imported in this file — see Studio.tsx for why.
 * metadata and viewport are declared here rather than re-exported from
 * next-sanity/studio for the same reason; these are the values that
 * package ships.
 */
import type { Metadata, Viewport } from "next";

import Studio from "./Studio";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Studio",
  referrer: "same-origin",
  robots: "noindex",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioPage() {
  return <Studio />;
}
