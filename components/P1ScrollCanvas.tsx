"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface P1ScrollCanvasProps {
  /** 0 → 1 progress through the pinned scroll section. */
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
  imageFolderPath?: string;
  fileExtension?: string;
  /** Called as frames arrive with a 0 → 1 ratio. */
  onProgress?: (ratio: number) => void;
  /** Called once every frame has loaded (or failed) and decoded. */
  onReady?: () => void;
  /** Focal point used when cover-cropping (0 = left/top, 1 = right/bottom). */
  focusX?: number;
  focusY?: number;
  /**
   * On portrait viewports pure `cover` would crop the car down to one wheel.
   * This guarantees at least this fraction of the frame width stays visible;
   * the leftover space is filled with the frame's studio colour and feathered
   * so there is no visible edge. Set to 0 for strict cover everywhere.
   */
  portraitMinVisible?: number;
  /** Vertical placement of the frame within the portrait bands (0 = top, 1 = bottom). */
  portraitFocusY?: number;
  /** Source pixels shaved off each edge (the renders have a dark 2–3px border). */
  edgeTrim?: number;
  /** Must match the backdrop baked into the frames. */
  backgroundColor?: string;
  /** Blend adjacent frames for sub-frame smoothness. */
  interpolate?: boolean;
  /** 0–1: higher = tighter tracking of scroll, lower = more glide. */
  smoothing?: number;
  className?: string;
}

