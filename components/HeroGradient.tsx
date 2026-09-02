"use client";

import { memo, useState } from "react";
import AnimatedGradient from "@/components/ui/animated-gradient";

/* "Infinity Horizon" — the brand guideline's three-stop gradient
   (v1.0, p.11): Guava Rush → Amethyst → Pulse Blue.

   Tuned for restraint rather than spectacle: speed 8 (the shipped
   presets run 20–39), softness at maximum so there are no hard edges,
   and the Edge shape for slow organic banding. Module-level so the
   object identity is stable and the WebGL context is never needlessly
   rebuilt. */
const INFINITY_HORIZON = {
  preset: "custom",
  color1: "#EE486C",
  color2: "#834CA7",
  color3: "#2854E0",

  /* Tuned for satin, not lava.
     distortion 1  — the noise-warp is what made it read as blobby at
                     3+; at 1 it only adds a slow organic drift.
     swirl 66 / 5 iterations — few large folds. Each extra iteration
                     adds a finer wrinkle layer (swirl/i falloff), so
                     high counts read as crumpled rather than draped.
     scale 0.32    — enough structure on screen for the motion to be
                     legible; zoomed further out it reads as static
                     however fast it actually moves.
     speed 18      — u_time advances at speed/100*5, so this is ~2.6x
                     the previous 7.
     softness 100  — widest possible blend between the three stops. */
  rotation: -32,
  proportion: 50,
  scale: 0.32,
  speed: 18,
  distortion: 1,
  swirl: 66,
  swirlIterations: 5,
  softness: 100,
  offset: -140,
  shape: "Edge",
  shapeSize: 42,
} as const;

function HeroGradient() {
  const [supported, setSupported] = useState(true);

  return (
    <div className="hero__canvas">
      {/* Painted underneath always: the fallback when WebGL2 is
          unavailable, and it prevents a flash of empty colour before
          the first shader frame. */}
      <div className="hero__canvas-fallback" />
      {supported && (
        <AnimatedGradient
          config={INFINITY_HORIZON}
          noise={{ opacity: 0.1, scale: 0.8 }}
          onSupportChange={setSupported}
          style={{ zIndex: 0 }}
        />
      )}
      {/* Scrim. Guava Rush against white type is 3.6:1 — fine for
          display sizes, short of AA for anything smaller. This holds
          the headline above 4.5:1 wherever the gradient drifts, and
          takes the neon edge off the saturation. */}
      <div className="hero__canvas-scrim" />
    </div>
  );
}

export default memo(HeroGradient);
