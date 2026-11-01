# Product Card — Figma to Vercel

A responsive product card built from the Figma file **UI Tasks → Product Cards**
(`node-id=4-91`), with the mobile (328×395) and desktop (400×479) frames as the
visual target.

Stack: **Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion**

---

## Run it locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

---

## Deploy to Vercel

### Option A — GitHub (recommended, gives you preview deploys on every push)

```bash
git init
git add .
git commit -m "Product card from Figma"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then at [vercel.com/new](https://vercel.com/new) → **Import Git Repository** → pick the repo
→ **Deploy**. Vercel detects Next.js automatically; no build settings to change,
no environment variables needed.

### Option B — CLI (fastest one-off)

```bash
npm i -g vercel
vercel          # preview URL
vercel --prod   # production URL
```

### Option C — drag and drop

Zip this folder **without** `node_modules`, then drop it on
[vercel.com/new](https://vercel.com/new).

---

## Where things live

```
src/
  app/
    layout.tsx           root layout, fonts, cart provider
    page.tsx             demo page — a single card, centred
    globals.css          Poppins, focus ring, reduced-motion reset
  components/
    ProductCard.tsx      the card itself — layout + composition
    ImageCarousel.tsx    image stage, skeleton, swipe, dots
    AddToCartButton.tsx  idle → loading → success state machine
    WishlistButton.tsx   heart toggle, burst, ring pulse
    CartBadge.tsx        header cart count
  lib/
    products.ts          data model + price/discount helpers
    cart-store.tsx       cart and wishlist state
tailwind.config.ts       design tokens lifted from Figma
public/assets/           product image exported from the Figma file
```

---

## Design tokens

Every colour, radius and type size in `tailwind.config.ts` comes from the Figma
frames rather than being eyeballed:

| Token | Value | From |
| --- | --- | --- |
| `surface` | `#f2f2f2` | card fill |
| `surface-line` | `#dddddd` | card border |
| `stage` | `#ffffff` | image stage fill |
| `price-was` | `#8e8e8e` | struck-through price |
| `discount` / `discount-bg` | `#20bc0e` / `rgba(30,180,0,0.1)` | discount chip |
| `stock` | `#0ab123` | in-stock label |
| `cta` | `rgba(32,32,32,0.9)` | Add to Cart fill |
| `rounded-card` / `rounded-stage` / `rounded-pill` | `20px` / `18px` / `40px` | corner radii |

---

## Micro-interactions

### Wishlist (`WishlistButton.tsx`)

- Outline heart (the exact vector from Figma node `4:61`) crossfades to a solid
  gradient heart, scaling `1 → 1.34 → 0.93 → 1` on a short spring.
- A ring expands and fades, and six particles radiate outward.
- **The burst fires on save only, never on un-save.** Celebrating a removal
  reads as sarcasm.
- State flips optimistically — the animation never waits on a network call.
- `aria-pressed` tracks saved state and the label changes between
  "Save … to wishlist" and "Remove … from wishlist".

### Add to cart (`AddToCartButton.tsx`)

- A four-state machine: `idle → loading → success → in-cart`.
- The label slides up and out, a spinner fades in, then a checkmark **draws
  itself** (`pathLength` 0 → 1) next to the word "Added" while the fill moves to
  green.
- After the success window the CTA **does not revert** — it settles into
  **"Go to Bag"** with an arrow that nudges right on hover, and the click
  becomes a navigation rather than a mutation. Membership comes from the cart
  store, so the state survives a re-render and is shared with the header count.
- The button is `disabled` for the whole loading + success window, so a
  double-click cannot add the item twice.
- Width never changes between states — the row below it never shifts.
- A sheen sweeps across the fill on card hover.

### Card hover (`ProductCard.tsx`)

- Lifts 6px on a spring, shadow grows softer and wider, border darkens.
- The product image scales to 1.045 inside the clipped stage.
- The shadow pooled behind the product grows and deepens slightly.
- All of it is `group-hover`, so **nothing fires on touch** — the Add to Cart
  button is always visible rather than revealed on a hover that never happens.

### Image stage (`ImageCarousel.tsx`)

