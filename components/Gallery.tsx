"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { photos, unsplashLoader, type Photo } from "@/lib/media";
import { EASE_OUT_EXPO, SectionHeading } from "@/components/ui/primitives";

const ITEMS: Photo[] = [
  photos.redP1,
  photos.gtrOrange,
  photos.blackP1,
  photos.carbonWeave,
  photos.silverP1,
  photos.engineCover,
  photos.gtrSilver,
  photos.cockpit,
];

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const close = useCallback(() => {
    if (index == null) return;
    const returnTo = index;
    setIndex(null);
    // Restore focus to the thumbnail that opened the lightbox.
    requestAnimationFrame(() => triggerRefs.current[returnTo]?.focus());
  }, [index]);

  return (
    <section id="gallery" className="relative py-24 md:py-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[50%] ambient-top" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            index="06"
            eyebrow="Media Gallery"
            title={
              <>
                Pure <span className="text-papaya">presence</span>
              </>
            }
          />
          <p className="font-hud text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
            {ITEMS.length} frames · Select to expand
          </p>
        </div>

        <ul className="mt-14 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4">
          {ITEMS.map((p, i) => (
            <motion.li
              key={p.src}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -6% 0px" }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.08, ease: EASE_OUT_EXPO }}
              className="break-inside-avoid"
            >
              <button
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Open image: ${p.caption}`}
                className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-graphite text-left transition-colors duration-500 hover:border-papaya/40"
              >
                <Image
                  loader={unsplashLoader}
                  src={p.src}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                  className="h-auto w-full scale-100 object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/90 via-carbon/0 to-carbon/0 opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgb(255_128_0/0.3),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                  <span>
                    <span className="block font-hud text-[10px] font-semibold uppercase tracking-[0.3em] text-papaya">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-display text-sm font-bold uppercase tracking-[0.08em] text-white">
                      {p.caption}
                    </span>
                  </span>
                  <span className="grid h-9 w-9 shrink-0 translate-y-2 place-items-center rounded-full border border-papaya/40 bg-carbon/60 text-papaya opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden="true">
                      <path d="M4 10V4h6M20 14v6h-6M4 4l6 6M20 20l-6-6" strokeLinecap="round" />
                    </svg>
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </div>

      <Lightbox items={ITEMS} index={index} onIndex={setIndex} onClose={close} />
    </section>
  );
}

function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items: Photo[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index != null;
  // false during SSR/hydration, true on the client — avoids touching `document` on the server.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const step = useCallback(
    (dir: number) => {
      if (index == null) return;
      onIndex((index + dir + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  // Latest handlers for the keydown listener without re-running the open effect.
  const handlersRef = useRef({ onClose, step });
  useEffect(() => {
    handlersRef.current = { onClose, step };
  });

  // Pause page scroll + wire keyboard while open.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") handlersRef.current.onClose();
      else if (e.key === "ArrowRight") handlersRef.current.step(1);
      else if (e.key === "ArrowLeft") handlersRef.current.step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
      lenis?.start();
    };
  }, [open, lenis]);

  const current = index ?? 0;
  const photo = index != null ? items[index] : null;

  // Portal to <body> so the fixed overlay escapes the content wrapper's stacking context.
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${photo.caption} — image ${current + 1} of ${items.length}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="fixed inset-0 z-[90] flex flex-col bg-carbon/95 backdrop-blur-xl"
          onClick={onClose}
          data-lenis-prevent
        >
          <div className="flex items-center justify-between px-5 py-4 md:px-10" onClick={(e) => e.stopPropagation()}>
            <div className="font-hud text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              <span className="tabular text-papaya">{String(current + 1).padStart(2, "0")}</span> / {String(items.length).padStart(2, "0")}
              <span className="ml-4 text-white">{photo.caption}</span>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-papaya hover:text-papaya"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="relative min-h-0 flex-1 px-4 md:px-24">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={photo.src}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                className="relative h-full w-full"
              >
                <Image
                  loader={unsplashLoader}
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            </AnimatePresence>

            {[-1, 1].map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  step(dir);
                }}
                aria-label={dir < 0 ? "Previous image" : "Next image"}
                className={`glass absolute top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full text-white transition-colors hover:text-papaya ${
                  dir < 0 ? "left-3 md:left-8" : "right-3 md:right-8"
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5" aria-hidden="true">
                  <path d={dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>

          <div className="px-5 py-4 text-center font-hud text-[10px] uppercase tracking-[0.28em] text-white/40 md:px-10" onClick={(e) => e.stopPropagation()}>
            Photo ·{" "}
            <a href={photo.href} target="_blank" rel="noreferrer" className="text-white/70 hover:text-papaya">
              {photo.credit} / Unsplash
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

const noopSubscribe = () => () => {};
