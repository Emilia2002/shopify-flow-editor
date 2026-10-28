import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageRenderer } from "@/renderer/PageRenderer";
import { demoDocument } from "./demo/demoDocument";
import { clearLocalDraft, exportToShopify, generateWithAI, loadLocalDraft, saveDraft } from "./mockApi";
import { useEditorStore } from "./useEditorStore";
import { SectionNavigator } from "./components/SectionNavigator";
import { Inspector } from "./components/Inspector";
import { Toolbar, type Device, type SaveState } from "./components/Toolbar";

export function Editor() {
  const store = useEditorStore(demoDocument);
  const { doc } = store;
  const [selectedId, setSelectedId] = useState<string | null>(doc.sections[1]?.id ?? null);
  const [device, setDevice] = useState<Device>("desktop");
  const [save, setSave] = useState<SaveState>({ kind: "saved", at: null });
  const savedDoc = useRef(doc);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load a browser-local draft after hydration.
  useEffect(() => {
    const d = loadLocalDraft();
    if (d) { store.reset(d); savedDoc.current = d; setSelectedId(d.sections[1]?.id ?? null); setSave({ kind: "saved", at: null }); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (save.kind === "saving") return;
    if (doc !== savedDoc.current) setSave({ kind: "dirty" });
    else if (save.kind === "dirty") setSave({ kind: "saved", at: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  const doSave = async () => {
    setSave({ kind: "saving" });
    try {
      const snapshot = doc;
      const { savedAt } = await saveDraft(snapshot);
      savedDoc.current = snapshot;
      setSave({ kind: "saved", at: savedAt });
    } catch {
      setSave({ kind: "error" });
    }
  };

  // Keyboard shortcuts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const tag = (e.target as HTMLElement).tagName;
      if (e.key.toLowerCase() === "s") { e.preventDefault(); doSave(); return; }
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? store.redo() : store.undo(); }
      if (e.key.toLowerCase() === "y") { e.preventDefault(); store.redo(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const select = (id: string | null) => {
    setSelectedId(id);
    if (id) requestAnimationFrame(() => canvasRef.current?.querySelector(`[data-section-id="${id}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const selected = doc.sections.find((s) => s.id === selectedId) ?? null;
  const notConnected = (fn: () => Promise<never>) => () => fn().catch((e: Error) => toast(e.message, { description: "This prototype uses demo data only." }));

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Toolbar
        productTitle={doc.product.title}
        canUndo={store.canUndo} canRedo={store.canRedo} onUndo={store.undo} onRedo={store.redo}
        device={device} onDevice={setDevice} save={save} onSave={doSave}
        onReset={() => { clearLocalDraft(); store.reset(demoDocument); savedDoc.current = demoDocument; setSave({ kind: "saved", at: null }); setSelectedId(demoDocument.sections[1].id); }}
        onGenerate={notConnected(generateWithAI)} onExport={notConnected(exportToShopify)}
      />
      <div className="flex min-h-0 flex-1">
        <SectionNavigator
          sections={doc.sections} selectedId={selectedId} onSelect={select} onMove={store.move}
          onAdd={(t) => select(store.add(t, selectedId ?? undefined))}
          onDuplicate={(id) => select(store.duplicate(id))}
          onToggleHidden={store.toggleHidden}
          onRemove={(id) => { store.remove(id); if (id === selectedId) setSelectedId(null); }}
        />
        <main ref={canvasRef} className="bg-canvas-glow min-w-0 flex-1 overflow-y-auto" onClick={() => setSelectedId(null)}>
          <div className={`mx-auto transition-all duration-500 ease-out ${device === "mobile" ? "max-w-[400px] py-10" : "max-w-[1180px] p-8"}`}>
            <div className="mb-3 flex items-center justify-between px-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-success" /> Live preview · demo product</span>
              <span className="font-mono">/products/{doc.product.handle}</span>
            </div>
            <div className={`overflow-hidden bg-card shadow-device ${device === "mobile" ? "rounded-[2.5rem] border-[10px] border-foreground" : "rounded-2xl"}`}>
              {device === "desktop" && (
                <div className="flex items-center gap-1.5 border-b bg-muted px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-border" /><span className="h-2.5 w-2.5 rounded-full bg-border" /><span className="h-2.5 w-2.5 rounded-full bg-border" />
                </div>
              )}
              <PageRenderer doc={doc} selectedId={selectedId} onSelect={select} />
            </div>
          </div>
        </main>
        <Inspector
          section={selected} theme={doc.theme}
          onUpdate={(patch, key) => selected && store.updateSection(selected.id, patch, key)}
          onTheme={store.updateTheme}
        />
      </div>
    </div>
  );
}
