"use client";

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { NAV_LINKS } from "@/lib/media";
import { cn } from "@/lib/utils";
import { useScrollToSection } from "@/components/SmoothScroll";
import { EASE_OUT_EXPO, Wordmark } from "@/components/ui/primitives";

export default function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollTo = useScrollToSection();

  // Only re-renders when the boolean actually flips.
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 40;
    if (next !== scrolled) setScrolled(next);
  });

  const go = (id: string) => {
    setOpen(false);
    scrollTo(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex h-16 items-center justify-between px-5 transition-[background-color,border-color,backdrop-filter] duration-500 md:h-[72px] md:px-10",
          "border-b",
          scrolled || open
            ? "border-hairline bg-carbon/70 backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go("top");
          }}
          aria-label="McLaren P1 — back to top"
        >
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l, i) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.id);
                }}
                className="group relative flex items-center gap-2 px-4 py-2 font-hud text-[13px] font-semibold uppercase tracking-[0.24em] text-white/65 transition-colors hover:text-white"
              >
                <span className="tabular text-[10px] text-papaya/70">0{i + 2}</span>
                {l.label}
                <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-papaya transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#inquire"
            onClick={(e) => {
              e.preventDefault();
              go("inquire");
            }}
            className="animate-glow-pulse rounded-full bg-papaya/10 px-5 py-2.5 font-hud text-xs font-bold uppercase tracking-[0.3em] text-papaya transition-colors hover:bg-papaya hover:text-carbon md:px-6"
          >
            Inquire
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 lg:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-full bg-white transition-transform duration-300",
                  open && "translate-y-1.5 rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-full bg-white transition-transform duration-300",
                  open && "-translate-y-1.5 -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="glass-strong mx-3 mt-2 rounded-2xl p-3 lg:hidden"
          >
            <ul>
              {NAV_LINKS.map((l, i) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.id);
                    }}
                    className="flex items-center justify-between rounded-xl px-4 py-4 font-hud text-sm font-semibold uppercase tracking-[0.26em] text-white/80 hover:bg-white/5"
                  >
                    {l.label}
                    <span className="tabular text-xs text-papaya/70">0{i + 2}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
