import Link from "next/link";
import { site, nav } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="gradient-bar" />
      <div className="container footer__inner">
        <div className="footer__top">
          <p className="footer__tagline">{site.tagline}</p>

          <nav className="footer__nav" aria-label="Footer">
            {nav.map((i) => (
              <Link key={i.href} href={i.href}>{i.label}</Link>
            ))}
            <Link href="/contact-us">Connect</Link>
            <a href={site.linkedin} target="_blank" rel="noreferrer noopener">
              LinkedIn
            </a>
          </nav>
        </div>

        <div className="footer__base">
          <p>© {new Date().getFullYear()} {site.name}</p>
          <address>{site.address}</address>
        </div>
      </div>
    </footer>
  );
}
