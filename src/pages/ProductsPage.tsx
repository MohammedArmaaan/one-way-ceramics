import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Check, ChevronDown } from 'lucide-react';
import { PRODUCTS, PRODUCT_CATEGORIES, type Product, BUSINESS } from '@/data';
// Agar aap custom router use kar rahe hain, toh yahan import karein (e.g., useNavigate)

// Clean and perfectly aligned WhatsApp Icon
function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
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
  onClickProduct,
}: {
  product: Product;
  index: number;
  wished: boolean;
  onWish: (id: string) => void;
  inCart: boolean;
  onCart: (id: string) => void;
  onClickProduct: (id: string) => void;
}) {
  const waText = encodeURIComponent(
    `Hi ${BUSINESS.name}, I'm interested in "${product.name}" (${product.collection}, ${product.size}, ${product.finish}). Price: ${product.price}. Is it available?`
  );
  const waHref = `https://wa.me/${BUSINESS.phoneHref.replace(/\D/g, '')}?text=${waText}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-ink-line/40 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-ink-line/80 cursor-pointer"
      onClick={() => onClickProduct(product.id)}
    >
      <div className="relative w-full aspect-[4/5] sm:aspect-square overflow-hidden bg-ivory-soft">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {product.badge && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 rounded-full bg-cobalt px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-ivory shadow-sm">
            {product.badge}
          </span>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWish(product.id);
          }}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${
            wished
              ? 'bg-cobalt text-ivory'
              : 'bg-white/90 text-ink/60 hover:text-cobalt hover:bg-white hover:scale-105'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={14} className="sm:w-[16px] sm:h-[16px]" strokeWidth={wished ? 2.5 : 1.8} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest text-sage-deep truncate">
            {product.collection}
          </span>
          <span className="text-[9px] sm:text-[10px] text-ink-muted whitespace-nowrap">
            {product.size}
          </span>
        </div>
        
        <h3 className="font-sans font-semibold text-sm sm:text-base text-ink leading-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-ink-muted capitalize">
          {product.finish} finish
        </p>

        <div className="mt-2 sm:mt-3 flex items-baseline justify-between gap-2">
          <span className="font-serif italic text-base sm:text-lg text-ink">
            {product.price}
          </span>
          <span className="text-[9px] sm:text-[10px] text-ink-muted">per piece</span>
        </div>

        <div className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-[#25D366] px-2 py-2 sm:px-3 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-white transition-all duration-300 hover:bg-[#1da851] hover:shadow-md"
          >
            <WhatsAppIcon size={14} /> 
            <span>Inquire</span>
          </a>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCart(product.id);
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg sm:rounded-xl px-2 py-2 sm:px-3 sm:py-2.5 text-[11px] sm:text-xs font-semibold transition-all duration-300 ${
              inCart
                ? 'bg-sage-deep text-ivory'
                : 'bg-ink text-ivory hover:bg-ink/90 hover:shadow-md'
            }`}
            aria-label="Add to cart"
          >
            {inCart ? (
              <Check size={14} strokeWidth={2.5} />
            ) : (
              <ShoppingBag size={14} strokeWidth={2} />
            )}
            <span>{inCart ? 'Added' : 'Cart'}</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}

// ----------------------------------------------------------------------
// HELPER FUNCTIONS FOR 30-DAY LOCAL STORAGE
// ----------------------------------------------------------------------
const EXPIRY_TIME = 30 * 24 * 60 * 60 * 1000;

const getStorageWithExpiry = (key: string): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return new Set();

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return new Set();
  }
  return new Set(item.value);
};