- Shimmer skeleton until the first frame decodes, so the card never flashes
  white and snaps.
- Slides crossfade with a 28px directional shift; drag or swipe past 45px
  changes image.
- Dots: 6px circles, 16px pill for the active one, animated with a layout
  spring.
- A live region announces "Image *n* of *m*" for screen readers.

### In-stock pulse

The green dot's ring animates `opacity: [0, 0.45, 0]`, starting **and ending at
zero** with a 0.7s rest between cycles. Animating `[0.45 → 0]` instead is what
produces a visible blink: at the top of every loop the value snaps back to full
in a single frame. Measured per animation frame, the current curve peaks at
0.45 with a largest frame-to-frame change of 0.014.

### Reduced motion

`prefers-reduced-motion` is honoured in two layers: a CSS reset in
`globals.css` and Framer Motion's `useReducedMotion()` in each component.
Transforms and bursts drop away; colour and state changes stay, so every state
is still legible.

---

## Changes made to the design

These are deliberate departures from the Figma frames — each one is a gap that
only shows up once the card is real.

1. **Discount is computed, not typed.** 3499 → 1799 is 48.58%. The design says
   "48% Off", so the helper **floors** rather than rounds. Flooring also means
   the card can never advertise a bigger saving than the customer gets.
2. **Carousel dots got a scrim.** In the frames the dots sit over the model's
   dark denim, where a dark active dot is invisible. They now sit on a
   `black/25` blurred pill with white dots, which holds up over a light or a
   dark photo.
3. **An out-of-stock state.** The frames only show "In stock". Without a
   counterpart the card cannot render half of a real catalogue, so there is now
   an amber dot, a disabled "Out of Stock" button, and a desaturated image. The
   wishlist stays enabled — saving a sold-out item is exactly when people want
   it.
4. **The card responds to its container, not the viewport.** A product card
   lives in grids of varying column counts, so a viewport breakpoint gives the
   wrong answer in a sidebar or a two-up layout. The card sits in a
   `@container` and switches its type scale and control sizes at 360px of its
   own width, between your 328 and 400 frames.
5. **Titles clamp to two lines.** The frames show a short title on one line. A
   real catalogue has long ones; `line-clamp-2` keeps the card from stretching
   indefinitely.
6. **A focus ring.** The frames have no keyboard-focus state. Every interactive
   element now has a visible 2px ring on `:focus-visible` only, so it never
   shows on mouse clicks.
7. **Touch targets.** The mobile wishlist button is 48×48, which clears the 44px
   minimum. On desktop it follows the frame at 44×44.

## Worth a look before this ships

- **The header row sits at 15px from the edge while the image stage and buttons
  sit at 6px.** It is a deliberate-looking inset in the frames, but at a glance
  the category label reads as misaligned with everything below it. Worth
  confirming it is intentional.
- **"48% Off" at `#20bc0e` on `rgba(30,180,0,0.1)`** is roughly 2.4:1 against
  that tint — under the 4.5:1 WCAG AA threshold for small text. Darkening the
  green to about `#157a0a` keeps the look and clears AA.
- **"In stock" at `#0ab123` on `#f2f2f2`** has the same problem at around 2.9:1.
- The struck-through price is the only thing distinguishing it from the live
  price for colour-blind users. It currently relies on the line plus a grey —
  that is fine, but keep the line if the greys are ever adjusted.

---

## Swapping in real data

`src/lib/products.ts` is the only file with content in it. Replace the
`products` array with your API response and the card picks it up — the discount
chip, the strike-through price and the stock dot are all derived.

The four carousel entries are presented crops of one exported shot, since the
Figma file carries a single image. Replace `images` with real alternate
photography and the crops go away.

`src/app/bag/page.tsx` is a placeholder so the "Go to Bag" CTA has a
destination — point `bagHref` at your real bag route instead. The cart is held
in `sessionStorage` so it survives a reload; swap that for your real cart
service.

`src/app/page.tsx` is a demo page only — replace it when you drop `ProductCard`
into a real catalogue page. The card takes an optional `width` prop (defaults to
400, the desktop frame); pass 328 to pin it to the mobile frame.
