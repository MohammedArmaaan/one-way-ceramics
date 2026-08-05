import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES, type Product, BUSINESS } from '@/data';

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ProductCard({
  product,
  index,
  wished,
  onWish,
  inCart,
  onCart,
}: {
  product: Product;
  index: number;
  wished: boolean;
  onWish: (id: string) => void;
  inCart: boolean;
  onCart: (id: string) => void;
}) {
  const waText = encodeURIComponent(
    `Hi ${BUSINESS.name}, I'm interested in "${product.name}" (${product.collection}, ${product.size}, ${product.finish}). Price: ${product.price}. Is it available?`,
  );
  const waHref = `https://wa.me/${BUSINESS.phoneHref.replace(/\D/g, '')}?text=${waText}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-ink-line/60 transition-all duration-500 hover:shadow-[0_24px_60px_-20px_rgba(28,28,26,0.22)] hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ivory-soft">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-cobalt px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ivory">
            {product.badge}
          </span>
        )}
        {/* Wishlist */}
        <button
          onClick={() => onWish(product.id)}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 ${
            wished
              ? 'bg-cobalt text-ivory'
              : 'bg-white/80 text-ink/60 hover:text-cobalt hover:bg-white'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} strokeWidth={1.8} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-medium uppercase tracking-wider text-sage-deep">
            {product.collection}
          </span>
          <span className="text-[10px] text-ink-muted">{product.size}</span>
        </div>
        <h3 className="font-sans font-semibold text-base text-ink leading-snug">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-ink-muted">{product.finish} finish</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="font-serif italic text-lg text-ink">{product.price}</span>
          <span className="text-[10px] text-ink-muted">per piece</span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:bg-[#1da851] hover:shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)]"
          >
            <WhatsAppIcon size={15} /> Inquire
          </a>
          <button
            onClick={() => onCart(product.id)}
            className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-300 ${
              inCart
                ? 'bg-sage-deep text-ivory'
                : 'bg-ink text-ivory hover:bg-ink-soft'
            }`}
            aria-label="Add to cart"
          >
            {inCart ? <Check size={15} strokeWidth={2} /> : <ShoppingBag size={15} strokeWidth={1.8} />}
            <span className="hidden sm:inline">{inCart ? 'Added' : 'Cart'}</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProductsPage() {
  const [activeCat, setActiveCat] = useState<string>('all');
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<Set<string>>(new Set());

  const toggleWish = (id: string) =>
    setWishlist((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleCart = (id: string) =>
    setCart((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const filtered =
    activeCat === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCat);

  return (
    <div className="bg-ivory min-h-screen pt-28 md:pt-32 pb-20">
      {/* Header */}
      <div className="container-px mb-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow text-cobalt mb-4"
        >
          Our Catalogue
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-4xl md:text-6xl text-ink leading-[1.05]"
        >
          Handmade pieces for <span className="text-sage-deep">every home.</span>
        </motion.h1>
        <p className="mt-5 text-ink-muted max-w-xl leading-relaxed">
          Browse {PRODUCTS.length}+ handmade ceramics across {PRODUCT_CATEGORIES.length} categories.
          Tap WhatsApp to inquire, add to cart, or save your favourites.
        </p>
      </div>

      {/* Category filter */}
      <div className="container-px mb-10">
        <div className="flex flex-wrap gap-2.5">
          <FilterChip label="All" count={PRODUCTS.length} active={activeCat === 'all'} onClick={() => setActiveCat('all')} />
          {PRODUCT_CATEGORIES.map((cat) => {
            const count = PRODUCTS.filter((p) => p.category === cat).length;
            return (
              <FilterChip
                key={cat}
                label={cat}
                count={count}
                active={activeCat === cat}
                onClick={() => setActiveCat(cat)}
              />
            );
          })}
        </div>
      </div>

      {/* Product grid */}
      <div className="container-px">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
        >
          {filtered.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              wished={wishlist.has(p.id)}
              onWish={toggleWish}
              inCart={cart.has(p.id)}
              onCart={toggleCart}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating cart/wishlist summary */}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-40 flex flex-col gap-3">
        <div className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-ivory shadow-lg">
          <Heart size={16} strokeWidth={1.8} className="text-cobalt-light" />
          <span className="text-sm font-semibold">{wishlist.size}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-cobalt px-4 py-2.5 text-ivory shadow-lg">
          <ShoppingBag size={16} strokeWidth={1.8} />
          <span className="text-sm font-semibold">{cart.size}</span>
        </div>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
        active
          ? 'bg-ink text-ivory shadow-md'
          : 'bg-white text-ink/70 border border-ink-line hover:border-cobalt hover:text-cobalt'
      }`}
    >
      {label}
      <span className={`ml-1.5 text-xs ${active ? 'text-ivory/60' : 'text-ink-muted'}`}>
        {count}
      </span>
    </button>
  );
}
