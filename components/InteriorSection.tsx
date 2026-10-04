"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useTransform } from "framer-motion";
import { photos, unsplashLoader } from "@/lib/media";
import { EASE_OUT_EXPO, SectionHeading, trackPointer, useElementScrollProgress } from "@/components/ui/primitives";

const FEATURES = [
  {
    code: "01",
    title: "Glass-Cockpit Display",
    body: "A single TFT cluster that reshapes itself per drive mode — from E-mode efficiency to a stripped Race-mode shift light. Nothing you don't need.",
    icon: (
      <path d="M3 6h18v10H3zM8 20h8M12 16v4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    code: "02",
    title: "Racing Carbon Seats",
    body: "Ultra-thin carbon shells, each weighing just 3.5 kg, bolted directly to the MonoCage. You don't sit in the P1 — you're mounted to it.",
    icon: (
      <path d="M8 3h6l1 9-2 4H9l-2-4zM7 20h10M9 16l-1 4M15 16l1 4" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    code: "03",
    title: "Alcantara & Bare Carbon",
    body: "Exposed weave where it saves weight, Alcantara where your hands land. No carpet, no sound deadening, no compromise in grip.",
    icon: (
      <path d="M4 4l16 16M4 12l8 8M12 4l8 8M4 20l4-4M16 8l4-4" strokeLinecap="round" />
    ),
  },
];

export default function InteriorSection() {
  const imageRef = useRef<HTMLDivElement>(null);
  const progress = useElementScrollProgress(imageRef, ["start end", "end start"]);
  const y = useTransform(progress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="cockpit" className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <SectionHeading
          index="04"
          eyebrow="Cockpit & Interior"
          title={
            <>
              Driver-centric.
              <br />
              <span className="text-papaya">Nothing else.</span>
            </>
          }
          body="Every switch has a job. Every gram has been questioned. The cabin is engineered like an instrument — then trimmed like a tailored suit."
        />
      </div>

      {/* Cinematic cabin band */}
      <div ref={imageRef} className="relative mt-14 h-[60svh] min-h-[380px] overflow-hidden md:h-[78vh]">
        <motion.div style={{ y }} className="absolute -inset-y-[10%] inset-x-0">
          <Image
            loader={unsplashLoader}
            src={photos.cockpit.src}
            alt={photos.cockpit.alt}
            fill
            sizes="100vw"
            className="object-cover brightness-[0.7] saturate-[0.85]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-carbon via-transparent to-carbon" />
        <div className="absolute inset-0 bg-gradient-to-r from-carbon/70 via-transparent to-carbon/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_60%,rgb(255_128_0/0.14),transparent_55%)] mix-blend-screen" />

        <div className="absolute left-5 right-5 top-8 flex justify-between font-hud text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45 md:left-10 md:right-10">
          <span>
            <span className="text-papaya">●</span> Driver cell · Ambient mode
          </span>
          <a href={photos.cockpit.href} target="_blank" rel="noreferrer" className="hover:text-white">
            Photo · {photos.cockpit.credit}
          </a>
        </div>
      </div>

      {/* Feature cards overlap the band */}
      <div className="relative mx-auto -mt-16 max-w-7xl px-5 md:-mt-28 md:px-10">
        <ul className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.li
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -8% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: EASE_OUT_EXPO }}
              onPointerMove={trackPointer}
              className="glass-strong hover-light group rounded-2xl p-6 md:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-papaya/30 bg-papaya/10 text-papaya transition-shadow duration-500 group-hover:shadow-[0_0_24px_rgb(255_128_0/0.4)]">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden="true">
                    {f.icon}
                  </svg>
                </span>
                <span className="tabular font-hud text-xs font-semibold tracking-[0.3em] text-white/30">{f.code}</span>
              </div>
              <h3 className="mt-6 font-display text-lg font-bold uppercase tracking-[0.06em] text-white">{f.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/55">{f.body}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
