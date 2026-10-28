# Shopify Flow Editor

Build a premium, interactive product-page editor for Mercury Pages, an AI-powered Shopify product-page and advertising generator.

DESIGN

Luxurious, conversion-focused SaaS aesthetic using fuchsia, purple, white, and subtle neutral backgrounds.

Professional desktop layout with a left section navigator, central live product-page preview, and right properties inspector.

Responsive mobile and desktop preview modes.

High-quality product imagery, typography, spacing, and polished interactions.

FUNCTIONALITY

Show a realistic example Shopify product page.

Support drag-and-drop section reordering.

Edit headlines, descriptions, images, colors, typography, and section settings.

Add, duplicate, hide, and delete sections.

Include undo/redo and a clear save status.

Include a mobile preview toggle.

IMPORTANT

Build reusable React components and keep the product-page document in structured JSON.

Keep editor state separate from the preview renderer.

Do not create a new backend or require Lovable Cloud or Supabase.

Use realistic demo data for the prototype.

Clearly isolate demo data and mock actions so they can later be replaced by real API calls.

Do not claim that saving, AI generation, or Shopify export works unless it is actually connected and tested.

Start with the editor screen and a working interactive preview. Make the result visually impressive before expanding the scope.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b3a878e8-7ae6-40d1-8fe4-39fd78ff27bf).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
