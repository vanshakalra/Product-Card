import CartBadge from '@/components/CartBadge';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <main className="relative grid min-h-dvh w-full place-items-center px-5 py-16">
      <div className="absolute right-5 top-5 sm:right-8 sm:top-8">
        <CartBadge />
      </div>

      <ProductCard product={products[0]} />
    </main>
  );
}
