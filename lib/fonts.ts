import { Kantumruy_Pro } from "next/font/google";

/* Brand guideline (v1.0, p.14) specifies Kantumruy Pro for Khmer.
   SIL Open Font License, free for commercial use, variable.
   next/font self-hosts it at build time — no runtime request to
   Google, and no layout shift.

   English is deliberately NOT loaded: the guideline specifies
   SF Pro Display, which Apple does not license for web
   distribution, so --font-sans references the OS font instead
   (see app/styles/tokens.css). Apple devices render genuine
   SF Pro; others fall back through the system stack. */

export const kantumruy = Kantumruy_Pro({
  subsets: ["khmer", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-kantumruy",
});
