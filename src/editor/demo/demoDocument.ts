// DEMO DATA — replace with a document loaded from the real API.
import hero from "@/assets/product-hero.jpg";
import texture from "@/assets/product-texture.jpg";
import lifestyle from "@/assets/product-lifestyle.jpg";
import type { PageDocument, Section, SectionType } from "../types";

export const DEMO_IMAGES = [hero, texture, lifestyle];

export const uid = () => Math.random().toString(36).slice(2, 10);

const baseStyle = { paddingY: 64, align: "left" as const, tone: "default" as const };

export const demoDocument: PageDocument = {
  id: "demo-eclat-radiance-serum",
  version: 1,
  product: { title: "Éclat Radiance Serum", handle: "eclat-radiance-serum" },
  theme: {
    primary: "#b0186f",
    background: "#fffaf8",
    surface: "#f7ece9",
    text: "#2a1822",
    headingFont: "Cormorant Garamond",
    bodyFont: "Manrope",
    radius: 14,
  },
  sections: [
    {
      id: uid(), type: "announcement", name: "Announcement bar", hidden: false,
      style: { ...baseStyle, paddingY: 10, align: "center", tone: "primary" },
      settings: { text: "Free shipping over $60 · 30-day glow guarantee" },
    },
    {
      id: uid(), type: "hero", name: "Product hero", hidden: false, style: { ...baseStyle, paddingY: 48 },
      settings: {
        eyebrow: "Vitamin C + Squalane",
        title: "Radiance Serum",
        description:
          "A weightless golden serum that brightens dull skin in 14 days. 15% stabilised vitamin C, cold-pressed squalane and niacinamide work together for a lit-from-within glow.",
        price: "$58.00",
        compareAt: "$72.00",
        ctaLabel: "Add to bag",
        images: [hero, texture, lifestyle],
        variants: ["30 ml", "50 ml", "Refill 100 ml"],
        badge: "Bestseller",
      },
    },
    {
      id: uid(), type: "features", name: "Key benefits", hidden: false, style: { ...baseStyle, align: "center", tone: "surface" },
      settings: {
        title: "Why it works",
        columns: 3,
        items: [
          { id: uid(), icon: "Sun", title: "Visibly brighter", text: "94% saw a more even tone after two weeks of daily use." },
          { id: uid(), icon: "Droplets", title: "Deep hydration", text: "Plant squalane locks in moisture without a greasy finish." },
          { id: uid(), icon: "Leaf", title: "Clean formula", text: "Vegan, fragrance-free and dermatologist tested." },
        ],
      },
    },
    {
      id: uid(), type: "imageText", name: "Ritual story", hidden: false, style: baseStyle,
      settings: {
        title: "Three drops. Every morning.",
        body: "Press onto clean skin before moisturiser and SPF. The silky texture absorbs in seconds, leaving a soft-focus radiance that lasts all day.",
        image: lifestyle,
        imageSide: "left",
      },
    },
    {
      id: uid(), type: "reviews", name: "Reviews", hidden: false, style: { ...baseStyle, align: "center" },
      settings: {
        title: "Loved by 12,000+ customers",
        rating: 4.8,
        count: 2143,
        items: [
          { id: uid(), author: "Amelia R.", rating: 5, text: "My dark spots faded noticeably in three weeks. The texture is a dream." },
          { id: uid(), author: "Priya S.", rating: 5, text: "Finally a vitamin C that doesn't sting. My skin looks rested even when I'm not." },
          { id: uid(), author: "Jordan L.", rating: 4, text: "Beautiful glow and the bottle looks gorgeous on my shelf." },
        ],
      },
    },
    {
      id: uid(), type: "faq", name: "FAQ", hidden: false, style: baseStyle,
      settings: {
        title: "Questions, answered",
        items: [
          { id: uid(), q: "Is it suitable for sensitive skin?", a: "Yes. The formula is fragrance-free and was tested on sensitive skin types." },
          { id: uid(), q: "When will I see results?", a: "Most customers notice brighter skin within 14 days of daily use." },
          { id: uid(), q: "Can I use it with retinol?", a: "Use vitamin C in the morning and retinol at night for best results." },
        ],
      },
    },
    {
      id: uid(), type: "cta", name: "Final call to action", hidden: false, style: { ...baseStyle, align: "center", tone: "primary" },
      settings: { title: "Your glow, bottled.", subtitle: "Try it risk-free for 30 days.", ctaLabel: "Shop Radiance Serum" },
    },
  ],
};

// Templates for "Add section".
export function createSection(type: SectionType): Section {
  const s = demoDocument.sections.find((x) => x.type === type)!;
  const copy = structuredClone(s) as Section;
  copy.id = uid();
  return copy;
}

export const SECTION_LIBRARY: { type: SectionType; label: string; description: string }[] = [
  { type: "announcement", label: "Announcement bar", description: "Slim promo strip" },
  { type: "hero", label: "Product hero", description: "Gallery, price & buy box" },
  { type: "features", label: "Benefits grid", description: "Icon + text columns" },
  { type: "imageText", label: "Image with text", description: "Story split layout" },
  { type: "reviews", label: "Reviews", description: "Social proof" },
  { type: "faq", label: "FAQ", description: "Expandable questions" },
  { type: "cta", label: "Call to action", description: "Closing banner" },
];
