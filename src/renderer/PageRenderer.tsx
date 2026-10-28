// Pure preview renderer: PageDocument JSON -> storefront markup.
// Knows nothing about editor state; selection is an optional overlay hook.
import { useState, type CSSProperties, type ReactNode } from "react";
import * as Icons from "lucide-react";
import { Star, ChevronDown, ShieldCheck, Truck } from "lucide-react";
import type { PageDocument, Section, SectionSettingsMap, SectionStyle } from "@/editor/types";

interface Props {
  doc: PageDocument;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function PageRenderer({ doc, selectedId, onSelect }: Props) {
  const t = doc.theme;
  const vars = {
    "--pg-primary": t.primary,
    "--pg-bg": t.background,
    "--pg-surface": t.surface,
    "--pg-text": t.text,
    "--pg-radius": `${t.radius}px`,
    "--pg-heading": `"${t.headingFont}", serif`,
    "--pg-body": `"${t.bodyFont}", sans-serif`,
  } as CSSProperties;

  return (
    <div className="pg-root @container" style={vars}>
      {doc.sections.filter((s) => !s.hidden).map((s) => (
        <SectionFrame key={s.id} section={s} selected={selectedId === s.id} onSelect={onSelect}>
          <SectionBody section={s} />
        </SectionFrame>
      ))}
    </div>
  );
}

function toneStyle(style: SectionStyle): CSSProperties {
  const base: CSSProperties = { paddingTop: style.paddingY, paddingBottom: style.paddingY, textAlign: style.align };
  if (style.tone === "surface") return { ...base, background: "var(--pg-surface)" };
  if (style.tone === "primary") return { ...base, background: "var(--pg-primary)", color: "var(--pg-bg)" };
  return base;
}

function SectionFrame({ section, selected, onSelect, children }: { section: Section; selected: boolean; onSelect?: ((id: string) => void) | undefined; children: ReactNode }) {
  return (
    <section
      data-section-id={section.id}
      className="pg-section"
      data-selected={selected || undefined}
      data-interactive={onSelect ? true : undefined}
      style={toneStyle(section.style)}
      onClick={onSelect ? (e) => { e.stopPropagation(); onSelect(section.id); } : undefined}
    >
      {onSelect && <span className="pg-section-tag">{section.name}</span>}
      {children}
    </section>
  );
}

function SectionBody({ section }: { section: Section }) {
  switch (section.type) {
    case "announcement": return <p className="text-xs font-semibold tracking-[0.18em] uppercase">{section.settings.text}</p>;
    case "hero": return <Hero s={section.settings} />;
    case "features": return <Features s={section.settings} center={section.style.align === "center"} />;
    case "imageText": return <ImageText s={section.settings} />;
    case "reviews": return <Reviews s={section.settings} />;
    case "faq": return <Faq s={section.settings} />;
    case "cta": return <Cta s={section.settings} />;
  }
}

const Wrap = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-6xl px-5 @3xl:px-10 ${className}`}>{children}</div>
);

function Stars({ n, size = 14 }: { n: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" style={{ color: "var(--pg-primary)" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} fill={i < Math.round(n) ? "currentColor" : "none"} />
      ))}
    </span>
  );
}

function Hero({ s }: { s: SectionSettingsMap["hero"] }) {
  const [active, setActive] = useState(0);
  const [variant, setVariant] = useState(0);
  const img = s.images[Math.min(active, s.images.length - 1)];
  return (
    <Wrap className="grid gap-8 text-left @3xl:grid-cols-2 @3xl:gap-14">
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden" style={{ borderRadius: "var(--pg-radius)", background: "var(--pg-surface)" }}>
          {img && <img src={img} alt={s.title} className="h-full w-full object-cover" />}
          {s.badge && <span className="pg-pill absolute left-4 top-4">{s.badge}</span>}
        </div>
        <div className="flex gap-3">
          {s.images.map((src, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setActive(i); }}
              className="h-16 w-16 overflow-hidden border-2 transition"
              style={{ borderRadius: "calc(var(--pg-radius) * .6)", borderColor: i === active ? "var(--pg-primary)" : "transparent" }}>
              <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-5">
        <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "var(--pg-primary)" }}>{s.eyebrow}</p>
        <h1 className="pg-heading text-5xl leading-[0.95] @3xl:text-6xl">{s.title}</h1>
        <div className="flex items-center gap-2 text-sm opacity-80"><Stars n={4.8} /> 4.8 · 2,143 reviews</div>
        <p className="text-[15px] leading-relaxed opacity-80">{s.description}</p>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold">{s.price}</span>
          {s.compareAt && <span className="text-base line-through opacity-50">{s.compareAt}</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {s.variants.map((v, i) => (
            <button key={v} onClick={(e) => { e.stopPropagation(); setVariant(i); }}
              className="border px-4 py-2 text-sm transition"
              style={{ borderRadius: "999px", borderColor: i === variant ? "var(--pg-text)" : "color-mix(in oklab, var(--pg-text) 18%, transparent)", fontWeight: i === variant ? 600 : 400 }}>
              {v}
            </button>
          ))}
        </div>
        <button className="pg-btn w-full">{s.ctaLabel} — {s.price}</button>
        <div className="grid grid-cols-2 gap-3 text-xs opacity-75">
          <span className="flex items-center gap-2"><Truck size={15} /> Ships in 24h</span>
          <span className="flex items-center gap-2"><ShieldCheck size={15} /> 30-day guarantee</span>
        </div>
      </div>
    </Wrap>
  );
}

function Features({ s, center }: { s: SectionSettingsMap["features"]; center: boolean }) {
  const cols = { 2: "@2xl:grid-cols-2", 3: "@2xl:grid-cols-3", 4: "@2xl:grid-cols-2 @4xl:grid-cols-4" }[s.columns];
  return (
    <Wrap>
      <h2 className="pg-heading mb-10 text-4xl">{s.title}</h2>
      <div className={`grid gap-6 ${cols}`}>
        {s.items.map((it) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[it.icon] ?? Icons.Sparkles;
          return (
            <div key={it.id} className={`flex flex-col gap-3 p-6 ${center ? "items-center" : ""}`} style={{ background: "var(--pg-bg)", borderRadius: "var(--pg-radius)" }}>
              <span className="grid h-11 w-11 place-items-center rounded-full" style={{ background: "color-mix(in oklab, var(--pg-primary) 12%, transparent)", color: "var(--pg-primary)" }}><Icon size={20} /></span>
              <h3 className="text-lg font-semibold">{it.title}</h3>
              <p className="text-sm leading-relaxed opacity-75">{it.text}</p>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
}

function ImageText({ s }: { s: SectionSettingsMap["imageText"] }) {
  return (
    <Wrap className="grid items-center gap-8 @3xl:grid-cols-2 @3xl:gap-14">
      <div className={`aspect-[4/3] overflow-hidden ${s.imageSide === "right" ? "@3xl:order-2" : ""}`} style={{ borderRadius: "var(--pg-radius)" }}>
        {s.image && <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />}
      </div>
      <div className="space-y-4">
        <h2 className="pg-heading text-4xl @3xl:text-5xl">{s.title}</h2>
        <p className="text-[15px] leading-relaxed opacity-80">{s.body}</p>
      </div>
    </Wrap>
  );
}

function Reviews({ s }: { s: SectionSettingsMap["reviews"] }) {
  return (
    <Wrap>
      <h2 className="pg-heading text-4xl">{s.title}</h2>
      <div className="mt-3 mb-10 flex items-center justify-[inherit] gap-2 text-sm opacity-80" style={{ justifyContent: "inherit" }}>
        <Stars n={s.rating} /> {s.rating} out of 5 · {s.count.toLocaleString()} reviews
      </div>
      <div className="grid gap-5 text-left @2xl:grid-cols-3">
        {s.items.map((r) => (
          <figure key={r.id} className="flex flex-col gap-3 border p-6" style={{ borderRadius: "var(--pg-radius)", borderColor: "color-mix(in oklab, var(--pg-text) 10%, transparent)" }}>
            <Stars n={r.rating} />
            <blockquote className="text-[15px] leading-relaxed">“{r.text}”</blockquote>
            <figcaption className="mt-auto text-xs font-semibold tracking-wide uppercase opacity-60">{r.author} · Verified buyer</figcaption>
          </figure>
        ))}
      </div>
    </Wrap>
  );
}

function Faq({ s }: { s: SectionSettingsMap["faq"] }) {
  const [open, setOpen] = useState<string | null>(s.items[0]?.id ?? null);
  return (
    <Wrap className="max-w-3xl">
      <h2 className="pg-heading mb-8 text-4xl">{s.title}</h2>
      <div className="text-left">
        {s.items.map((f) => (
          <div key={f.id} className="border-b py-4" style={{ borderColor: "color-mix(in oklab, var(--pg-text) 12%, transparent)" }}>
            <button className="flex w-full items-center justify-between gap-4 text-left font-medium" onClick={(e) => { e.stopPropagation(); setOpen(open === f.id ? null : f.id); }}>
              {f.q}
              <ChevronDown size={18} className={`shrink-0 transition ${open === f.id ? "rotate-180" : ""}`} />
            </button>
            {open === f.id && <p className="mt-3 text-sm leading-relaxed opacity-75">{f.a}</p>}
          </div>
        ))}
      </div>
    </Wrap>
  );
}

function Cta({ s }: { s: SectionSettingsMap["cta"] }) {
  return (
    <Wrap className="flex flex-col items-center gap-4 py-6">
      <h2 className="pg-heading text-5xl">{s.title}</h2>
      <p className="opacity-85">{s.subtitle}</p>
      <button className="pg-btn pg-btn-inverse mt-2">{s.ctaLabel}</button>
    </Wrap>
  );
}
