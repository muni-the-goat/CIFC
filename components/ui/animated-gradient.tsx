"use client";

import { useRef, useEffect, useMemo, useState, CSSProperties } from "react";

type PatternShape = "Checks" | "Stripes" | "Edge";

const PatternShapes: Record<PatternShape, number> = {
  Checks: 0,
  Stripes: 1,
  Edge: 2,
};

type PresetName = "Prism" | "Lava" | "Plasma" | "Pulse" | "Vortex" | "Mist";

interface PresetParams {
  color1: string;
  color2: string;
  color3: string;
  rotation: number;
  proportion: number;
  scale: number;
  speed: number;
  distortion: number;
  swirl: number;
  swirlIterations: number;
  softness: number;
  offset: number;
  shape: PatternShape;
  shapeSize: number;
}

const presets: Record<PresetName, PresetParams> = {
  Prism:  { color1: "#050505", color2: "#66B3FF", color3: "#FFFFFF", rotation: -50, proportion: 1,   scale: 0.01, speed: 30, distortion: 0,  swirl: 50,  swirlIterations: 16, softness: 47,  offset: -299, shape: "Checks",  shapeSize: 45 },
  Lava:   { color1: "#FF9F21", color2: "#FF0303", color3: "#000000", rotation: 114, proportion: 100, scale: 0.52, speed: 30, distortion: 7,  swirl: 18,  swirlIterations: 20, softness: 100, offset: 717,  shape: "Edge",    shapeSize: 12 },
  Plasma: { color1: "#B566FF", color2: "#000000", color3: "#000000", rotation: 0,   proportion: 63,  scale: 0.75, speed: 30, distortion: 5,  swirl: 61,  swirlIterations: 5,  softness: 100, offset: -168, shape: "Checks",  shapeSize: 28 },
  Pulse:  { color1: "#66FF85", color2: "#000000", color3: "#000000", rotation: -167,proportion: 92,  scale: 0,    speed: 20, distortion: 54, swirl: 75,  swirlIterations: 3,  softness: 28,  offset: -813, shape: "Checks",  shapeSize: 79 },
  Vortex: { color1: "#000000", color2: "#FFFFFF", color3: "#000000", rotation: 50,  proportion: 41,  scale: 0.4,  speed: 20, distortion: 0,  swirl: 100, swirlIterations: 3,  softness: 5,   offset: -744, shape: "Stripes", shapeSize: 80 },
  Mist:   { color1: "#050505", color2: "#FF66B8", color3: "#050505", rotation: 0,   proportion: 33,  scale: 0.48, speed: 39, distortion: 4,  swirl: 65,  swirlIterations: 5,  softness: 100, offset: -235, shape: "Edge",    shapeSize: 48 },
};

interface CustomConfig {
  preset: "custom";
  color1: string;
  color2: string;
  color3: string;
  rotation?: number;
  proportion?: number;
  scale?: number;
  speed?: number;
  distortion?: number;
  swirl?: number;
  swirlIterations?: number;
  softness?: number;
  offset?: number;
  shape?: PatternShape;
  shapeSize?: number;
}

interface PresetConfig {
  preset: PresetName;
  speed?: number;
}

type GradientConfig = CustomConfig | PresetConfig;

interface NoiseConfig {
  opacity: number;
  scale?: number;
}

interface AnimatedGradientProps {
  config?: GradientConfig;
  noise?: NoiseConfig;
  radius?: string;
  style?: CSSProperties;
  className?: string;
  /** Called with false when WebGL2 is unavailable or the shader fails to
   *  build, so the caller can keep a CSS fallback visible. */
  onSupportChange?: (supported: boolean) => void;
}

