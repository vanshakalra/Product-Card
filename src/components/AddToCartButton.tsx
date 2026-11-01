'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'loading' | 'success';

type Props = {
  onAdd: () => void;
  disabled?: boolean;
  productName: string;
  /** Simulated round-trip. Swap for a real mutation in production. */
  latencyMs?: number;
};

export default function AddToCartButton({
  onAdd,
  disabled,
  productName,
  latencyMs = 620,
}: Props) {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleClick = () => {
    // Guard: the button is busy for the whole loading→success window, so a
    // double-click can never post the item twice.
    if (status !== 'idle' || disabled) return;

    setStatus('loading');
    timers.current.push(
      setTimeout(() => {
        setStatus('success');
        onAdd();
        timers.current.push(setTimeout(() => setStatus('idle'), 1500));
      }, latencyMs),
    );
  };

  const busy = status !== 'idle';

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled || busy}
      aria-live="polite"
      aria-label={
        disabled
          ? `${productName} is out of stock`
          : status === 'success'
            ? `${productName} added to cart`
            : `Add ${productName} to cart`
      }
      className={[
        'focus-ring relative h-12 w-full overflow-hidden rounded-pill text-[13px] font-semibold text-white @[360px]:h-11 @[360px]:text-[14px]',
        'transition-[background-color,box-shadow] duration-300 ease-settle',
        disabled
          ? 'cursor-not-allowed bg-[rgba(32,32,32,0.35)]'
          : status === 'success'
            ? 'bg-success shadow-cta'
            : 'bg-cta hover:bg-cta-hover hover:shadow-cta',
      ].join(' ')}
      whileTap={reduce || disabled || busy ? undefined : { scale: 0.975 }}
      transition={{ type: 'spring', stiffness: 600, damping: 26 }}
    >
      {/* sheen sweep on hover — pure decoration, skipped when disabled */}
      {!disabled && status === 'idle' && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/18 to-transparent transition-transform duration-700 ease-settle group-hover/card:translate-x-full"
        />
      )}

      <span className="grid h-full w-full place-items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          {status === 'idle' && (
            <motion.span
              key="label"
              className="col-start-1 row-start-1 flex items-center gap-2"
              initial={reduce ? false : { y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: -18, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {disabled ? 'Out of Stock' : 'Add to Cart'}
            </motion.span>
          )}

          {status === 'loading' && (
            <motion.span
              key="spinner"
              className="col-start-1 row-start-1"
              initial={reduce ? false : { y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: -18, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <span className="block h-[18px] w-[18px] animate-spin rounded-full border-2 border-white/30 border-t-white" />
            </motion.span>
          )}

          {status === 'success' && (
            <motion.span
              key="done"
              className="col-start-1 row-start-1 flex items-center gap-2"
              initial={reduce ? false : { y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { y: -18, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
                <motion.path
                  d="M3.5 9.2 6.8 12.4 13.5 5"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.32, ease: 'easeOut', delay: 0.04 }}
                />
              </svg>
              Added
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}
