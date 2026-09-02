import type { Metadata } from "next";
import { kantumruy } from "@/lib/fonts";
import { site } from "@/lib/content";

/* Root layout, deliberately thin.

   The marketing chrome — preloader, Lenis, page transitions, nav and
   footer — lives in app/(site)/layout.tsx instead, so that /studio can
   render Sanity without any of it. Only what genuinely belongs to every
   document in the app stays here: <html>, <body>, the font variable and
   the site-wide metadata defaults. Stylesheets are imported by the
   (site) layout for the same reason.

   suppressHydrationWarning: the (site) layout's inline script adds a
   `js` class to <html> before React hydrates, so the server className
   intentionally differs from the client's. Suppression applies to this
   element's own attributes only — nothing nested. */

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Canadia Impact Fund — Driving Sustainable Social & Environmental Impact",
    template: "%s — Canadia Impact Fund",
  },
  /* Live site's description begins "anadia" — the missing C is fixed here. */
  description:
    "Canadia Impact Fund invests in innovative projects that create measurable social, environmental, and financial outcomes in Cambodia and beyond.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    url: site.url,
    images: ["/og.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={kantumruy.variable} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
