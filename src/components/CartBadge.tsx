'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '@/lib/cart-store';

export default function CartBadge() {
  const { count } = useCart();
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      <motion.div
        className="grid h-11 w-11 place-items-center rounded-full border border-[#d9d9d9] bg-white"
        animate={reduce ? undefined : count > 0 ? { scale: [1, 1.1, 1] } : {}}
        key={count}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 4h2l2.4 11.2a1.5 1.5 0 0 0 1.5 1.2h8.3a1.5 1.5 0 0 0 1.5-1.2L20.5 8H6"
            stroke="#202020"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="10" cy="20" r="1.4" fill="#202020" />
          <circle cx="17" cy="20" r="1.4" fill="#202020" />
        </svg>
      </motion.div>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            className="absolute -right-1 -top-1 grid h-[20px] min-w-[20px] place-items-center rounded-full bg-[#202020] px-[5px] text-[11px] font-semibold text-white"
            initial={reduce ? { opacity: 0 } : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 600, damping: 20 }}
          >
            <motion.span key={count} initial={reduce ? false : { y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              {count}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>

      <span className="sr-only" aria-live="polite">
        {count} {count === 1 ? 'item' : 'items'} in cart
      </span>
    </div>
  );
}
