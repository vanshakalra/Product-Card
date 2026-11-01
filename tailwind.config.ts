import type { Config } from 'tailwindcss';

/**
 * Design tokens lifted directly from the Figma file
 * "UI Tasks" → Product Cards (node 4:91).
 * Frames: Mobile 328×395 (2:3), Desktop 400×479 (4:48).
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#f2f2f2',        // card background
        'surface-line': '#dddddd', // card border
        stage: '#ffffff',          // image stage background
        ink: '#000000',
        'ink-80': 'rgba(0,0,0,0.8)',
        'ink-50': 'rgba(0,0,0,0.5)',
        'price-was': '#8e8e8e',
        discount: '#20bc0e',
        'discount-bg': 'rgba(30,180,0,0.1)',
        stock: '#0ab123',
        oos: '#b1540a',
        'oos-bg': 'rgba(180,90,0,0.1)',
        cta: 'rgba(32,32,32,0.9)',
        'cta-hover': 'rgba(18,18,18,0.96)',
        success: '#0ab123',
        wish: '#ff3b5c',
      },
      borderRadius: {
        card: '20px',
        stage: '18px',
        pill: '40px',
        chip: '50px',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 18px 40px -12px rgba(0,0,0,0.22), 0 4px 10px -4px rgba(0,0,0,0.08)',
        cta: '0 6px 18px -6px rgba(32,32,32,0.5)',
      },
      transitionTimingFunction: {
        // the "settle" curve used across the card
        settle: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
};

export default config;
