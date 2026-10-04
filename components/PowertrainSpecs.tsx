"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { photos, unsplashLoader } from "@/lib/media";
import { EASE_OUT_EXPO, Reveal, SectionHeading, trackPointer } from "@/components/ui/primitives";

const METRICS = [
  { value: 903, decimals: 0, unit: "HP", label: "Combined Output", detail: "727 HP V8 + 176 HP e-motor", gauge: 0.92 },
  { value: 900, decimals: 0, unit: "Nm", label: "Peak Torque", detail: "Instant electric torque-fill", gauge: 0.86 },
  { value: 2.8, decimals: 1, unit: "Sec", label: "0–100 km/h", detail: "0–200 km/h in 6.8 s", gauge: 0.97 },
  { value: 350, decimals: 0, unit: "Km/h", label: "Top Speed", detail: "Electronically limited", gauge: 0.9 },
] as const;

const CALLOUTS = [
  { k: "3.8L", label: "Twin-turbo V8 · M838TQ", pos: "left-[8%] top-[18%]" },
  { k: "4.7", unit: "kWh", label: "Li-ion battery pack", pos: "left-[42%] bottom-[16%]" },
  { k: "10", unit: "km", label: "Pure E-mode range", pos: "right-[7%] top-[24%]" },
];

export default function PowertrainSpecs() {
  return (
    <section id="powertrain" className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] ambient-top" />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="02"
            eyebrow="Telemetry & Powertrain"
            title={
              <>
                Hybrid violence,
                <br />
                <span className="text-papaya">surgically delivered</span>
              </>
            }
          />
          <Reveal delay={0.1} className="max-w-sm text-white/60 lg:pb-2">
            Instant Power Assist System, F1-derived KERS and a 3.8-litre twin-turbo V8 — tuned as one
            organism, so every throttle input lands with zero hesitation.
          </Reveal>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <motion.li
              key={m.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: EASE_OUT_EXPO }}
              onPointerMove={trackPointer}
              className="glass hover-light hud-corners group rounded-2xl p-6 transition-colors duration-500 hover:border-papaya/40"
            >
              <div className="flex items-center justify-between font-hud text-[11px] font-semibold uppercase tracking-[0.3em] text-white/45">
                <span>{m.label}</span>
                <span className="tabular text-papaya/70">0{i + 1}</span>
              </div>

              <div className="mt-8 flex items-baseline gap-2">
                <Counter
                  value={m.value}
                  decimals={m.decimals}
                  className="tabular font-display text-5xl font-bold tracking-tight text-white transition-[text-shadow] duration-500 group-hover:text-glow md:text-6xl"
                />
                <span className="font-hud text-sm font-bold uppercase tracking-[0.24em] text-papaya">{m.unit}</span>
              </div>

              <Gauge value={m.gauge} delay={0.2 + i * 0.08} />

              <p className="mt-4 text-sm text-white/50">{m.detail}</p>
            </motion.li>
          ))}
        </ul>

        <Reveal delay={0.05} className="mt-6">
          <figure className="hud-corners group relative overflow-hidden rounded-2xl border border-hairline bg-graphite">
            <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
              <Image
                loader={unsplashLoader}
                src={photos.blackP1.src}
                alt={photos.blackP1.alt}
                fill
                sizes="(min-width: 1280px) 1280px, 100vw"
                className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/20 to-carbon/30" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgb(255_128_0/0.18),transparent_60%)]" />

              {CALLOUTS.map((c) => (
                <div key={c.label} className={`absolute hidden md:block ${c.pos}`}>
                  <div className="glass rounded-lg px-4 py-3">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-2xl font-bold text-white">{c.k}</span>
                      {c.unit && (
                        <span className="font-hud text-xs font-bold uppercase tracking-[0.2em] text-papaya">{c.unit}</span>
                      )}
                    </div>
                    <div className="font-hud text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
                      {c.label}
                    </div>
                  </div>
                </div>
              ))}

              <figcaption className="absolute bottom-4 left-5 right-5 flex flex-wrap items-end justify-between gap-2 font-hud text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45 md:bottom-6 md:left-8 md:right-8">
                <span>
                  <span className="text-papaya">●</span> Mid-mounted hybrid powertrain · carbon MonoCage
                </span>
                <a href={photos.blackP1.href} target="_blank" rel="noreferrer" className="hover:text-white">
                  Photo · {photos.blackP1.credit}
                </a>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}

/** Counts up when scrolled into view. Writes textContent directly — no re-renders. */
function Counter({ value, decimals, className }: { value: number; decimals: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!inView) {
      el.textContent = formatFixed(0, decimals);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: EASE_OUT_EXPO,
      onUpdate: (v) => (el.textContent = formatFixed(v, decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals, reduce]);

  // SSR / no-JS render the final figure.
  return (
    <span ref={ref} className={className}>
      {formatFixed(value, decimals)}
    </span>
  );
}

const formatFixed = (v: number, decimals: number) => v.toFixed(decimals);

function Gauge({ value, delay }: { value: number; delay: number }) {
  return (
    <div className="mt-6 flex items-center gap-1" aria-hidden="true">
      {Array.from({ length: 20 }, (_, i) => {
        const lit = i / 20 < value;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0.15 }}
            whileInView={{ opacity: lit ? 1 : 0.15 }}
            viewport={{ once: true }}
            transition={{ duration: 0.25, delay: delay + i * 0.035 }}
            className={`h-3 flex-1 rounded-[1px] ${lit ? (i > 16 ? "bg-papaya-deep" : "bg-papaya") : "bg-white/40"}`}
          />
        );
      })}
    </div>
  );
}
