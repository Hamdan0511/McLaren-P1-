"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Global inertia scrolling. Lenis drives native window scroll, so
 * framer-motion's useScroll keeps reading real scroll positions.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  // Keep the provider mounted either way so the page tree never remounts;
  // reduced-motion users simply get native (unsmoothed) wheel scrolling.
  const reduceMotion = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{ lerp: 0.09, wheelMultiplier: 0.9, smoothWheel: !reduceMotion, autoRaf: true }}
    >
      {children}
    </ReactLenis>
  );
}

/** Smooth-scrolls to a section id; falls back to native scrolling without Lenis. */
export function useScrollToSection() {
  const lenis = useLenis();
  return (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -72, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };
}
