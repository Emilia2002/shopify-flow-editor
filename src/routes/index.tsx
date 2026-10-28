import { createFileRoute } from "@tanstack/react-router";
import { Editor } from "@/editor/Editor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Product Page Editor — Mercury Pages" },
      { name: "description", content: "Design conversion-ready Shopify product pages with a live, drag-and-drop editor." },
      { property: "og:title", content: "Product Page Editor — Mercury Pages" },
      { property: "og:description", content: "Design conversion-ready Shopify product pages with a live, drag-and-drop editor." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Editor,
});
