'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useId, useState } from 'react';

/**
 * Heart path is the vector from Figma node 4:61, used verbatim so the resting
 * state is pixel-identical to the design. It is inlined (rather than kept as a
 * flat <img>) because fill and stroke have to animate on toggle.
 */
const HEART_PATH =
  'M22 17.0949L21.5853 17.494C21.6938 17.6068 21.8435 17.6705 22 17.6705C22.1565 17.6705 22.3062 17.6068 22.4147 17.494L22 17.0949ZM20.0246 26.9345C18.8615 26.0175 17.5896 25.1221 16.5805 23.9859C15.5913 22.8719 14.9012 21.572 14.9012 19.8857H13.75C13.75 21.9313 14.6022 23.4919 15.7198 24.7503C16.8176 25.9865 18.2171 26.9754 19.312 27.8385L20.0246 26.9345ZM14.9012 19.8857C14.9012 18.235 15.8339 16.8508 17.1071 16.2688C18.344 15.7034 20.0059 15.8531 21.5853 17.494L22.4147 16.6957C20.5407 14.7487 18.3655 14.4278 16.6285 15.2218C14.9278 15.9992 13.75 17.8043 13.75 19.8857H14.9012ZM19.312 27.8385C19.7051 28.1484 20.1271 28.4789 20.5548 28.7288C20.9823 28.9786 21.4702 29.1816 22 29.1816V28.0305C21.7624 28.0305 21.4828 27.9378 21.1356 27.7348C20.7884 27.532 20.4283 27.2527 20.0246 26.9345L19.312 27.8385ZM24.688 27.8385C25.7829 26.9754 27.1824 25.9865 28.2802 24.7503C29.3978 23.4919 30.25 21.9313 30.25 19.8857H29.0988C29.0988 21.572 28.4088 22.8719 27.4194 23.9859C26.4104 25.1221 25.1385 26.0175 23.9754 26.9345L24.688 27.8385ZM30.25 19.8857C30.25 17.8043 29.0722 15.9992 27.3715 15.2218C25.6345 14.4278 23.4593 14.7487 21.5853 16.6957L22.4147 17.494C23.994 15.8531 25.656 15.7034 26.8929 16.2688C28.1661 16.8508 29.0988 18.235 29.0988 19.8857H30.25Z M23.9754 26.9345C23.5716 27.2527 23.2116 27.532 22.8644 27.7348C22.5172 27.9378 22.2376 28.0305 22 28.0305V29.1816C22.5298 29.1816 23.0177 28.9786 23.4452 28.7288C23.8729 28.4789 24.2949 28.1484 24.688 27.8385L23.9754 26.9345Z';

/** Solid heart, used for the filled (saved) state so it reads at a glance. */
const HEART_SOLID =
  'M22 29.1816c-.53 0-1.0177-.203-1.4452-.4528-.4277-.2499-.8497-.5804-1.2428-.8903-1.0949-.8631-2.4944-1.852-3.5922-3.0882C14.6022 23.4919 13.75 21.9313 13.75 19.8857c0-2.0814 1.1778-3.8865 2.8785-4.6639 1.737-.794 3.9122-.4731 5.7215 1.4739 1.8093-1.947 3.9845-2.2679 5.7215-1.4739 1.7007.7774 2.8785 2.5825 2.8785 4.6639 0 2.0456-.8522 3.6062-1.9698 4.8646-1.0978 1.2362-2.4973 2.2251-3.5922 3.0882-.3931.3099-.8151.6404-1.2428.8903-.4275.2498-.9152.4528-1.4452.4528Z';

const BURST = [
  { dx: 0, dy: -15, size: 4.5, delay: 0 },
  { dx: 13, dy: -8, size: 3.5, delay: 0.015 },
  { dx: 14, dy: 7, size: 3, delay: 0.03 },
  { dx: 0, dy: 15, size: 4, delay: 0.015 },
  { dx: -14, dy: 7, size: 3.5, delay: 0.03 },
  { dx: -13, dy: -8, size: 3, delay: 0 },
];

type Props = {
  saved: boolean;
  onToggle: () => void;
  productName: string;
  disabled?: boolean;
};

export default function WishlistButton({ saved, onToggle, productName, disabled }: Props) {
  const reduce = useReducedMotion();
  const [burstKey, setBurstKey] = useState(0);
  const gradientId = useId();

  const handleClick = () => {
    if (disabled) return;
    // Fires only on save, never on un-save — celebrating a removal reads as mockery.
    if (!saved && !reduce) setBurstKey((k) => k + 1);
    onToggle();
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${productName} from wishlist` : `Save ${productName} to wishlist`}
      className="focus-ring relative grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#d9d9d9] bg-white transition-colors duration-300 ease-settle hover:border-wish/50 hover:bg-wish/[0.06] disabled:cursor-not-allowed disabled:opacity-45 @[360px]:h-11 @[360px]:w-11"
      whileTap={reduce || disabled ? undefined : { scale: 0.86 }}
      transition={{ type: 'spring', stiffness: 520, damping: 18 }}
    >
      <span className="pointer-events-none absolute inset-0 grid place-items-center">
        <AnimatePresence>
          {burstKey > 0 && (
            <motion.span
              key={`ring-${burstKey}`}
              className="absolute rounded-full border-2 border-wish"
              initial={{ width: 24, height: 24, opacity: 0.85 }}
              animate={{ width: 64, height: 64, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        {burstKey > 0 &&
          BURST.map((p, i) => (
            <motion.span
              key={`${burstKey}-${i}`}
              className="absolute rounded-full bg-wish"
              style={{ width: p.size, height: p.size }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
              animate={{ x: p.dx, y: p.dy, scale: [0, 1, 0.2], opacity: [1, 1, 0] }}
              transition={{ duration: 0.5, delay: p.delay, ease: 'easeOut' }}
            />
          ))}
      </span>

      <motion.svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        aria-hidden="true"
        className="relative"
        animate={reduce ? undefined : saved ? { scale: [1, 1.34, 0.93, 1] } : { scale: 1 }}
        transition={{ duration: 0.42, times: [0, 0.35, 0.6, 1], ease: 'easeOut' }}
      >
        <defs>
          <linearGradient id={gradientId} x1="14" y1="15" x2="30" y2="29">
            <stop offset="0%" stopColor="#ff5f7a" />
            <stop offset="100%" stopColor="#ff2449" />
          </linearGradient>
        </defs>

        {/* outline heart — the Figma resting state */}
        <motion.path
          d={HEART_PATH}
          fill="currentColor"
          className="text-ink"
          animate={{ opacity: saved ? 0 : 1 }}
          transition={{ duration: 0.18 }}
        />

        {/* solid heart — the saved state */}
        <motion.path
          d={HEART_SOLID}
          fill={`url(#${gradientId})`}
          initial={false}
          animate={{ opacity: saved ? 1 : 0, scale: saved ? 1 : 0.6 }}
          style={{ transformOrigin: '22px 22px' }}
          transition={{ duration: 0.22, ease: 'backOut' }}
        />
      </motion.svg>
    </motion.button>
  );
}