export default function AnimatedGradient({
  config = { preset: "Prism" },
  noise,
  radius = "0px",
  style,
  className,
  onSupportChange,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const params = useMemo((): PresetParams => {
    if (config.preset === "custom") {
      return {
        color1: config.color1,
        color2: config.color2,
        color3: config.color3,
        rotation: config.rotation ?? 0,
        proportion: config.proportion ?? 35,
        scale: config.scale ?? 1,
        speed: config.speed ?? 25,
        distortion: config.distortion ?? 12,
        swirl: config.swirl ?? 80,
        swirlIterations: config.swirlIterations ?? 10,
        softness: config.softness ?? 100,
        offset: config.offset ?? 0,
        shape: config.shape ?? "Checks",
        shapeSize: config.shapeSize ?? 10,
      };
    }
    const preset = presets[config.preset] || presets.Prism;
    return { ...preset, speed: config.speed ?? preset.speed };
  }, [config]);

  /* Colours are constant per config — parse once, not every frame. */
  const rgba = useMemo(
    () => ({
      c1: hexToRgba(params.color1),
      c2: hexToRgba(params.color2),
      c3: hexToRgba(params.color3),
    }),
    [params.color1, params.color2, params.color3]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !isMounted) return;

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: true,
    });
    if (!gl) {
      onSupportChange?.(false);
      return;
    }

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("[AnimatedGradient] shader compile failed:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) {
      onSupportChange?.(false);
      return;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("[AnimatedGradient] program link failed:", gl.getProgramInfoLog(program));
      onSupportChange?.(false);
      return;
    }
    gl.useProgram(program);
    onSupportChange?.(true);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const u = {
      time: gl.getUniformLocation(program, "u_time"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      pixelRatio: gl.getUniformLocation(program, "u_pixelRatio"),
      scale: gl.getUniformLocation(program, "u_scale"),
      rotation: gl.getUniformLocation(program, "u_rotation"),
      color1: gl.getUniformLocation(program, "u_color1"),
      color2: gl.getUniformLocation(program, "u_color2"),
      color3: gl.getUniformLocation(program, "u_color3"),
      proportion: gl.getUniformLocation(program, "u_proportion"),
      softness: gl.getUniformLocation(program, "u_softness"),
      shape: gl.getUniformLocation(program, "u_shape"),
      shapeScale: gl.getUniformLocation(program, "u_shapeScale"),
      distortion: gl.getUniformLocation(program, "u_distortion"),
      swirl: gl.getUniformLocation(program, "u_swirl"),
      swirlIterations: gl.getUniformLocation(program, "u_swirlIterations"),
    };

    /* Cap DPR at 2 — a 3x retina full-bleed shader is a lot of
       fragments for no visible gain. */
    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const draw = (elapsed: number) => {
      const speed = (params.speed / 100) * 5;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      gl.uniform1f(u.time, elapsed * speed + params.offset * 0.01);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.pixelRatio, dpr);
      gl.uniform1f(u.scale, params.scale);
      gl.uniform1f(u.rotation, (params.rotation * Math.PI) / 180);
      gl.uniform4f(u.color1, rgba.c1[0], rgba.c1[1], rgba.c1[2], rgba.c1[3]);
      gl.uniform4f(u.color2, rgba.c2[0], rgba.c2[1], rgba.c2[2], rgba.c2[3]);
      gl.uniform4f(u.color3, rgba.c3[0], rgba.c3[1], rgba.c3[2], rgba.c3[3]);
      gl.uniform1f(u.proportion, params.proportion / 100);
      gl.uniform1f(u.softness, params.softness / 100);
      gl.uniform1f(u.shape, PatternShapes[params.shape]);
      gl.uniform1f(u.shapeScale, params.shapeSize / 100);
      gl.uniform1f(u.distortion, params.distortion / 50);
      gl.uniform1f(u.swirl, params.swirl / 100);
      gl.uniform1f(u.swirlIterations, params.swirl === 0 ? 0 : params.swirlIterations);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    /* Reduced motion: render one static frame and stop. The gradient
       still reads as a designed background, it just does not move. */
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let running = false;

    const animate = (time: number) => {
      draw((time - startTimeRef.current) / 1000);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    const start = () => {
      if (running || motionQuery.matches) return;
      running = true;
      if (pausedAtRef.current !== null) {
        /* Shift the origin forward so resuming does not jump. */
        startTimeRef.current += performance.now() - pausedAtRef.current;
        pausedAtRef.current = null;
      } else {
        startTimeRef.current = performance.now();
      }
      frameIdRef.current = requestAnimationFrame(animate);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      pausedAtRef.current = performance.now();
      if (frameIdRef.current !== undefined) cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = undefined;
    };

    const onMotionChange = () => {
      if (motionQuery.matches) { stop(); draw(0); } else { start(); }
    };
    motionQuery.addEventListener("change", onMotionChange);

    if (motionQuery.matches) {
      draw(0);
    } else {
      /* Only animate while actually on screen, and never in a hidden tab. */
      const io = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting && !document.hidden ? start() : stop()),
        { threshold: 0 }
      );
      io.observe(container);

      const onVisibility = () => (document.hidden ? stop() : start());
      document.addEventListener("visibilitychange", onVisibility);

      return () => {
        stop();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        motionQuery.removeEventListener("change", onMotionChange);
        resizeObserver.disconnect();
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(positionBuffer);
      };
    }

    return () => {
      stop();
      motionQuery.removeEventListener("change", onMotionChange);
      resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [isMounted, params, rgba, onSupportChange]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        borderRadius: radius,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
      {noise && noise.opacity > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMCCgkGBAVJOAVJAAAASklEQVQ4y2NgGAWjYBSMglEwCgY/YGRgZBQUYmJiZGQEkYwMjIyMgoKCjIyMIJKBgRFIMjIyAklGRkYGRkFBYEcwMDIyMjAOUQAA1I4HwVwZAkYAAAAASUVORK5CYII=")`,
            backgroundSize: (noise.scale ?? 1) * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}

function hexToRgba(hex: string): [number, number, number, number] {
  let r = 0, g = 0, b = 0, a = 1;

  if (hex.startsWith("rgba(")) {
    const p = hex.slice(5, -1).split(",");
    r = parseInt(p[0]) / 255; g = parseInt(p[1]) / 255; b = parseInt(p[2]) / 255; a = parseFloat(p[3]);
  } else if (hex.startsWith("rgb(")) {
    const p = hex.slice(4, -1).split(",");
    r = parseInt(p[0]) / 255; g = parseInt(p[1]) / 255; b = parseInt(p[2]) / 255;
  } else if (hex.startsWith("hsla(") || hex.startsWith("hsl(")) {
    const isHsla = hex.startsWith("hsla(");
    const p = hex.slice(isHsla ? 5 : 4, -1).split(",");
    const h = parseFloat(p[0]) / 360, s = parseFloat(p[1]) / 100, l = parseFloat(p[2]) / 100;
    a = isHsla ? parseFloat(p[3]) : 1;
    [r, g, b] = hslToRgb(h, s, l);
  } else if (hex.startsWith("#")) {
    const c = hex.slice(1);
    if (c.length === 3) {
      r = parseInt(c[0] + c[0], 16) / 255; g = parseInt(c[1] + c[1], 16) / 255; b = parseInt(c[2] + c[2], 16) / 255;
    } else if (c.length >= 6) {
      r = parseInt(c.slice(0, 2), 16) / 255; g = parseInt(c.slice(2, 4), 16) / 255; b = parseInt(c.slice(4, 6), 16) / 255;
      if (c.length === 8) a = parseInt(c.slice(6, 8), 16) / 255;
    }
  }
  return [r, g, b, a];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r, g, b];
}

