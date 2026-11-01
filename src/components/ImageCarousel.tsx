'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import type { ProductImage } from '@/lib/products';

type Props = {
  images: ProductImage[];
  productName: string;
};

export default function ImageCarousel({ images, productName }: Props) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [direction, setDirection] = useState(1);

  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(images.length - 1, next));
    if (clamped === index) return;
    setDirection(clamped > index ? 1 : -1);
    setIndex(clamped);
  };

  const active = images[index];

  return (
    <div className="relative">
      {/* Stage. Ratios are the Figma frames: 316×227 mobile, 388×290 desktop. */}
      <div className="relative aspect-[316/227] w-full overflow-hidden rounded-stage bg-stage @[360px]:aspect-[388/290]">
        {/* Soft shadow pooled behind the product — the blurred ellipse from the
            design, reproduced as a CSS blur so it can react to hover. */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-[17.2%] aspect-square w-[59.2%] -translate-x-1/2 rounded-full bg-[rgba(3,3,3,0.2)] blur-[52px] transition-all duration-500 ease-settle group-hover/card:scale-110 group-hover/card:bg-[rgba(3,3,3,0.26)] @[360px]:top-[13.4%] @[360px]:w-[48.2%]"
        />

        {/* Skeleton shimmer until the first frame decodes — stops the layout
            flashing white then snapping to the photo. */}
        <AnimatePresence>
          {!loaded && (
            <motion.div
              key="skeleton"
              aria-hidden="true"
              className="absolute inset-0 overflow-hidden bg-[#ededed]"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slides */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            className="absolute inset-0"
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -28 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            drag={images.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={(_, info) => {
              if (info.offset.x < -45) go(index + 1);
              else if (info.offset.x > 45) go(index - 1);
            }}
          >
            {/* Product shot. Sized and offset exactly as in the frames:
                183×244 at y=8 (mobile), 236×315 at y=9 (desktop) — it
                deliberately overflows the stage and is clipped at the bottom. */}
            <div className="absolute left-1/2 top-[8px] h-[107.5%] w-[57.9%] -translate-x-1/2 @[360px]:top-[9px] @[360px]:h-[108.6%] @[360px]:w-[60.8%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.src}
                alt={`${productName} — ${active.alt}`}
                draggable={false}
                onLoad={() => setLoaded(true)}
                className="h-full w-full select-none object-cover transition-transform duration-[600ms] ease-settle group-hover/card:scale-[1.045]"
                style={{
                  objectPosition: active.framing?.position ?? '50% 50%',
                  transform: active.framing ? `scale(${active.framing.scale})` : undefined,
                }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots — 6px circles, 16px pill for the active one, 6px gaps (Figma 4:76). */}
        {images.length > 1 && (
          <div
            className="absolute bottom-[7px] left-1/2 flex -translate-x-1/2 items-center gap-[6px] rounded-full bg-black/25 px-[7px] py-[4px] backdrop-blur-[4px]"
            role="tablist"
            aria-label={`${productName} images`}
          >
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`View image ${i + 1} of ${images.length}`}
                onClick={() => go(i)}
                className="focus-ring group/dot grid h-[14px] place-items-center"
                style={{ width: i === index ? 16 : 6 }}
              >
                <motion.span
                  layout
                  className={`block h-[6px] rounded-full transition-colors duration-300 ${
                    i === index ? 'bg-white' : 'bg-white/50 group-hover/dot:bg-white/80'
                  }`}
                  animate={{ width: i === index ? 16 : 6 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <span className="sr-only" aria-live="polite">
        Image {index + 1} of {images.length}
      </span>
    </div>
  );
}
