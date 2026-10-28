// Editor state (document + history + selection), separate from the renderer.
import { useCallback, useReducer } from "react";
import type { PageDocument, Section, SectionType, ThemeSettings } from "./types";
import { createSection, uid } from "./demo/demoDocument";

interface History { past: PageDocument[]; present: PageDocument; future: PageDocument[] }

type Action =
  | { type: "commit"; doc: PageDocument; coalesce?: string | undefined }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "reset"; doc: PageDocument };

let lastCoalesce: { key: string; t: number } | null = null;

function reducer(h: History, a: Action): History {
  switch (a.type) {
    case "commit": {
      const now = Date.now();
      // Group rapid edits to the same field into one undo step.
      if (a.coalesce && lastCoalesce?.key === a.coalesce && now - lastCoalesce.t < 800) {
        lastCoalesce.t = now;
        return { ...h, present: a.doc, future: [] };
      }
      lastCoalesce = a.coalesce ? { key: a.coalesce, t: now } : null;
      return { past: [...h.past, h.present].slice(-100), present: a.doc, future: [] };
    }
    case "undo": {
      if (!h.past.length) return h;
      lastCoalesce = null;
      return { past: h.past.slice(0, -1), present: h.past[h.past.length - 1]!, future: [h.present, ...h.future] };
    }
    case "redo": {
      if (!h.future.length) return h;
      lastCoalesce = null;
      return { past: [...h.past, h.present], present: h.future[0]!, future: h.future.slice(1) };
    }
    case "reset":
      return { past: [], present: a.doc, future: [] };
  }
}

export function useEditorStore(initial: PageDocument) {
  const [h, dispatch] = useReducer(reducer, { past: [], present: initial, future: [] });
  const doc = h.present;

  const commit = useCallback((next: PageDocument, coalesce?: string) => dispatch({ type: "commit", doc: next, coalesce }), []);

  const actions = {
    undo: () => dispatch({ type: "undo" }),
    redo: () => dispatch({ type: "redo" }),
    reset: (d: PageDocument) => dispatch({ type: "reset", doc: d }),
    updateSection: (id: string, patch: (s: Section) => Section, coalesce?: string) =>
      commit({ ...doc, sections: doc.sections.map((s) => (s.id === id ? patch(s) : s)) }, coalesce),
    updateTheme: (patch: Partial<ThemeSettings>, coalesce?: string) =>
      commit({ ...doc, theme: { ...doc.theme, ...patch } }, coalesce),
    move: (from: number, to: number) => {
      const arr = [...doc.sections];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m!);
      commit({ ...doc, sections: arr });
    },
    add: (type: SectionType, afterId?: string) => {
      const s = createSection(type);
      const arr = [...doc.sections];
      const idx = afterId ? arr.findIndex((x) => x.id === afterId) + 1 : arr.length;
      arr.splice(idx, 0, s);
      commit({ ...doc, sections: arr });
      return s.id;
    },
    duplicate: (id: string) => {
      const idx = doc.sections.findIndex((s) => s.id === id);
      const copy = structuredClone(doc.sections[idx]!);
      copy.id = uid();
      copy.name = `${copy.name} copy`;
      const arr = [...doc.sections];
      arr.splice(idx + 1, 0, copy);
      commit({ ...doc, sections: arr });
      return copy.id;
    },
    toggleHidden: (id: string) =>
      commit({ ...doc, sections: doc.sections.map((s) => (s.id === id ? { ...s, hidden: !s.hidden } : s)) }),
    remove: (id: string) => commit({ ...doc, sections: doc.sections.filter((s) => s.id !== id) }),
  };

  return { doc, canUndo: h.past.length > 0, canRedo: h.future.length > 0, ...actions };
}
