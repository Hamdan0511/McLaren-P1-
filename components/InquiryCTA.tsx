"use client";

import { useState, type FormEvent, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO, Eyebrow, Reveal } from "@/components/ui/primitives";

const REGIONS = ["North America", "Europe", "United Kingdom", "Middle East", "Asia Pacific", "Latin America", "Africa"];
const CONTACT_METHODS = ["Email", "Phone", "Private Viewing"] as const;

interface InquiryPayload {
  name: string;
  email: string;
  region: string;
  contactMethod: (typeof CONTACT_METHODS)[number];
}

type Errors = Partial<Record<keyof InquiryPayload, string>>;
type Status = "idle" | "submitting" | "sent" | "error";

/**
 * TODO: wire to a real endpoint (Route Handler, CRM webhook, etc).
 * Kept as a single seam so the UI doesn't need to change.
 */
async function submitInquiry(payload: InquiryPayload): Promise<void> {
  void payload;
}

function validate(p: InquiryPayload): Errors {
  const e: Errors = {};
  if (p.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) e.email = "Enter a valid email address.";
  if (!p.region) e.region = "Select your region.";
  return e;
}

export default function InquiryCTA() {
  const [contactMethod, setContactMethod] = useState<InquiryPayload["contactMethod"]>("Email");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload: InquiryPayload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      region: String(data.get("region") ?? ""),
      contactMethod,
    };
    const found = validate(payload);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("submitting");
    try {
      await submitInquiry(payload);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="inquire" className="relative overflow-hidden bg-carbon py-24 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[720px] w-[1100px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(255_128_0/0.16),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" />

      <div className="relative mx-auto max-w-6xl px-5 md:px-10">
        <Reveal>
          <div className="relative rounded-[28px] p-px">
            {/* Glowing border */}
            <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-papaya/70 via-papaya/10 to-papaya-deep/60" />
            <div className="absolute -inset-px rounded-[28px] opacity-60 blur-xl [background:linear-gradient(135deg,rgb(255_128_0/0.35),transparent_40%,transparent_60%,rgb(232_93_4/0.3))]" />

            <div className="glass-strong relative grid gap-12 rounded-[27px] p-6 sm:p-10 md:p-14 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <Eyebrow index="07">VIP Concierge</Eyebrow>
                <h2 className="mt-6 font-display text-3xl font-bold uppercase leading-[1.05] tracking-[0.06em] text-white sm:text-4xl lg:text-[2rem]">
                  Begin a <span className="text-papaya text-glow">private</span> conversation
                </h2>
                <p className="mt-6 leading-relaxed text-white/60">
                  Our Ultimate Series concierge handles provenance, inspection and delivery of
                  surviving P1 examples worldwide. Expect a reply within one business day.
                </p>
                <ul className="mt-8 space-y-3 font-hud text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                  {["Verified chassis history", "Global enclosed transport", "MSO personalisation advice"].map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 rotate-45 bg-papaya" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-3">
                <AnimatePresence mode="wait" initial={false}>
                  {status === "sent" ? (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                      role="status"
                      className="flex h-full flex-col items-start justify-center rounded-2xl border border-papaya/30 bg-papaya/[0.06] p-8"
                    >
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-papaya text-carbon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5" aria-hidden="true">
                          <path d="M5 12l5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <h3 className="mt-6 font-display text-2xl font-bold uppercase tracking-[0.06em] text-white">
                        Inquiry received
                      </h3>
                      <p className="mt-3 text-white/60">
                        A concierge will contact you by {contactMethod.toLowerCase()} shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      exit={{ opacity: 0, y: -12 }}
                      noValidate
                      onSubmit={onSubmit}
                      className="grid gap-5 sm:grid-cols-2"
                    >
                      <Field label="Full name" error={errors.name} htmlFor="inq-name">
                        <input
                          id="inq-name"
                          name="name"
                          autoComplete="name"
                          placeholder="Ayrton Senna"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "inq-name-err" : undefined}
                          className="field"
                        />
                      </Field>

                      <Field label="Email" error={errors.email} htmlFor="inq-email">
                        <input
                          id="inq-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@domain.com"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "inq-email-err" : undefined}
                          className="field"
                        />
                      </Field>

                      <Field label="Region" error={errors.region} htmlFor="inq-region" className="sm:col-span-2">
                        <div className="relative">
                          <select
                            id="inq-region"
                            name="region"
                            defaultValue=""
                            aria-invalid={!!errors.region}
                            aria-describedby={errors.region ? "inq-region-err" : undefined}
                            className="field appearance-none pr-10 [&>option]:bg-graphite"
                          >
                            <option value="" disabled>
                              Select region
                            </option>
                            {REGIONS.map((r) => (
                              <option key={r}>{r}</option>
                            ))}
                          </select>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-papaya" aria-hidden="true">
                            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </Field>

                      <fieldset className="sm:col-span-2">
                        <legend className="mb-2 font-hud text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                          Preferred contact
                        </legend>
                        <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-1.5">
                          {CONTACT_METHODS.map((m) => {
                            const selected = m === contactMethod;
                            return (
                              <label
                                key={m}
                                className={cn(
                                  "relative cursor-pointer rounded-lg px-2 py-3 text-center font-hud text-[11px] font-bold uppercase tracking-[0.18em] transition-colors sm:text-xs",
                                  "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-papaya",
                                  selected ? "text-carbon" : "text-white/60 hover:text-white",
                                )}
                              >
                                <input
                                  type="radio"
                                  name="contactMethod"
                                  value={m}
                                  checked={selected}
                                  onChange={() => setContactMethod(m)}
                                  className="sr-only"
                                />
                                {selected && (
                                  <motion.span
                                    layoutId="contact-pill"
                                    className="absolute inset-0 rounded-lg bg-papaya shadow-[0_0_20px_rgb(255_128_0/0.45)]"
                                    transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
                                  />
                                )}
                                <span className="relative">{m}</span>
                              </label>
                            );
                          })}
                        </div>
                      </fieldset>

                      <div className="mt-2 flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="max-w-xs text-xs leading-relaxed text-white/40">
                          By submitting you agree to be contacted about the McLaren P1. We never share your details.
                        </p>
                        <RippleButton type="submit" disabled={status === "submitting"}>
                          {status === "submitting" ? "Transmitting…" : "Submit inquiry"}
                        </RippleButton>
                      </div>
                      {status === "error" && (
                        <p role="alert" className="text-sm text-red-400 sm:col-span-2">
                          Something went wrong. Please try again.
                        </p>
                      )}
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  htmlFor,
  className,
  children,
}: {
  label: string;
  error?: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block font-hud text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-err`} className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

function RippleButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const spawn = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2.2;
    setRipples((prev) => [...prev, { id: e.timeStamp, x: e.clientX - r.left, y: e.clientY - r.top, size }]);
  };

  return (
    <button
      {...props}
      onPointerDown={spawn}
      className={cn(
        "group relative inline-flex shrink-0 items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full bg-papaya px-8 py-4 font-hud text-sm font-bold uppercase tracking-[0.28em] text-carbon",
        "shadow-[0_0_0_1px_rgb(255_128_0/0.6),0_10px_40px_-8px_rgb(255_128_0/0.7)] transition-[transform,box-shadow,background-color] duration-300",
        "hover:-translate-y-0.5 hover:bg-papaya-soft hover:shadow-[0_0_0_1px_rgb(255_176_102/0.8),0_16px_50px_-8px_rgb(255_128_0/0.85)]",
        "disabled:pointer-events-none disabled:opacity-70",
        className,
      )}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          onAnimationEnd={() => setRipples((prev) => prev.filter((p) => p.id !== r.id))}
          className="pointer-events-none absolute animate-ripple rounded-full bg-white/60"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
      <span className="relative">{children}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
