"use client";

import { motion, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, type PointerEvent, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

type ScrollOffset = NonNullable<NonNullable<Parameters<typeof useScroll>[0]>["offset"]>;

/**
 * Element-relative scroll progress (0 → 1) as a plain MotionValue.
 *
 * framer-motion hands scroll-linked opacity/transform to a native
 * ScrollTimeline, which tracks the whole page and ignores `target`/`offset`.
 * Mirroring the value strips that acceleration hint so styles follow the
 * element's real progress.
 */
export function useElementScrollProgress(target: RefObject<HTMLElement | null>, offset: ScrollOffset) {
  const { scrollYProgress } = useScroll({ target, offset });
  const progress = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => progress.set(v));
  useEffect(() => progress.set(scrollYProgress.get()), [progress, scrollYProgress]);
  return progress;
}

/** Writes pointer position into --mx/--my for the `hover-light` utility. No re-renders. */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Eyebrow({ index, children }: { index?: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-hud text-xs font-semibold uppercase tracking-[0.34em] text-papaya">
      {index && <span className="tabular text-white/40">{index}</span>}
      <span className="h-px w-10 bg-gradient-to-r from-papaya to-transparent" />
      <span>{children}</span>
    </div>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  body,
  align = "left",
  className,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  body?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto flex flex-col items-center text-center",
        className,
      )}
    >
      <Eyebrow index={index}>{eyebrow}</Eyebrow>
      <h2 className="mt-6 font-display text-3xl font-bold uppercase leading-[1.05] tracking-[0.08em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {body && (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">{body}</p>
      )}
    </Reveal>
  );
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT_EXPO }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Stylised speed-mark + wordmark (not the trademarked logo artwork). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 40 16" className="h-3.5 w-9 text-papaya" aria-hidden="true">
        <path
          d="M1 14C9 3 24-1 39 3c-9-1-19 2-26 11H1Z"
          fill="currentColor"
        />
      </svg>
      <span className="font-display text-[15px] font-bold tracking-[0.28em] text-white">
        MCLAREN
      </span>
    </span>
  );
}
