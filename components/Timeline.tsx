"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, Reveal, SectionHeading } from "@/components/ui/primitives";

const STAGES = [
  {
    stage: "01",
    period: "2010 — 2012",
    title: "Concept Genesis",
    body: "Penned under Frank Stephenson, the P1 is 'shrink-wrapped' around its mechanicals. It breaks cover as a design study at the 2012 Paris Motor Show.",
    points: ["Successor to the F1 brief", "Form follows airflow", "Paris Motor Show debut"],
  },
  {
    stage: "02",
    period: "2012 — 2013",
    title: "Wind Tunnel Optimisation",
    body: "Hundreds of hours in the tunnel tune the active wing, front flaps and underbody until the P1 generates 600 kg of downforce — more than any road car before it.",
    points: ["600 kg peak downforce", "DRS: −23% drag", "Active front flaps"],
  },
  {
    stage: "03",
    period: "2013 — 2015",
    title: "Track Calibration & Production",
    body: "Calibrated at the Nürburgring and McLaren's test tracks, production begins in Woking. 375 cars are hand-built; every one sold before the first was delivered.",
    points: ["Nordschleife-calibrated", "375 units hand-built", "Sold out pre-delivery"],
  },
];

export default function Timeline() {
  const [active, setActive] = useState(0);

  return (
    <section id="evolution" className="relative overflow-hidden bg-graphite py-24 md:py-36">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="pointer-events-none absolute right-0 top-0 h-[480px] w-[480px] translate-x-1/3 -translate-y-1/3 rounded-full bg-papaya/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading
          index="05"
          eyebrow="Performance Evolution"
          title={
            <>
              From sketch
              <br />
              <span className="text-papaya">to Nordschleife</span>
            </>
          }
          body="Three stages turned a clean sheet into the benchmark hypercar of its decade."
        />

        <div className="relative mt-16">
          {/* Connector — horizontal on desktop */}
          <div className="absolute left-0 right-0 top-[27px] hidden h-px bg-white/10 lg:block" aria-hidden="true">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-papaya-deep to-papaya shadow-[0_0_10px_#ff8000]"
              animate={{ scaleX: (active + 1) / STAGES.length }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            />
          </div>
          {/* Connector — vertical on mobile */}
          <div className="absolute bottom-0 left-[27px] top-0 w-px bg-white/10 lg:hidden" aria-hidden="true">
            <motion.div
              className="w-full origin-top bg-papaya"
              style={{ height: "100%" }}
              animate={{ scaleY: (active + 1) / STAGES.length }}
              transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            />
          </div>

          <ol className="relative grid gap-6 lg:grid-cols-3">
            {STAGES.map((s, i) => {
              const isActive = i === active;
              const reached = i <= active;
              return (
                <li key={s.stage}>
                  <Reveal delay={i * 0.1} className="flex gap-5 lg:flex-col">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border font-display text-sm font-bold transition-all duration-500",
                        reached
                          ? "border-papaya bg-carbon text-papaya shadow-[0_0_24px_rgb(255_128_0/0.45)]"
                          : "border-white/15 bg-carbon text-white/40",
                      )}
                    >
                      {s.stage}
                    </span>

                    <div
                      onMouseEnter={() => setActive(i)}
                      className={cn(
                        "relative w-full rounded-2xl border p-6 transition-colors duration-500 md:p-7",
                        isActive
                          ? "glass border-papaya/40"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20",
                      )}
                    >
                      <h3>
                        {/* ::after stretches the button over the whole card */}
                        <button
                          type="button"
                          onClick={() => setActive(i)}
                          aria-expanded={isActive}
                          aria-controls={`stage-${s.stage}-details`}
                          className="block w-full text-left after:absolute after:inset-0 after:rounded-2xl"
                        >
                          <span className="block font-hud text-[11px] font-semibold uppercase tracking-[0.32em] text-papaya">
                            Stage {s.stage} · <span className="text-white/45">{s.period}</span>
                          </span>
                          <span className="mt-3 block font-display text-xl font-bold uppercase tracking-[0.05em] text-white">
                            {s.title}
                          </span>
                        </button>
                      </h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/55">{s.body}</p>

                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            id={`stage-${s.stage}-details`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
                              {s.points.map((p) => (
                                <li
                                  key={p}
                                  className="flex items-center gap-3 font-hud text-xs font-semibold uppercase tracking-[0.22em] text-white/75"
                                >
                                  <span className="h-1.5 w-1.5 rotate-45 bg-papaya" />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
