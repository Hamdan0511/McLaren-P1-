"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { useLenis } from "lenis/react";
import P1ScrollCanvas from "@/components/P1ScrollCanvas";
import Preloader from "@/components/Preloader";
import { EASE_OUT_EXPO, useElementScrollProgress } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

const TOTAL_FRAMES = 240;

const PHASES = [
  { at: 0, label: "Stance" },
  { at: 0.33, label: "Dihedral Doors" },
  { at: 0.66, label: "Hybrid Heart" },
] as const;

export default function HeroCanvas() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useElementScrollProgress(sectionRef, ["start start", "end end"]);

  const loadProgress = useMotionValue(0);
  const [ready, setReady] = useState(false);
  const lenis = useLenis();

  // Hold the page still until every frame is cached.
  useEffect(() => {
    const html = document.documentElement;
    if (ready) {
      html.style.removeProperty("overflow");
      lenis?.start();
      return;
    }
    html.style.overflow = "hidden";
    lenis?.stop();
  }, [ready, lenis]);

  const handleProgress = useCallback((r: number) => loadProgress.set(r), [loadProgress]);
  const handleReady = useCallback(() => setReady(true), []);

  return (
    <>
      <Preloader progress={loadProgress} visible={!ready} />

      <section
        id="top"
        ref={sectionRef}
        aria-label="McLaren P1 — scroll to open the doors and reveal the engine"
        className="relative h-[600vh]"
      >
        <div className="sticky top-0 h-svh w-full overflow-hidden bg-studio md:h-dvh">
          <P1ScrollCanvas
            scrollYProgress={progress}
            totalFrames={TOTAL_FRAMES}
            imageFolderPath="/images/p1sequence"
            onProgress={handleProgress}
            onReady={handleReady}
            focusX={0.52}
            portraitFocusY={0.3}
          />

          {/* Legibility gradients — static, never re-rendered on scroll */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-carbon/80 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-carbon via-carbon/40 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-carbon/55 to-transparent md:w-1/2" />

          <HudFrame progress={progress} />
          <HeroOverlays progress={progress} ready={ready} />
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */

function HeroOverlays({ progress, ready }: { progress: MotionValue<number>; ready: boolean }) {
  // Phase A — title
  const aOpacity = useTransform(progress, [0, 0.2, 0.28], [1, 1, 0]);
  const aY = useTransform(progress, [0, 0.28], [0, -60]);
  const cueOpacity = useTransform(progress, [0, 0.04], [1, 0]);

  // Phase B — doors
  const bOpacity = useTransform(progress, [0.3, 0.38, 0.55, 0.62], [0, 1, 1, 0]);
  const bY = useTransform(progress, [0.3, 0.38, 0.62], [40, 0, -40]);

  // Phase C — engine
  const cOpacity = useTransform(progress, [0.66, 0.74, 0.96, 1], [0, 1, 1, 0.9]);
  const cY = useTransform(progress, [0.66, 0.74], [40, 0]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* A — Title */}
      <motion.div
        style={{ opacity: aOpacity, y: aY }}
        className="absolute inset-x-0 bottom-[14svh] px-5 md:bottom-[12vh] md:px-12 lg:px-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.2, delay: 0.25, ease: EASE_OUT_EXPO }}
        >
          <div className="flex items-center gap-3 font-hud text-[11px] font-semibold uppercase tracking-[0.34em] text-papaya md:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-papaya shadow-[0_0_12px_#ff8000]" />
            Ultimate Series · 375 Built · 2013–2015
          </div>

          <h1 className="mt-5 font-display font-black uppercase leading-[0.86] tracking-[0.02em] text-white">
            <span className="block text-[clamp(3rem,13vw,5rem)] md:whitespace-nowrap md:text-[clamp(4rem,9.4vw,10rem)]">McLaren P1</span>
            <span className="mt-4 flex items-center gap-4 font-hud text-[clamp(0.95rem,2.2vw,1.6rem)] font-semibold tracking-[0.42em] text-white/75">
              <span className="h-px w-8 bg-papaya md:w-14" />
              The Definitive Hypercar
            </span>
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="glass hud-corners rounded-md px-4 py-2.5">
              <div className="font-hud text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">
                Launch MSRP
              </div>
              <div className="font-display text-lg font-bold tracking-[0.12em] text-papaya text-glow md:text-xl">
                US$1.15M
              </div>
            </div>
            <ul className="flex flex-wrap gap-2 font-hud text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              {["903 HP", "2.8 s 0–100", "350 km/h"].map((s) => (
                <li key={s} className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-md">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="font-hud text-[10px] font-semibold uppercase tracking-[0.4em] text-white/50">
          Scroll to ignite
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-papaya" />
        </span>
      </motion.div>

      {/* B — Doors */}
      <motion.div
        style={{ opacity: bOpacity, y: bY }}
        className="absolute inset-x-4 bottom-[10svh] md:inset-x-auto md:bottom-auto md:right-14 md:top-1/2 md:w-[380px] md:-translate-y-1/2 lg:right-24"
      >
        <PhaseCard
          index="02"
          kicker="Dihedral Doors"
          title="Lift-off Geometry"
          body="Roof-hinged carbon doors sweep up and forward, opening a wide aperture into the MonoCage while keeping the footprint tight."
          stats={[
            { k: "90", u: "kg", label: "MonoCage tub" },
            { k: "1,395", u: "kg", label: "Dry weight" },
          ]}
        />
      </motion.div>

      {/* C — Engine */}
      <motion.div
        style={{ opacity: cOpacity, y: cY }}
        className="absolute inset-x-4 bottom-[10svh] md:inset-x-auto md:bottom-auto md:left-12 md:top-[26%] md:w-[400px] lg:left-20"
      >
        <PhaseCard
          index="03"
          kicker="Hybrid Heart"
          title="3.8L Twin-Turbo V8 + E‑Motor"
          body="A 727 HP V8 and 176 HP electric motor fuse into a single 903 HP surge — torque-fill from zero, before the turbos even spool."
          stats={[
            { k: "903", u: "HP", label: "Combined" },
            { k: "900", u: "Nm", label: "Peak torque" },
          ]}
        />
      </motion.div>
    </div>
  );
}

function PhaseCard({
  index,
  kicker,
  title,
  body,
  stats,
}: {
  index: string;
  kicker: string;
  title: string;
  body: string;
  stats: { k: string; u: string; label: string }[];
}) {
  return (
    <div className="glass hud-corners relative overflow-hidden rounded-xl p-5 md:p-6">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgb(255_128_0/0.22),transparent_70%)]" />
      <div className="relative">
        <div className="flex items-center gap-3 font-hud text-[11px] font-semibold uppercase tracking-[0.32em] text-papaya">
          <span className="tabular text-white/40">{index}</span>
          {kicker}
        </div>
        <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight tracking-[0.06em] text-white md:text-2xl">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-[15px]">{body}</p>
        <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse bg-graphite/90 px-4 py-3">
              <dt className="mt-1 font-hud text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
                {s.label}
              </dt>
              <dd className="flex items-baseline gap-1.5">
                <span className="tabular font-display text-2xl font-bold text-white">{s.k}</span>
                <span className="font-hud text-xs font-semibold uppercase tracking-[0.2em] text-papaya">{s.u}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function HudFrame({ progress }: { progress: MotionValue<number> }) {
  const frame = useTransform(progress, (p) =>
    `${Math.round(Math.min(1, Math.max(0, p)) * (TOTAL_FRAMES - 1)) + 1}`.padStart(3, "0"),
  );
  const phase = useTransform(progress, (p) => {
    let label: string = PHASES[0].label;
    for (const ph of PHASES) if (p >= ph.at - 0.03) label = ph.label;
    return label;
  });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Viewport brackets */}
      <div className="hud-corners absolute inset-3 opacity-50 md:inset-6" />

      {/* Top-right telemetry readout */}
      <div className="absolute right-5 top-20 hidden text-right font-hud text-[10px] font-semibold uppercase tracking-[0.32em] text-white/45 md:right-10 md:top-24 md:block">
        <div>
          Seq <motion.span className="tabular text-papaya">{frame}</motion.span>
          <span className="text-white/25"> / {TOTAL_FRAMES}</span>
        </div>
        <motion.div className="mt-1 text-white/70">{phase}</motion.div>
      </div>

      {/* Right-edge progress rail */}
      <div className="absolute right-5 top-1/2 hidden h-[38vh] -translate-y-1/2 md:right-10 md:block">
        <div className="relative h-full w-px bg-white/15">
          <motion.div
            style={{ scaleY: progress }}
            className="absolute inset-0 origin-top bg-papaya shadow-[0_0_10px_#ff8000]"
          />
          {PHASES.map((ph) => (
            <span
              key={ph.label}
              className={cn("absolute -left-[3px] h-[7px] w-[7px] rotate-45 border border-papaya bg-carbon")}
              style={{ top: `calc(${ph.at * 100}% - 3px)` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
