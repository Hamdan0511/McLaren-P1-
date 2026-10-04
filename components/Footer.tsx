import { NAV_LINKS } from "@/lib/media";
import { Wordmark } from "@/components/ui/primitives";

export default function Footer() {
  return (
    <footer className="relative border-t border-hairline bg-carbon">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 md:flex-row md:items-end md:justify-between md:px-10">
        <div>
          <Wordmark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/40">
            The definitive hypercar. 903 HP hybrid, 375 built. Specifications quoted from
            launch-era press material.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 font-hud text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="transition-colors hover:text-papaya">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#inquire" className="text-papaya transition-colors hover:text-white">
                Inquire
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 font-hud text-[10px] uppercase tracking-[0.3em] text-white/30 sm:flex-row sm:justify-between md:px-10">
          <span>McLaren P1 · Ultimate Series</span>
          <span>Photography via Unsplash · Sequence renders © their owners</span>
        </div>
      </div>
    </footer>
  );
}
