import type { Metadata } from "next";
import { kantumruy } from "@/lib/fonts";
import { site } from "@/lib/content";
import Nav from "@/components/Nav";
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
        <a href="#main" className="visually-hidden">Skip to content</a>
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
