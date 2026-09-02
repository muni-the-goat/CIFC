"use client";

/* Dev tuner for the hero shader. Not linked from anywhere and marked
   noindex — delete app/lab/ before launch. */

import { useState, useMemo } from "react";
import AnimatedGradient from "@/components/ui/animated-gradient";

type Shape = "Checks" | "Stripes" | "Edge";

const FIELDS = [
  { key: "rotation",        min: -180, max: 180, step: 1 },
  { key: "proportion",      min: 0,    max: 100, step: 1 },
  { key: "scale",           min: 0,    max: 1,   step: 0.01 },
  { key: "speed",           min: 0,    max: 40,  step: 1 },
  { key: "distortion",      min: 0,    max: 60,  step: 1 },
  { key: "swirl",           min: 0,    max: 100, step: 1 },
  { key: "swirlIterations", min: 1,    max: 20,  step: 1 },
  { key: "softness",        min: 0,    max: 100, step: 1 },
  { key: "offset",          min: -900, max: 900, step: 1 },
  { key: "shapeSize",       min: 0,    max: 100, step: 1 },
] as const;

const START = {
  color1: "#EE486C", color2: "#834CA7", color3: "#2854E0",
  rotation: -32, proportion: 50, scale: 0.32, speed: 18, distortion: 1,
  swirl: 66, swirlIterations: 5, softness: 100, offset: -140,
  shape: "Edge" as Shape, shapeSize: 42, noise: 0.1,
};

export default function GradientLab() {
  const [v, setV] = useState(START);
  const set = (k: string, val: number | string) => setV((p) => ({ ...p, [k]: val }));

  const { noise, ...rest } = v;
  const config = useMemo(() => ({ preset: "custom" as const, ...rest }), [rest]);

  const snippet = `const INFINITY_HORIZON = {
  preset: "custom",
  color1: "${v.color1}",
  color2: "${v.color2}",
  color3: "${v.color3}",
  rotation: ${v.rotation},
  proportion: ${v.proportion},
  scale: ${v.scale},
  speed: ${v.speed},
  distortion: ${v.distortion},
  swirl: ${v.swirl},
  swirlIterations: ${v.swirlIterations},
  softness: ${v.softness},
  offset: ${v.offset},
  shape: "${v.shape}",
  shapeSize: ${v.shapeSize},
} as const;
// noise={{ opacity: ${noise}, scale: 0.8 }}`;

  return (
    <div className="lab">
      <div className="lab__stage">
        <AnimatedGradient
          config={config}
          noise={noise > 0 ? { opacity: noise, scale: 0.8 } : undefined}
          style={{ zIndex: 0 }}
        />
      </div>

      <aside className="lab__panel">
        <h1 className="lab__title">Hero shader</h1>

        <div className="lab__colors">
          {(["color1", "color2", "color3"] as const).map((k) => (
            <label key={k} className="lab__color">
              <input type="color" value={v[k]} onChange={(e) => set(k, e.target.value)} />
              <span>{v[k]}</span>
            </label>
          ))}
        </div>

        <label className="lab__row">
          <span className="lab__label">shape</span>
          <select value={v.shape} onChange={(e) => set("shape", e.target.value)}>
            <option>Edge</option><option>Checks</option><option>Stripes</option>
          </select>
        </label>

        {FIELDS.map((f) => (
          <label key={f.key} className="lab__row">
            <span className="lab__label">{f.key}</span>
            <input
              type="range" min={f.min} max={f.max} step={f.step}
              value={v[f.key as keyof typeof v] as number}
              onChange={(e) => set(f.key, parseFloat(e.target.value))}
            />
            <output>{v[f.key as keyof typeof v] as number}</output>
          </label>
        ))}

        <label className="lab__row">
          <span className="lab__label">noise</span>
          <input type="range" min={0} max={0.6} step={0.01} value={noise}
                 onChange={(e) => set("noise", parseFloat(e.target.value))} />
          <output>{noise}</output>
        </label>

        <button className="lab__reset" onClick={() => setV(START)}>Reset</button>
        <textarea className="lab__out" readOnly value={snippet} rows={19} />
      </aside>
    </div>
  );
}
