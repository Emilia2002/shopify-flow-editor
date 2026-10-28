import { Undo2, Redo2, Monitor, Smartphone, Sparkles, Check, Loader2, Circle, Upload, RotateCcw } from "lucide-react";

export type SaveState = { kind: "saved"; at: Date | null } | { kind: "dirty" } | { kind: "saving" } | { kind: "error" };
export type Device = "desktop" | "mobile";

interface Props {
  productTitle: string;
  canUndo: boolean; canRedo: boolean;
  onUndo: () => void; onRedo: () => void;
  device: Device; onDevice: (d: Device) => void;
  save: SaveState; onSave: () => void; onReset: () => void;
  onGenerate: () => void; onExport: () => void;
}

export function Toolbar(p: Props) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-panel px-4">
      <div className="flex w-64 items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-lg text-primary-foreground shadow-glow">☿</span>
        <div className="leading-tight">
          <p className="font-display text-[15px]">Mercury <span className="text-brand">Pages</span></p>
          <p className="max-w-44 truncate text-xs text-muted-foreground">{p.productTitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ToolBtn label="Undo (⌘Z)" disabled={!p.canUndo} onClick={p.onUndo}><Undo2 size={16} /></ToolBtn>
        <ToolBtn label="Redo (⇧⌘Z)" disabled={!p.canRedo} onClick={p.onRedo}><Redo2 size={16} /></ToolBtn>
        <ToolBtn label="Reset to demo" onClick={p.onReset}><RotateCcw size={15} /></ToolBtn>
      </div>

      <div className="mx-auto flex rounded-full bg-muted p-1">
        {(["desktop", "mobile"] as const).map((d) => (
          <button key={d} onClick={() => p.onDevice(d)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${p.device === d ? "bg-card text-foreground shadow-panel" : "text-muted-foreground hover:text-foreground"}`}>
            {d === "desktop" ? <Monitor size={14} /> : <Smartphone size={14} />}{d}
          </button>
        ))}
      </div>

      <SaveIndicator s={p.save} />
      <button onClick={p.onGenerate} className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-accent px-3.5 py-2 text-xs font-semibold text-accent-foreground transition hover:border-primary">
        <Sparkles size={14} /> Rewrite with AI
      </button>
      <button onClick={p.onSave} disabled={p.save.kind === "saving"} className="rounded-full border bg-card px-4 py-2 text-xs font-semibold transition hover:bg-muted disabled:opacity-60">Save draft</button>
      <button onClick={p.onExport} className="flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-primary-foreground shadow-glow transition hover:brightness-110">
        <Upload size={14} /> Export to Shopify
      </button>
    </header>
  );
}

function SaveIndicator({ s }: { s: SaveState }) {
  const base = "flex items-center gap-1.5 text-xs font-medium";
  if (s.kind === "saving") return <span className={`${base} text-muted-foreground`}><Loader2 size={13} className="animate-spin" /> Saving…</span>;
  if (s.kind === "dirty") return <span className={`${base} text-warning`}><Circle size={8} fill="currentColor" /> Unsaved changes</span>;
  if (s.kind === "error") return <span className={`${base} text-destructive`}>Save failed</span>;
  return (
    <span className={`${base} text-success`} title="Stored in this browser only">
      <Check size={14} /> {s.at ? `Saved in browser · ${s.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "No changes"}
    </span>
  );
}

function ToolBtn({ children, label, disabled, onClick }: { children: React.ReactNode; label: string; disabled?: boolean; onClick: () => void }) {
  return (
    <button aria-label={label} title={label} disabled={disabled} onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35">
      {children}
    </button>
  );
}
