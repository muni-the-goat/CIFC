import Link from "next/link";
import Image from "next/image";
import { site, nav } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="gradient-bar" />
      <div className="container footer__inner">
        <Image
          src="/cifc-logo.png"
          alt="Canadia Impact Fund"
          width={123}
          height={44}
          className="footer__logo"
        />
        <p className="footer__tagline">{site.tagline}</p>

        <div className="footer__cols">
          <div>
            <h2 className="footer__heading">Menu</h2>
            <ul className="footer__list">
              {nav.map((i) => (
                <li key={i.href}><Link href={i.href}>{i.label}</Link></li>
              ))}
              <li><Link href="/contact-us">Connect</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="footer__heading">Follow Us</h2>
            <ul className="footer__list">
              <li>
                <a href={site.linkedin} target="_blank" rel="noreferrer noopener">LinkedIn</a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="footer__heading">Address</h2>
            <address className="footer__address">{site.address}</address>
          </div>
        </div>

        <p className="footer__legal">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
