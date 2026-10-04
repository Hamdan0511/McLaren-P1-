"use client";

import { AnimatePresence, motion, useSpring, useTransform, type MotionValue } from "framer-motion";
import { EASE_OUT_EXPO, Wordmark } from "@/components/ui/primitives";

const STATUS = [
  [0, "Initialising telemetry"],
  [0.25, "Priming hybrid system"],
  [0.5, "Calibrating active aero"],
  [0.75, "Arming IPAS"],
  [0.98, "Ready"],
] as const;

export default function Preloader({
  progress,
  visible,
}: {
  progress: MotionValue<number>;
  visible: boolean;
}) {
  const smooth = useSpring(progress, { stiffness: 120, damping: 24, mass: 0.4 });
  const percent = useTransform(smooth, (v) => `${Math.round(v * 100)}`.padStart(3, "0"));
  const status = useTransform(smooth, (v) => {
    let label: string = STATUS[0][1];
    for (const [at, text] of STATUS) if (v >= at) label = text;
    return label;
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-label="Loading McLaren P1 experience"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-carbon"
        >
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 ambient-top" />

          <motion.div
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="relative flex w-[min(86vw,440px)] flex-col items-center"
          >
            <Wordmark className="mb-10" />

            <div className="font-display text-[clamp(4.5rem,18vw,8rem)] font-black leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgb(255_128_0/0.55)]">
              P1
            </div>

            <div className="mt-10 w-full">
              <div className="flex items-end justify-between font-hud text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                <motion.span>{status}</motion.span>
                <span className="tabular text-white">
                  <motion.span className="text-2xl font-bold text-papaya">{percent}</motion.span>
                  <span className="ml-1">%</span>
                </span>
              </div>
              <div className="relative mt-3 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  style={{ scaleX: smooth }}
                  className="absolute inset-0 origin-left bg-gradient-to-r from-papaya-deep via-papaya to-papaya-soft shadow-[0_0_14px_rgb(255_128_0/0.8)]"
                />
              </div>
              <div className="mt-3 flex justify-between font-hud text-[10px] uppercase tracking-[0.3em] text-white/30">
                <span>Seq · 240 frames</span>
                <span>MonoCage / v1.0</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
