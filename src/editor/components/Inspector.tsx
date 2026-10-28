import { Plus, Trash2, AlignLeft, AlignCenter } from "lucide-react";
import type { Section, SectionStyle, ThemeSettings } from "../types";
import { uid } from "../demo/demoDocument";
import { ColorInput, Field, Group, ImagePicker, NumberSlider, Segmented, TextArea, TextInput } from "./fields";
import { SECTION_ICONS } from "./SectionNavigator";

export const FONT_OPTIONS = ["Cormorant Garamond", "Playfair Display", "Fraunces", "Manrope", "DM Sans", "Space Grotesk"];

type Update = (patch: (s: Section) => Section, key?: string) => void;

export function Inspector({ section, theme, onUpdate, onTheme }: {
  section: Section | null;
  theme: ThemeSettings;
  onUpdate: Update;
  onTheme: (p: Partial<ThemeSettings>, key?: string) => void;
}) {
  return (
    <aside className="flex w-80 shrink-0 flex-col border-l bg-panel">
      {section ? <SectionInspector key={section.id} s={section} onUpdate={onUpdate} /> : <ThemeInspector theme={theme} onTheme={onTheme} />}
    </aside>
  );
}

function Header({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b px-5 py-4">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-primary-foreground">{icon}</span>
      <div><h3 className="font-display text-lg leading-tight">{title}</h3><p className="text-xs text-muted-foreground">{subtitle}</p></div>
    </div>
  );
}

function ThemeInspector({ theme, onTheme }: { theme: ThemeSettings; onTheme: (p: Partial<ThemeSettings>, key?: string) => void }) {
  const color = (k: keyof ThemeSettings, label: string) => (
    <Field label={label}><ColorInput value={String(theme[k])} onChange={(v) => onTheme({ [k]: v }, `theme.${k}`)} /></Field>
  );
  const font = (k: "headingFont" | "bodyFont", label: string) => (
    <Field label={label}>
      <select className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm" value={theme[k]} onChange={(e) => onTheme({ [k]: e.target.value })} style={{ fontFamily: theme[k] }}>
        {FONT_OPTIONS.map((f) => <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>)}
      </select>
    </Field>
  );
  return (
    <>
      <Header title="Theme" subtitle="Applies to the whole page" icon={<span className="font-display text-base">Aa</span>} />
      <div className="flex-1 overflow-y-auto">
        <Group title="Colors">
          <div className="grid grid-cols-2 gap-3">{color("primary", "Brand")}{color("text", "Text")}{color("background", "Background")}{color("surface", "Surface")}</div>
        </Group>
        <Group title="Typography">
          {font("headingFont", "Headings")}
          {font("bodyFont", "Body")}
        </Group>
        <Group title="Shape">
          <Field label="Corner radius"><NumberSlider value={theme.radius} min={0} max={32} unit="px" onChange={(v) => onTheme({ radius: v }, "theme.radius")} /></Field>
        </Group>
      </div>
    </>
  );
}