const setStorageWithExpiry = (key: string, valueSet: Set<string>) => {
  if (typeof window === 'undefined') return;
  const now = new Date();
  const item = {
    value: Array.from(valueSet),
    expiry: now.getTime() + EXPIRY_TIME,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

// ----------------------------------------------------------------------
// MAIN PAGE COMPONENT
// ----------------------------------------------------------------------
export default function ProductsPage() {
  // 1. Initial render par URL check karein ki category kya hai
  const getInitialCategory = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCategory = params.get('category');
      // Verify karein ki URL wali category valid hai
      if (urlCategory && PRODUCT_CATEGORIES.includes(urlCategory)) {
        return urlCategory;
      }
    }
    return 'all';
  };

  const [activeCat, setActiveCat] = useState<string>(getInitialCategory);
  
  const [wishlist, setWishlist] = useState<Set<string>>(() => getStorageWithExpiry('user_wishlist'));
  const [cart, setCart] = useState<Set<string>>(() => getStorageWithExpiry('user_cart'));

  // 2. State change hone par URL automatically update karein
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (activeCat === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', activeCat);
      }
      // replaceState use kar rahe hain taaki back history mess up na ho
      window.history.replaceState({}, '', url.toString());
    }
  }, [activeCat]);

  useEffect(() => {
    setStorageWithExpiry('user_wishlist', wishlist);
  }, [wishlist]);

  useEffect(() => {
    setStorageWithExpiry('user_cart', cart);
  }, [cart]);

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

  const handleProductClick = (id: string) => {
    window.location.href = `/product/${id}`;
  };

  const filtered =
    activeCat === 'all'
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCat);

  return (
    <div className="bg-ivory min-h-screen pt-24 md:pt-32 pb-20">
      {/* Header */}
      <div className="container-px mb-8 sm:mb-10">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-cobalt mb-3 sm:mb-4"
        >
          Our Catalogue
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-3xl sm:text-4xl md:text-6xl text-ink leading-[1.1]"
        >
          Handmade pieces for <span className="text-sage-deep">every home.</span>
        </motion.h1>
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-ink-muted max-w-xl leading-relaxed">
          Browse {PRODUCTS.length}+ handmade ceramics across {PRODUCT_CATEGORIES.length} categories.
          Tap WhatsApp to inquire, add to cart, or save your favourites.
        </p>
      </div>

      {/* Category filter */}
      <div className="container-px mb-8 sm:mb-10">
        
        {/* MOBILE VIEW: Dropdown Menu Bar */}
        <div className="block sm:hidden w-full relative">
          <select
            value={activeCat}
            onChange={(e) => setActiveCat(e.target.value)}
            className="w-full appearance-none bg-white border border-ink-line text-ink rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt shadow-sm transition-all"
          >
            <option value="all">All Categories ({PRODUCTS.length})</option>
            {PRODUCT_CATEGORIES.map((cat) => {
              const count = PRODUCTS.filter((p) => p.category === cat).length;
              return (
                <option key={cat} value={cat}>
                  {cat} ({count})
                </option>
              );
            })}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-ink-muted">
            <ChevronDown size={18} strokeWidth={2} />
          </div>
        </div>

        {/* DESKTOP VIEW: Filter Chips */}
        <div className="hidden sm:flex flex-wrap gap-2.5">
          <FilterChip 
            label="All" 
            count={PRODUCTS.length} 
            active={activeCat === 'all'} 
            onClick={() => setActiveCat('all')} 
          />
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

      {/* Product grid - Using grid-cols-2 for mobile! */}
      <div className="container-px">
        <motion.div
          layout
          className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 md:gap-6"
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
              onClickProduct={handleProductClick} 
            />
          ))}
        </motion.div>
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
      className={`flex items-center rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
        active
          ? 'bg-ink text-ivory shadow-md'
          : 'bg-white text-ink/70 border border-ink-line hover:border-cobalt hover:text-cobalt'
      }`}
    >
      {label}
      <span className={`ml-1.5 text-[10px] sm:text-xs rounded-full px-1.5 py-0.5 ${active ? 'bg-ivory/20 text-ivory' : 'bg-ink/5 text-ink-muted'}`}>
        {count}
      </span>
    </button>
  );
}