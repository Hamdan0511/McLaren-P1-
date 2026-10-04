import type { ImageLoaderProps } from "next/image";

/**
 * Unsplash's CDN is imgix-backed, so we let it resize/encode instead of
 * routing multi-megabyte originals through the Next.js optimizer.
 */
export function unsplashLoader({ src, width, quality }: ImageLoaderProps) {
  return `${src}?auto=format&fit=crop&w=${width}&q=${quality ?? 75}`;
}

export interface Photo {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
  /** Unsplash photo page, for attribution. */
  href: string;
  caption: string;
}

// Placeholder photography (Unsplash License). Swap for official McLaren media.
export const photos = {
  blackP1: {
    src: "https://images.unsplash.com/photo-1761554619924-627006522506",
    alt: "Black McLaren P1 parked indoors under warm light",
    width: 1920,
    height: 1080,
    credit: "Piiko",
    href: "https://unsplash.com/photos/0GUwCTsQNes",
    caption: "Carbon Black",
  },
  redP1: {
    src: "https://images.unsplash.com/photo-1748028265529-0be0aee7f674",
    alt: "Red McLaren P1 front three-quarter view in a white studio",
    width: 1920,
    height: 1280,
    credit: "Shooting Tyre",
    href: "https://unsplash.com/photos/GwdPcWX3Alg",
    caption: "Volcano Red",
  },
  silverP1: {
    src: "https://images.unsplash.com/photo-1771216596241-3beb51463cc4",
    alt: "Silver McLaren P1 on a motor show display stand",
    width: 1920,
    height: 1280,
    credit: "Adrian Kusznirewicz",
    href: "https://unsplash.com/photos/DDwP8Foi4QY",
    caption: "Supernova Silver",
  },
  gtrOrange: {
    src: "https://images.unsplash.com/photo-1516298252535-cf2ac5147f9b",
    alt: "Orange and black McLaren P1 GTR with fixed rear wing on Sunset Boulevard",
    width: 1280,
    height: 1920,
    credit: "Cory Rogers",
    href: "https://unsplash.com/photos/6l4CBNleEBE",
    caption: "P1 GTR · Sunset Blvd",
  },
  gtrSilver: {
    src: "https://images.unsplash.com/photo-1743038075019-fa48ccceef46",
    alt: "Silver McLaren P1 GTR parked on a driveway beneath oak trees",
    width: 1536,
    height: 1920,
    credit: "Salvo Media LLC",
    href: "https://unsplash.com/photos/ampyMtkuA9E",
    caption: "P1 GTR · Track Spec",
  },
  engineCover: {
    src: "https://images.unsplash.com/photo-1753658477747-08c5548cfa9b",
    alt: "Close-up of a carbon fibre McLaren engine cover and intake",
    width: 1280,
    height: 1920,
    credit: "Enzo Swan",
    href: "https://unsplash.com/photos/OL1vPJad9rg",
    caption: "Carbon Engine Cover",
  },
  carbonWeave: {
    src: "https://images.unsplash.com/photo-1758563920442-280b4e7afe7a",
    alt: "Macro detail of woven carbon fibre bodywork",
    width: 1280,
    height: 1920,
    credit: "Madeline Liu",
    href: "https://unsplash.com/photos/ItSc_S1t-m4",
    caption: "Pre-preg Carbon Weave",
  },
  cockpit: {
    src: "https://images.unsplash.com/photo-1715100872581-23e176df2d20",
    alt: "Dark McLaren cockpit with steering wheel and driver display",
    width: 1920,
    height: 1280,
    credit: "Luca Crestini",
    href: "https://unsplash.com/photos/QAUewDbvIa4",
    caption: "Driver Cell",
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

export const NAV_LINKS = [
  { id: "powertrain", label: "Powertrain" },
  { id: "aero", label: "Aero" },
  { id: "cockpit", label: "Cockpit" },
  { id: "evolution", label: "Evolution" },
  { id: "gallery", label: "Gallery" },
] as const;