interface DrawLayout {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
  /** CSS-pixel viewport size */
  cw: number;
  ch: number;
  feather: number;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Same colour at zero alpha, so gradients don't fade through grey. */
function transparentOf(color: string) {
  const hex = color.replace("#", "");
  if (/^[0-9a-f]{6}$/i.test(hex)) {
    const n = parseInt(hex, 16);
    return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, 0)`;
  }
  return "rgba(0, 0, 0, 0)";
}

export function computeCoverLayout(
  imgW: number,
  imgH: number,
  cw: number,
  ch: number,
  { focusX = 0.5, focusY = 0.5, portraitMinVisible = 0, portraitFocusY = 0.5, edgeTrim = 0 } = {},
): DrawLayout {
  const sx = edgeTrim;
  const sy = edgeTrim;
  const sw = imgW - edgeTrim * 2;
  const sh = imgH - edgeTrim * 2;

  const imgRatio = sw / sh;
  const canvasRatio = cw / ch;

  // object-fit: cover
  let dw = cw;
  let dh = ch;
  let dx = 0;
  let dy = 0;

  if (canvasRatio > imgRatio) {
    dh = cw / imgRatio;
    dy = (ch - dh) * focusY;
  } else {
    dw = ch * imgRatio;
    dx = (cw - dw) * focusX;
  }

  // Portrait safeguard: never show less than `portraitMinVisible` of the width.
  if (portraitMinVisible > 0 && canvasRatio < 1 && cw / dw < portraitMinVisible) {
    dw = cw / portraitMinVisible;
    dh = dw / imgRatio;
    dx = (cw - dw) * focusX;
    dy = (ch - dh) * portraitFocusY;
  }

  const hasBands = dh < ch - 0.5;
  return { sx, sy, sw, sh, dx, dy, dw, dh, cw, ch, feather: hasBands ? dh * 0.12 : 0 };
}

export default function P1ScrollCanvas({
  scrollYProgress,
  totalFrames,
  imageFolderPath = "/images/p1sequence",
  fileExtension = "jpg",
  onProgress,
  onReady,
  focusX = 0.5,
  focusY = 0.5,
  portraitMinVisible = 0.62,
  portraitFocusY = 0.5,
  edgeTrim = 4,
  backgroundColor = "#0d0d0d",
  interpolate = true,
  smoothing = 0.22,
  className,
}: P1ScrollCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // In-memory frame cache: decoded HTMLImageElements indexed by frame.
  const framesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const layoutRef = useRef<DrawLayout | null>(null);

  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const lastDrawnRef = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef(0);

  // Latest callbacks/options without re-running the heavy effects.
  const onProgressRef = useRef(onProgress);
  const onReadyRef = useRef(onReady);
  const optsRef = useRef({ focusX, focusY, portraitMinVisible, portraitFocusY, edgeTrim, backgroundColor, interpolate, smoothing });
  useEffect(() => {
    onProgressRef.current = onProgress;
    onReadyRef.current = onReady;
    optsRef.current = { focusX, focusY, portraitMinVisible, portraitFocusY, edgeTrim, backgroundColor, interpolate, smoothing };
  });

  const basePath = imageFolderPath.replace(/\/$/, "");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let cancelled = false;
    const frames: (HTMLImageElement | undefined)[] = new Array(totalFrames);
    framesRef.current = frames;
    lastDrawnRef.current = -1;

    const getCtx = () => {
      if (!ctxRef.current) ctxRef.current = canvas.getContext("2d", { alpha: false });
      return ctxRef.current;
    };

    /** Nearest available frame, so a failed request never blanks the canvas. */
    const frameAt = (index: number) => {
      const i = clamp(index, 0, totalFrames - 1);
      if (frames[i]) return frames[i];
      for (let d = 1; d < totalFrames; d++) {
        if (frames[i - d]) return frames[i - d];
        if (frames[i + d]) return frames[i + d];
      }
      return undefined;
    };

    const measure = () => {
      const sample = frameAt(0);
      const rect = container.getBoundingClientRect();
      const cw = Math.max(1, Math.round(rect.width));
      const ch = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      const bw = Math.round(cw * dpr);
      const bh = Math.round(ch * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }

      const ctx = getCtx();
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      layoutRef.current = sample
        ? computeCoverLayout(sample.naturalWidth, sample.naturalHeight, cw, ch, optsRef.current)
        : null;
    };

    const draw = (position: number) => {
      const ctx = getCtx();
      const L = layoutRef.current;
      if (!ctx || !L) return;

      const base = Math.floor(position);
      const frac = position - base;
      const a = frameAt(base);
      if (!a) return;

      const { backgroundColor: bg, interpolate: blend } = optsRef.current;

      if (L.feather > 0) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, L.cw, L.ch);
      }

      ctx.globalAlpha = 1;
      ctx.drawImage(a, L.sx, L.sy, L.sw, L.sh, L.dx, L.dy, L.dw, L.dh);

      if (blend && frac > 0.02 && base + 1 < totalFrames) {
        const b = frameAt(base + 1);
        if (b && b !== a) {
          ctx.globalAlpha = frac;
          ctx.drawImage(b, L.sx, L.sy, L.sw, L.sh, L.dx, L.dy, L.dw, L.dh);
          ctx.globalAlpha = 1;
        }
      }

      // Feather the frame into the studio backdrop on portrait screens.
      if (L.feather > 0) {
        const clear = transparentOf(bg);
        const top = ctx.createLinearGradient(0, L.dy, 0, L.dy + L.feather);
        top.addColorStop(0, bg);
        top.addColorStop(1, clear);
        ctx.fillStyle = top;
        ctx.fillRect(0, L.dy, L.cw, L.feather);

        const bottomEdge = L.dy + L.dh;
        const bottom = ctx.createLinearGradient(0, bottomEdge - L.feather, 0, bottomEdge);
        bottom.addColorStop(0, clear);
        bottom.addColorStop(1, bg);
        ctx.fillStyle = bottom;
        ctx.fillRect(0, bottomEdge - L.feather, L.cw, L.feather);
      }
    };

    const tick = (ts: number) => {
      rafRef.current = null;
      const dt = lastTsRef.current ? Math.min(64, ts - lastTsRef.current) : 16.67;
      lastTsRef.current = ts;

      const target = targetRef.current;
      // Frame-rate independent exponential easing toward the scroll target.
      const k = 1 - Math.pow(1 - optsRef.current.smoothing, dt / 16.67);
      let current = currentRef.current + (target - currentRef.current) * k;
      if (Math.abs(target - current) < 0.002) current = target;
      currentRef.current = current;

      // Quantise so we only touch the canvas when the visible result changes.
      const key = optsRef.current.interpolate ? Math.round(current * 50) / 50 : Math.floor(current);
      if (key !== lastDrawnRef.current) {
        lastDrawnRef.current = key;
        draw(current);
      }

      if (current !== target) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        lastTsRef.current = 0;
      }
    };

    const kick = () => {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    };

    const redrawNow = () => {
      measure();
      draw(currentRef.current);
      lastDrawnRef.current = Math.round(currentRef.current * 50) / 50;
    };

    // ---- Resize: observe the container (handles mobile URL-bar changes too) ----
    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(redrawNow);
    });
    ro.observe(container);
    const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    mq.addEventListener("change", redrawNow);

    // ---- Scroll → frame target (no React state, no layout reads) ----
    const toFrame = (p: number) => clamp(p, 0, 1) * (totalFrames - 1);
    targetRef.current = toFrame(scrollYProgress.get());
    currentRef.current = targetRef.current;
    const unsubscribe = scrollYProgress.on("change", (p) => {
      targetRef.current = toFrame(p);
      kick();
    });

    // ---- Preload + decode every frame into the cache ----
    let settled = 0;
    const settle = () => {
      settled++;
      onProgressRef.current?.(settled / totalFrames);
      if (settled === totalFrames && !cancelled) {
        redrawNow();
        onReadyRef.current?.();
      }
    };

    const loadFrame = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = `${basePath}/${i + 1}.${fileExtension}`;
        img
          .decode()
          .then(() => {
            if (cancelled) return;
            frames[i] = img;
            // Paint as soon as the frame the user is looking at exists.
            if (!layoutRef.current || i === Math.floor(currentRef.current)) redrawNow();
          })
          .catch(() => {
            /* missing frame: frameAt() falls back to its neighbours */
          })
          .finally(() => {
            if (!cancelled) settle();
            resolve();
          });
      });

    // Small worker pool keeps requests in sequence order so early frames land first.
    const order = Array.from({ length: totalFrames }, (_, i) => i);
    const start = clamp(Math.round(currentRef.current), 0, totalFrames - 1);
    order.splice(start, 1);
    order.unshift(start);
    let cursor = 0;
    const worker = async () => {
      while (!cancelled && cursor < order.length) {
        await loadFrame(order[cursor++]);
      }
    };
    for (let w = 0; w < 8; w++) void worker();

    return () => {
      cancelled = true;
      unsubscribe();
      ro.disconnect();
      mq.removeEventListener("change", redrawNow);
      cancelAnimationFrame(resizeRaf);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = 0;
      framesRef.current = [];
    };
  }, [scrollYProgress, totalFrames, basePath, fileExtension]);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 h-full w-full overflow-hidden", className)}
      style={{ backgroundColor }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full"
      />
    </div>
  );
}