const VERTEX_SHADER = `#version 300 es
in vec4 a_position;
void main() { gl_Position = a_position; }`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  float x1 = mix(a, b, u.x);
  float x2 = mix(c, d, u.x);
  return mix(x1, x2, u.y);
}

vec4 blend_colors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edge_blur) {
    vec3 color1 = c1.rgb * c1.a;
    vec3 color2 = c2.rgb * c2.a;
    vec3 color3 = c3.rgb * c3.a;
    float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edge_blur, mixer);
    float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edge_blur, mixer);
    vec3 blended_color_2 = mix(color1, color2, r1);
    float blended_opacity_2 = mix(c1.a, c2.a, r1);
    vec3 c = mix(blended_color_2, color3, r2);
    float o = mix(blended_opacity_2, c3.a, r2);
    return vec4(c, o);
}

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = .5 * u_time;
    float noise_scale = .0005 + .006 * u_scale;

    uv -= .5;
    uv *= (noise_scale * u_resolution);
    uv = rotate(uv, u_rotation * .5 * PI);
    uv /= u_pixelRatio;
    uv += .5;

    float n1 = noise(uv * 1. + t);
    float n2 = noise(uv * 2. - t);
    float angle = n1 * TWO_PI;
    uv.x += 4. * u_distortion * n2 * cos(angle);
    uv.y += 4. * u_distortion * n2 * sin(angle);

    float iterations_number = ceil(clamp(u_swirlIterations, 1., 30.));
    for (float i = 1.; i <= iterations_number; i++) {
        uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
        uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1. * uv.x);
    }

    float proportion = clamp(u_proportion, 0., 1.);
    float shape = 0.;
    float mixer = 0.;
    if (u_shape < .5) {
      vec2 checks_shape_uv = uv * (.5 + 3.5 * u_shapeScale);
      shape = .5 + .5 * sin(checks_shape_uv.x) * cos(checks_shape_uv.y);
      mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
    } else if (u_shape < 1.5) {
      vec2 stripes_shape_uv = uv * (.25 + 3. * u_shapeScale);
      float f = fract(stripes_shape_uv.y);
      shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
      mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
    } else {
      float sh = 1. - uv.y;
      sh -= .5;
      sh /= (noise_scale * u_resolution.y);
      sh += .5;
      float shape_scaling = .2 * (1. - u_shapeScale);
      shape = smoothstep(.45 - shape_scaling, .55 + shape_scaling, sh + .3 * (proportion - .5));
      mixer = shape;
    }

    vec4 color_mix = blend_colors(u_color1, u_color2, u_color3, mixer, 1. - clamp(u_softness, 0., 1.), .01 + .01 * u_scale);
    fragColor = vec4(color_mix.rgb, color_mix.a);
}
`;
