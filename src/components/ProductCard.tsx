'use client';

import { motion, useReducedMotion } from 'framer-motion';
import AddToCartButton from './AddToCartButton';
import ImageCarousel from './ImageCarousel';
import WishlistButton from './WishlistButton';
import { discountPercent, formatINR, type Product } from '@/lib/products';
import { useCart } from '@/lib/cart-store';

export default function ProductCard({
  product,
  width = 400,
}: {
  product: Product;
  /** Max card width. 328 and 400 are the two Figma frames. */
  width?: number;
}) {
  const reduce = useReducedMotion();
  const { wishlist, items, toggleWishlist, addToCart } = useCart();
  const saved = wishlist.has(product.id);
  const off = discountPercent(product.priceWas, product.priceNow);
  const fullName = `${product.brand} ${product.name}`;

  return (
    // The @container wrapper is what the card measures itself against, so the
    // card adapts to the column it sits in rather than to the browser width.
    <div className="@container w-full" style={{ maxWidth: width }}>
      <motion.article
        className="group/card relative flex w-full flex-col rounded-card border border-surface-line bg-surface px-[6px] pb-[6px] shadow-card transition-[box-shadow,border-color] duration-[420ms] ease-settle hover:border-[#cfcfcf] hover:shadow-card-hover @[360px]:pb-[8px]"
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Header: category + stock */}
        <header className="flex items-center justify-between px-[9px] pb-[7px] pt-[9px] @[360px]:pb-[9px]">
          <p className="text-[10px] font-medium tracking-[0.02em] text-ink-50 @[360px]:text-[13px]">
            {product.category}
          </p>

          <p
            className={`flex items-center gap-[4px] text-[11px] font-medium tracking-[0.01em] @[360px]:text-[13px] ${
              product.inStock ? 'text-stock' : 'text-oos'
            }`}
          >
            <span
              aria-hidden="true"
              className={`relative block h-[5px] w-[5px] rounded-full ${
                product.inStock ? 'bg-stock' : 'bg-oos'
              }`}
            >
              {product.inStock && !reduce && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-stock"
                  /*
                   * Opacity starts AND ends at 0, so the loop restart is
                   * invisible. Animating [0.55 -> 0] snaps back to 0.55 at the
                   * top of every cycle, which is the blink.
                   */
                  animate={{ scale: [1, 1.9, 2.8], opacity: [0, 0.45, 0] }}
                  transition={{
                    duration: 2.2,
                    times: [0, 0.4, 1],
                    repeat: Infinity,
                    repeatDelay: 0.7,
                    ease: 'easeOut',
                  }}
                />
              )}
            </span>
            {product.inStock ? 'In stock' : 'Out of stock'}
          </p>
        </header>

        {/* Image stage */}
        <div className={product.inStock ? '' : 'opacity-70 saturate-[0.35]'}>
          <ImageCarousel images={product.images} productName={fullName} />
        </div>

        {/* Copy */}
        <div className="flex flex-col px-[9px] pt-[11px]">
          <h3 className="line-clamp-2 text-[13px] leading-[1.35] text-ink-80 @[360px]:text-[16px]">
            <span className="font-semibold text-ink">{product.brand} </span>
            <span className="font-normal">{product.name}</span>
          </h3>

          <div className="flex flex-wrap items-center gap-x-[10px] gap-y-[4px] pt-[6px] @[360px]:pt-[10px]">
            {off > 0 && (
              <p className="text-[11px] text-price-was line-through decoration-price-was decoration-[1px] @[360px]:text-[13px]">
                {product.currency}
                {formatINR(product.priceWas)}
              </p>
            )}

            <p className="text-[16px] font-semibold text-ink @[360px]:text-[20px]">
              {product.currency} {formatINR(product.priceNow)}
            </p>

            {off > 0 && (
              <p className="rounded-chip bg-discount-bg px-[5px] py-px text-[11px] font-medium text-discount @[360px]:text-[13px]">
                {off}% Off
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-[8px] px-0 pt-[19px] @[360px]:pt-[24px]">
          <AddToCartButton
              productName={fullName}
              disabled={!product.inStock}
              inCart={items.has(product.id)}
              onAdd={() => addToCart(product.id)}
            />
          <WishlistButton
            saved={saved}
            productName={fullName}
            onToggle={() => toggleWishlist(product.id)}
          />
        </div>
      </motion.article>
    </div>
  );
}
