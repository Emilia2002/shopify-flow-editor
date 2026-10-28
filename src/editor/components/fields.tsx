// Small reusable inspector controls.
import { useRef, type ReactNode } from "react";
import { ImagePlus, X } from "lucide-react";
import { DEMO_IMAGES } from "../demo/demoDocument";

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15";

export function TextInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />;
}

export function TextArea({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea className={`${inputCls} resize-none leading-relaxed`} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />;
}

export function NumberSlider({ value, min, max, step = 1, onChange, unit = "" }: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void; unit?: string }) {
  return (
    <div className="flex items-center gap-3">
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-primary" />
      <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">{value}{unit}</span>
    </div>
  );
}

export function Segmented<T extends string | number>({ value, options, onChange }: { value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg bg-muted p-1">
      {options.map((o) => (
        <button key={String(o.value)} type="button" onClick={() => onChange(o.value)}
          className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition ${value === o.value ? "bg-card text-foreground shadow-panel" : "text-muted-foreground hover:text-foreground"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-input bg-card p-1.5 pr-3">
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-7 w-7 cursor-pointer rounded-md border-0 bg-transparent p-0" />
      <input className="flex-1 bg-transparent font-mono text-xs uppercase outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** Image picker: demo library + local upload (kept in-memory as a data URL; not uploaded anywhere). */
export function ImagePicker({ value, onChange, onRemove }: { value: string; onChange: (v: string) => void; onRemove?: (() => void) | undefined }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <div className="group relative aspect-video overflow-hidden rounded-lg border bg-muted">
        {value && <img src={value} alt="" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/40 opacity-0 transition group-hover:opacity-100">
          <button type="button" onClick={() => ref.current?.click()} className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 text-xs font-medium">
            <ImagePlus size={14} /> Replace
          </button>
          {onRemove && (
            <button type="button" onClick={onRemove} className="grid h-7 w-7 place-items-center rounded-full bg-card"><X size={14} /></button>
          )}
        </div>
      </div>
      <div className="flex gap-1.5">
        {DEMO_IMAGES.map((src) => (
          <button key={src} type="button" onClick={() => onChange(src)}
            className={`h-9 w-9 overflow-hidden rounded-md border-2 ${src === value ? "border-primary" : "border-transparent"}`}>
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => onChange(String(r.result));
        r.readAsDataURL(f);
        e.target.value = "";
      }} />
    </div>
  );
}

export function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4 border-b px-5 py-5 last:border-0">
      <h4 className="text-xs font-bold tracking-[0.12em] text-foreground uppercase">{title}</h4>
      {children}
    </div>
  );
}
