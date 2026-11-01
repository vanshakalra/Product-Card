export type ProductImage = {
  src: string;
  alt: string;
  /** object-position + scale, used to present alternate crops of the same shot */
  framing?: { position: string; scale: number };
};

export type Product = {
  id: string;
  category: string;
  brand: string;
  name: string;
  priceWas: number;
  priceNow: number;
  currency: string;
  inStock: boolean;
  images: ProductImage[];
};

export const formatINR = (value: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);

/**
 * Discount is derived, never hardcoded.
 * Figma shows "48% Off" for 3499 → 1799, which is 48.58% — so the design
 * floors rather than rounds. Flooring is also the safer commercial choice:
 * it never claims a bigger saving than the customer actually gets.
 */
export const discountPercent = (was: number, now: number) =>
  was > now ? Math.floor(((was - now) / was) * 100) : 0;

export const products: Product[] = [
  {
    id: 'hm-cotton-sweatshirt',
    category: 'Winterwear',
    brand: 'H&M',
    name: "Men's Cotton Sweatshirt",
    priceWas: 3499,
    priceNow: 1799,
    currency: '₹',
    inStock: true,
    images: [
      { src: '/assets/product-sweatshirt.png', alt: 'Grey cotton sweatshirt, full front view' },
      {
        src: '/assets/product-sweatshirt.png',
        alt: 'Grey cotton sweatshirt, close view of the body and fit',
        framing: { position: '50% 38%', scale: 1.75 },
      },
      {
        src: '/assets/product-sweatshirt.png',
        alt: 'Grey cotton sweatshirt, close view of the ribbed cuff',
        framing: { position: '22% 52%', scale: 2.3 },
      },
      {
        src: '/assets/product-sweatshirt.png',
        alt: 'Grey cotton sweatshirt, close view of the ribbed crew neck',
        framing: { position: '50% 20%', scale: 2.1 },
      },
    ],
  },
  {
    id: 'hm-oversized-hoodie',
    category: 'Winterwear',
    brand: 'H&M',
    name: 'Oversized Fleece Hoodie',
    priceWas: 4299,
    priceNow: 2579,
    currency: '₹',
    inStock: true,
    images: [
      { src: '/assets/product-sweatshirt.png', alt: 'Oversized fleece hoodie, full front view' },
      {
        src: '/assets/product-sweatshirt.png',
        alt: 'Oversized fleece hoodie, close view of the body',
        framing: { position: '50% 40%', scale: 1.8 },
      },
    ],
  },
  {
    id: 'hm-wool-overshirt',
    category: 'Winterwear',
    brand: 'H&M',
    name: 'Wool-Blend Overshirt With a Deliberately Long Name to Test Truncation',
    priceWas: 5999,
    priceNow: 5999,
    currency: '₹',
    inStock: false,
    images: [
      { src: '/assets/product-sweatshirt.png', alt: 'Wool-blend overshirt, full front view' },
    ],
  },
];
