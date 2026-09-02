import type { Metadata } from "next";
import { kantumruy } from "@/lib/fonts";
import { site } from "@/lib/content";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import Preloader from "@/components/Preloader";
import Footer from "@/components/Footer";
import "./styles/globals.css";

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

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  sameAs: [site.linkedin],
  parentOrganization: { "@type": "Organization", name: "Canadia Group" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Nº315, Ang Doung Street, Corner of Monivong Blvd",
    addressLocality: "Phnom Penh",
    addressCountry: "KH",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    /* suppressHydrationWarning: the inline script below adds a `js`
       class to <html> before React hydrates, so the server className
       intentionally differs from the client's. Suppression applies to
       this element's own attributes only — nothing nested. */
    <html lang="en" className={kantumruy.variable} suppressHydrationWarning>
      <body>
        {/* Marks JS as available before first paint. Every animated
            initial state is gated on `.js`, so without JS the page
            renders fully visible instead of blank. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.classList.add('js');" +
              /* Failsafe: if the motion layer has not stamped
                 data-motion-ready shortly after load, drop the `js`
                 class so every hidden element becomes visible again.
                 Content must never depend on GSAP succeeding. */
              "setTimeout(function(){" +
              "if(!document.documentElement.hasAttribute('data-motion-ready'))" +
              "document.documentElement.classList.remove('js');" +
              "},1600);",
          }}
        />
        {/* Visible by default — it IS the first paint, which is the only
            way to guarantee no flash of page content behind it. The
            <noscript> block below removes it for JS-disabled visitors,
            and the script arms a failsafe that clears it regardless of
            what the React driver does. */}
        <noscript>
          <style>{`.preloader{display:none!important}`}</style>
        </noscript>
        <div
          id="preloader"
          className="preloader"
          data-state="idle"
          aria-hidden="true"
          /* The script below flips data-state before React hydrates, so
             this element's attributes are expected to differ. */
          suppressHydrationWarning
        >
          {/* The lockup split in two so the trefoil can turn while the
              wordmark holds still. Positioned from the original
              artwork's coordinates, so it rebuilds the logo exactly. */}
          <span className="preloader__lockup">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cifc-mark-sm.webp" alt="" className="preloader__mark" width={300} height={253} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cifc-word-sm.webp" alt="" className="preloader__word" width={520} height={163} />
          </span>
          <span className="preloader__count" suppressHydrationWarning>0</span>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var p=document.getElementById('preloader');if(!p)return;" +
              /* Reduced motion: clear it immediately, never show it. */
              "if(matchMedia('(prefers-reduced-motion: reduce)').matches){" +
              "p.dataset.state='done';" +
              "document.documentElement.classList.add('preloaded');return;}" +
              /* Failsafe only — visibility is CSS's default, not this. */
              "setTimeout(function(){if(p.dataset.state!=='done'){p.dataset.state='done';" +
              "document.documentElement.classList.add('preloaded');}},3500);})()",
          }}
        />
        <Preloader />
        <a href="#main" className="visually-hidden">Skip to content</a>
        <SmoothScroll />
        <PageTransition />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </body>
    </html>
  );
}
