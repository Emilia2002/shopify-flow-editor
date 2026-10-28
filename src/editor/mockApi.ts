// MOCK ACTIONS — nothing here talks to a server.
// Replace each function body with a real API call later; keep the signatures.
import type { PageDocument } from "./types";

const KEY = "mercury-pages:draft";

/** Saves the draft to this browser only (localStorage). Not a real backend. */
export async function saveDraft(doc: PageDocument): Promise<{ savedAt: Date }> {
  await new Promise((r) => setTimeout(r, 450));
  localStorage.setItem(KEY, JSON.stringify(doc));
  return { savedAt: new Date() };
}

export function loadLocalDraft(): PageDocument | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PageDocument) : null;
  } catch {
    return null;
  }
}

export function clearLocalDraft() {
  localStorage.removeItem(KEY);
}

/** Not connected: AI generation is a placeholder. */
export async function generateWithAI(): Promise<never> {
  throw new Error("AI generation isn't connected yet.");
}

/** Not connected: Shopify export is a placeholder. */
export async function exportToShopify(): Promise<never> {
  throw new Error("Shopify export isn't connected yet.");
}
