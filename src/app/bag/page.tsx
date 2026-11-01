'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart-store';

export default function BagPage() {
  const { count } = useCart();

  return (
    <main className="grid min-h-dvh w-full place-items-center px-5 py-16">
      <div className="flex max-w-[380px] flex-col items-center text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full border border-[#d9d9d9] bg-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
        </div>

        <h1 className="mt-5 text-[20px] font-semibold text-ink">Your bag</h1>
        <p className="mt-2 text-[14px] text-ink-50">
          {count === 0
            ? 'Nothing here yet.'
            : `${count} ${count === 1 ? 'item' : 'items'} in your bag.`}
        </p>

        <Link
          href="/"
          className="focus-ring mt-7 rounded-pill bg-cta px-6 py-3 text-[14px] font-semibold text-white transition-colors duration-300 ease-settle hover:bg-cta-hover"
        >
          Keep shopping
        </Link>

        <p className="mt-6 text-[12px] leading-relaxed text-ink-50/80">
          A placeholder so the CTA has somewhere to go. Replace with your real bag
          route.
        </p>
      </div>
    </main>
  );
}
