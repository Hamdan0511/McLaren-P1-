"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { photos, unsplashLoader, type Photo } from "@/lib/media";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, Reveal, SectionHeading } from "@/components/ui/primitives";

interface AeroTab {
  id: string;
  code: string;
  label: string;
  title: string;
  body: string;
  photo: Photo;
  specs: { k: string; u?: string; label: string }[];
  pins: { label: string; x: string; y: string }[];
}

const TABS: AeroTab[] = [
  {
    id: "drs",
    code: "AERO-01",
    label: "DRS Active Rear Wing",
    title: "Downforce on demand",
    body: "The hydraulically actuated rear wing rises up to 300 mm in Race mode while the car drops 50 mm. Press DRS and the wing flattens, slicing drag by 23% for the straight — then snaps back to full attack under braking.",
    photo: photos.gtrOrange,
    specs: [
      { k: "600", u: "kg", label: "Peak downforce" },
      { k: "−23", u: "%", label: "Drag with DRS" },
      { k: "300", u: "mm", label: "Wing extension" },
      { k: "50", u: "mm", label: "Race-mode drop" },
    ],
    pins: [
      { label: "Active wing", x: "62%", y: "34%" },
      { label: "Front flaps", x: "30%", y: "62%" },
    ],
  },
  {
    id: "monocage",
    code: "CHAS-02",
    label: "MonoCage Carbon Tub",
    title: "One piece. Ninety kilos.",
    body: "Roof, snorkel and passenger cell are moulded as a single carbon-fibre structure. The MonoCage is the spine of the P1 — stiff enough for a race car, light enough that the hybrid system costs almost nothing in weight.",
    photo: photos.carbonWeave,
    specs: [
      { k: "90", u: "kg", label: "MonoCage mass" },
      { k: "1,395", u: "kg", label: "Dry weight" },
      { k: "1", label: "Moulded structure" },
      { k: "RaceActive", label: "Chassis control" },
    ],
    pins: [
      { label: "Pre-preg weave", x: "40%", y: "40%" },
      { label: "Load path", x: "64%", y: "70%" },
    ],
  },
  {
    id: "ipas",
    code: "HYB-03",
    label: "IPAS Electric Boost",
    title: "Push to pass",
    body: "The Instant Power Assist System dumps the electric motor's full output on a thumb-press — F1 KERS logic for the road. Lift off and the motor harvests, refilling the battery for the next exit.",
    photo: photos.engineCover,
    specs: [
      { k: "176", u: "HP", label: "Electric boost" },
      { k: "260", u: "Nm", label: "Motor torque" },
      { k: "4.7", u: "kWh", label: "Battery capacity" },
      { k: "96", u: "kg", label: "Battery mass" },
    ],
    pins: [
      { label: "Air intake", x: "56%", y: "28%" },
      { label: "Carbon cover", x: "38%", y: "64%" },
    ],
  },
];

export default function AeroEngineering() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const tab = TABS[active];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const next =
      e.key === "Home" ? 0 : e.key === "End" ? TABS.length - 1 : (active + dir + TABS.length) % TABS.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="aero" className="relative overflow-hidden bg-graphite py-24 md:py-36">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-papaya/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading
          index="03"
          eyebrow="Active Aerodynamics & MonoCage"
          title={
            <>
              Shaped by air.
              <br />
              <span className="text-papaya">Bonded in carbon.</span>
            </>
          }
          body="Three systems turn a road car into a weapon. Select one to inspect it."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-12 lg:gap-10">
          {/* Tab list */}
          <Reveal className="lg:col-span-4">
            <div
              role="tablist"
              aria-label="Engineering systems"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className="no-scrollbar -mx-5 flex gap-3 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
            >
              {TABS.map((t, i) => {
                const selected = i === active;
                return (
                  <button
                    key={t.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`${uid}-tab-${t.id}`}
                    aria-selected={selected}
                    aria-controls={`${uid}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={cn(
                      "relative min-w-[240px] shrink-0 overflow-hidden rounded-xl border px-5 py-5 text-left transition-colors duration-300 lg:min-w-0",
                      selected
                        ? "border-papaya/50 bg-papaya/[0.06]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId={`${uid}-indicator`}
                        className="absolute inset-y-0 left-0 w-[3px] bg-papaya shadow-[0_0_16px_#ff8000]"
                        transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                      />
                    )}
                    <div className="flex items-center justify-between font-hud text-[11px] font-semibold uppercase tracking-[0.3em]">
                      <span className={selected ? "text-papaya" : "text-white/40"}>{t.code}</span>
                      <span className="tabular text-white/30">0{i + 1}</span>
                    </div>
                    <div
                      className={cn(
                        "mt-3 font-display text-base font-bold uppercase tracking-[0.06em] md:text-lg",
                        selected ? "text-white" : "text-white/60",
                      )}
                    >
                      {t.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Panel */}
          <div
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-tab-${tab.id}`}
            className="lg:col-span-8"
          >
            <div className="grid gap-6 md:grid-cols-2">
              {/* Visual */}
              <div className="hud-corners relative aspect-[4/5] overflow-hidden rounded-2xl border border-hairline bg-carbon">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                    className="absolute inset-0"
                  >
                    <Image
                      loader={unsplashLoader}
                      src={tab.photo.src}
                      alt={tab.photo.alt}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-carbon via-carbon/10 to-carbon/40" />

                    {tab.pins.map((p, i) => (
                      <motion.div
                        key={p.label}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.12, duration: 0.5, ease: EASE_OUT_EXPO }}
                        className="absolute flex items-center gap-2"
                        style={{ left: p.x, top: p.y }}
                      >
                        <span className="relative grid h-4 w-4 place-items-center">
                          <span className="absolute inset-0 animate-ping rounded-full bg-papaya/40" />
                          <span className="h-2 w-2 rounded-full bg-papaya" />
                        </span>
                        <span className="glass rounded px-2 py-1 font-hud text-[10px] font-semibold uppercase tracking-[0.24em] text-white/85">
                          {p.label}
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Scanline */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <div className="h-24 w-full animate-scan bg-gradient-to-b from-transparent via-papaya/10 to-transparent" />
                </div>

                <div className="absolute left-4 top-4 font-hud text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
                  <span className="text-papaya">●</span> Live · {tab.code}
                </div>
                <a
                  href={tab.photo.href}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute bottom-3 right-4 font-hud text-[10px] uppercase tracking-[0.24em] text-white/40 hover:text-white"
                >
                  Photo · {tab.photo.credit}
                </a>
              </div>

              {/* Copy + specs */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                  className="flex flex-col"
                >
                  <div className="font-hud text-xs font-semibold uppercase tracking-[0.32em] text-papaya">
                    {tab.label}
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold uppercase leading-tight tracking-[0.05em] text-white md:text-3xl">
                    {tab.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-white/60">{tab.body}</p>

                  <dl className="mt-auto grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 pt-0 max-md:mt-8">
                    {tab.specs.map((s) => (
                      <div key={s.label} className="flex flex-col-reverse bg-carbon/90 p-4">
                        <dt className="mt-1 font-hud text-[10px] font-semibold uppercase tracking-[0.26em] text-white/40">
                          {s.label}
                        </dt>
                        <dd className="flex items-baseline gap-1">
                          <span
                            className={cn(
                              "tabular font-display font-bold text-white",
                              s.k.length > 6 ? "text-base" : "text-2xl md:text-3xl",
                            )}
                          >
                            {s.k}
                          </span>
                          {s.u && (
                            <span className="font-hud text-xs font-bold uppercase tracking-[0.18em] text-papaya">{s.u}</span>
                          )}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
