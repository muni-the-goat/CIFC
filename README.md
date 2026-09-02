# Canadia Impact Fund

Redesign of [canadiaimpact.com](https://www.canadiaimpact.com), moving off Webflow
to a hand-built Next.js site.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Vanilla CSS** with custom properties — no Tailwind. Tokens live in
  [`app/styles/tokens.css`](app/styles/tokens.css)
- **GSAP + ScrollTrigger** for scroll reveals and the hero gradient settle
- **WebGL** animated gradient in [`components/ui/animated-gradient.tsx`](components/ui/animated-gradient.tsx)

## Getting started

```bash
npm install
npm run dev
```

> Do not run `npm run build` while `npm run dev` is live — the production
> build overwrites `.next/` and breaks the running dev server.

## Design system

Colours and type come from the Canadia Impact Fund brand guideline
(First Edition v1.0, Sep 2025). Values marked `[GUIDELINE]` in
`tokens.css` are taken directly from it; `[PROPOSED]` values are not in
the guideline and need brand sign-off.

| Token | Value | Name |
|---|---|---|
| `--guava-rush` | `#EE486C` | Guava Rush |
| `--amethyst` | `#834CA7` | Amethyst |
| `--pulse-blue` | `#2854E0` | Pulse Blue |

The two brand gradients — *Prospera* and *Infinity Horizon* — are defined
from those three stops.

**Typography.** The guideline specifies SF Pro Display, which Apple does
not license for web distribution. The site therefore references the OS
system font rather than shipping it: Apple devices render genuine SF Pro,
others fall back through the system stack. Khmer uses **Kantumruy Pro**
(SIL OFL), self-hosted via `next/font`.

## Motion

The hero headline reveal is a **CSS keyframe**, deliberately not GSAP —
content must never depend on an animation library loading. GSAP owns only
the gradient settle, the nav, and scroll reveals; those use a `.js`-gated
hidden state with a failsafe in `app/layout.tsx` that reveals everything
if the motion layer has not initialised shortly after load.

`prefers-reduced-motion` is respected throughout, including the WebGL
shader, which renders a single static frame.

## Before launch

- [ ] Delete `app/lab/` — dev-only shader tuner, `noindex` but unlinked
- [ ] Wire the contact form: it posts to `/api/contact`, which does not
      exist yet. This form is currently the only way to reach the fund.
- [ ] Confirm `--ink` (`#16171A`) with the brand owner — the guideline
      defines no colour darker than `#6D6E71`
- [ ] Resolve open conflicts flagged as `NOTE` in `lib/content.ts`:
      two different office addresses, and `canadiaimpactfund.com` vs
      `canadiaimpact.com`
- [ ] Supply a white logo asset — the nav currently reverses the colour
      PNG with a CSS filter
- [ ] Replace hero and team photography via `next/image` (the live site
      ships a 3.2 MB hero and ~1 MB portraits)
