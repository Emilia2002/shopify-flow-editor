// Structured JSON document model for a product page.
// This is the single source of truth the renderer consumes and the
// shape a future API would persist / export.

export type SectionType =
  | "announcement"
  | "hero"
  | "features"
  | "imageText"
  | "reviews"
  | "faq"
  | "cta";

export interface ThemeSettings {
  primary: string;
  background: string;
  surface: string;
  text: string;
  headingFont: string;
  bodyFont: string;
  radius: number;
}

export interface FeatureItem { id: string; title: string; text: string; icon: string }
export interface ReviewItem { id: string; author: string; rating: number; text: string }
export interface FaqItem { id: string; q: string; a: string }

export interface SectionSettingsMap {
  announcement: { text: string };
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    price: string;
    compareAt: string;
    ctaLabel: string;
    images: string[];
    variants: string[];
    badge: string;
  };
  features: { title: string; columns: 2 | 3 | 4; items: FeatureItem[] };
  imageText: { title: string; body: string; image: string; imageSide: "left" | "right" };
  reviews: { title: string; rating: number; count: number; items: ReviewItem[] };
  faq: { title: string; items: FaqItem[] };
  cta: { title: string; subtitle: string; ctaLabel: string };
}

export interface SectionStyle {
  paddingY: number; // px
  align: "left" | "center";
  tone: "default" | "surface" | "primary";
}

export type Section = {
  [K in SectionType]: {
    id: string;
    type: K;
    name: string;
    hidden: boolean;
    style: SectionStyle;
    settings: SectionSettingsMap[K];
  };
}[SectionType];

export interface PageDocument {
  id: string;
  version: number;
  product: { title: string; handle: string };
  theme: ThemeSettings;
  sections: Section[];
}