function SectionInspector({ s, onUpdate }: { s: Section; onUpdate: Update }) {
  const Icon = SECTION_ICONS[s.type];
  // Typed helper to patch settings of the current section.
  const set = <T extends Section>(fn: (st: T["settings"]) => T["settings"], key?: string) =>
    onUpdate((x) => ({ ...x, settings: fn(x.settings as T["settings"]) }) as Section, key);
  const setStyle = (p: Partial<SectionStyle>, key?: string) => onUpdate((x) => ({ ...x, style: { ...x.style, ...p } }), key);
  const txt = (field: string, label: string, area = false, rows?: number) => {
    const st = s.settings as unknown as Record<string, string>;
    const on = (v: string) => set((o) => ({ ...o, [field]: v }), `${s.id}.${field}`);
    return <Field label={label}>{area ? <TextArea value={st[field] ?? ""} onChange={on} rows={rows} /> : <TextInput value={st[field] ?? ""} onChange={on} />}</Field>;
  };

  return (
    <>
      <Header title={s.name} subtitle="Section settings" icon={<Icon size={16} />} />
      <div className="flex-1 overflow-y-auto">
        <Group title="Content">
          <Field label="Section name"><TextInput value={s.name} onChange={(v) => onUpdate((x) => ({ ...x, name: v }), `${s.id}.name`)} /></Field>
          {s.type === "announcement" && txt("text", "Message")}
          {s.type === "hero" && (
            <>
              {txt("eyebrow", "Eyebrow")}{txt("title", "Headline")}{txt("description", "Description", true, 5)}
              <div className="grid grid-cols-2 gap-3">{txt("price", "Price")}{txt("compareAt", "Compare at")}</div>
              {txt("ctaLabel", "Button label")}{txt("badge", "Badge")}
              <Field label="Variants" hint="Comma separated">
                <TextInput value={s.settings.variants.join(", ")} onChange={(v) => set<typeof s>((o) => ({ ...o, variants: v.split(",").map((x) => x.trim()).filter(Boolean) }), `${s.id}.variants`)} />
              </Field>
            </>
          )}
          {s.type === "imageText" && <>{txt("title", "Headline")}{txt("body", "Body", true, 5)}</>}
          {s.type === "features" && txt("title", "Headline")}
          {s.type === "reviews" && txt("title", "Headline")}
          {s.type === "faq" && txt("title", "Headline")}
          {s.type === "cta" && <>{txt("title", "Headline")}{txt("subtitle", "Subtitle")}{txt("ctaLabel", "Button label")}</>}
        </Group>

        {s.type === "hero" && (
          <Group title="Gallery">
            {s.settings.images.map((img, i) => (
              <ImagePicker key={i} value={img}
                onChange={(v) => set<typeof s>((o) => ({ ...o, images: o.images.map((x, j) => (j === i ? v : x)) }))}
                onRemove={s.settings.images.length > 1 ? () => set<typeof s>((o) => ({ ...o, images: o.images.filter((_, j) => j !== i) })) : undefined} />
            ))}
            <AddBtn onClick={() => set<typeof s>((o) => ({ ...o, images: [...o.images, o.images[0]] }))}>Add image</AddBtn>
          </Group>
        )}
        {s.type === "imageText" && (
          <Group title="Image">
            <ImagePicker value={s.settings.image} onChange={(v) => set<typeof s>((o) => ({ ...o, image: v }))} />
            <Field label="Image position"><Segmented value={s.settings.imageSide} options={[{ value: "left", label: "Left" }, { value: "right", label: "Right" }]} onChange={(v) => set<typeof s>((o) => ({ ...o, imageSide: v }))} /></Field>
          </Group>
        )}
        {s.type === "features" && (
          <Group title="Items">
            <Field label="Columns"><Segmented value={s.settings.columns} options={[2, 3, 4].map((n) => ({ value: n as 2 | 3 | 4, label: n }))} onChange={(v) => set<typeof s>((o) => ({ ...o, columns: v }))} /></Field>
            {s.settings.items.map((it, i) => (
              <ItemCard key={it.id} onRemove={() => set<typeof s>((o) => ({ ...o, items: o.items.filter((x) => x.id !== it.id) }))}>
                <TextInput value={it.title} onChange={(v) => set<typeof s>((o) => ({ ...o, items: o.items.map((x, j) => (j === i ? { ...x, title: v } : x)) }), `${it.id}.t`)} />
                <TextArea rows={2} value={it.text} onChange={(v) => set<typeof s>((o) => ({ ...o, items: o.items.map((x, j) => (j === i ? { ...x, text: v } : x)) }), `${it.id}.x`)} />
              </ItemCard>
            ))}
            <AddBtn onClick={() => set<typeof s>((o) => ({ ...o, items: [...o.items, { id: uid(), icon: "Sparkles", title: "New benefit", text: "Describe it here." }] }))}>Add item</AddBtn>
          </Group>
        )}
        {s.type === "reviews" && (
          <Group title="Reviews">
            {s.settings.items.map((it, i) => (
              <ItemCard key={it.id} onRemove={() => set<typeof s>((o) => ({ ...o, items: o.items.filter((x) => x.id !== it.id) }))}>
                <TextInput value={it.author} onChange={(v) => set<typeof s>((o) => ({ ...o, items: o.items.map((x, j) => (j === i ? { ...x, author: v } : x)) }), `${it.id}.a`)} />
                <TextArea rows={3} value={it.text} onChange={(v) => set<typeof s>((o) => ({ ...o, items: o.items.map((x, j) => (j === i ? { ...x, text: v } : x)) }), `${it.id}.x`)} />
              </ItemCard>
            ))}
            <AddBtn onClick={() => set<typeof s>((o) => ({ ...o, items: [...o.items, { id: uid(), author: "New customer", rating: 5, text: "Write the review here." }] }))}>Add review</AddBtn>
          </Group>
        )}
        {s.type === "faq" && (
          <Group title="Questions">
            {s.settings.items.map((it, i) => (
              <ItemCard key={it.id} onRemove={() => set<typeof s>((o) => ({ ...o, items: o.items.filter((x) => x.id !== it.id) }))}>
                <TextInput value={it.q} onChange={(v) => set<typeof s>((o) => ({ ...o, items: o.items.map((x, j) => (j === i ? { ...x, q: v } : x)) }), `${it.id}.q`)} />
                <TextArea rows={3} value={it.a} onChange={(v) => set<typeof s>((o) => ({ ...o, items: o.items.map((x, j) => (j === i ? { ...x, a: v } : x)) }), `${it.id}.a`)} />
              </ItemCard>
            ))}
            <AddBtn onClick={() => set<typeof s>((o) => ({ ...o, items: [...o.items, { id: uid(), q: "New question?", a: "Answer goes here." }] }))}>Add question</AddBtn>
          </Group>
        )}

        <Group title="Layout">
          <Field label="Background">
            <Segmented value={s.style.tone} options={[{ value: "default", label: "Default" }, { value: "surface", label: "Surface" }, { value: "primary", label: "Brand" }]} onChange={(v) => setStyle({ tone: v })} />
          </Field>
          <Field label="Alignment">
            <Segmented value={s.style.align} options={[{ value: "left", label: <AlignLeft size={14} className="mx-auto" /> }, { value: "center", label: <AlignCenter size={14} className="mx-auto" /> }]} onChange={(v) => setStyle({ align: v })} />
          </Field>
          <Field label="Vertical spacing"><NumberSlider value={s.style.paddingY} min={0} max={140} step={4} unit="px" onChange={(v) => setStyle({ paddingY: v }, `${s.id}.pad`)} /></Field>
        </Group>
      </div>
    </>
  );
}

function ItemCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="group relative space-y-2 rounded-xl border bg-muted/40 p-3">
      {children}
      <button onClick={onRemove} aria-label="Remove" className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full border bg-card text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:text-destructive"><Trash2 size={11} /></button>
    </div>
  );
}

function AddBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-xs font-medium text-muted-foreground transition hover:border-primary hover:text-primary">
      <Plus size={13} /> {children}
    </button>
  );
}
