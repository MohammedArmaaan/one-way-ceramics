import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Check } from 'lucide-react';
import { useNav } from '@/nav';
import { PRODUCTS, Product, BUSINESS } from '@/data';

// ----------------------------------------------------------------------
// ICONS
// ----------------------------------------------------------------------
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

// ... (imports aur helper functions same rahenge)

export default function NewArrivalsPage() {
  const { navigate } = useNav();

  const newArrivals = [...PRODUCTS]
    .reverse()
    .slice(0, 12)
    .map(p => ({ ...p, badge: p.badge || 'New' }));

  const [wishlist, setWishlist] = useState<Set<string>>(() => getStorageWithExpiry('user_wishlist'));
  const [cart, setCart] = useState<Set<string>>(() => getStorageWithExpiry('user_cart'));

  // FIX 1: Scroll to top sirf page load par hoga (Empty dependency array [])
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);

  // FIX 2: Wishlist sync alag se hoga (bina scroll kiye)
  useEffect(() => {
    setStorageWithExpiry('user_wishlist', wishlist);
  }, [wishlist]);

  // Cart sync
  useEffect(() => {
    setStorageWithExpiry('user_cart', cart);
  }, [cart]);

  // ... (Baaki saara code, toggleWish, toggleCart, return statement, aur ProductCard same rahega)

  // 4. Toggle Handlers
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

  // 5. Navigation Handlers
  const handleProductClick = (id: string) => {
    window.history.pushState({}, '', `/product/${id}`);
    window.dispatchEvent(new Event('popstate'));
    navigate(`product/${id}`);
  };

  const handleGoBack = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
    navigate('home'); 
  };

  return (
    <div className="bg-ivory min-h-screen pt-24 md:pt-32 pb-20">
      
      {/* Header Section */}
      <div className="container-px mx-auto max-w-[1600px] mb-10 md:mb-16">
        {/* <button 
          onClick={handleGoBack} 
          className="group flex items-center gap-2 text-ink-muted hover:text-ink transition-colors mb-8 md:mb-12 text-sm font-medium w-fit"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
          Back to Home
        </button> */}

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-cobalt mb-3 sm:mb-4"
        >
          Fresh from the Kiln
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-4xl sm:text-5xl md:text-7xl text-ink leading-[1.05] tracking-tight"
        >
          New <span className="text-sage-deep">Arrivals.</span>
        </motion.h1>
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-ink-muted max-w-xl leading-relaxed">
          Discover our latest handcrafted ceramics, freshly glazed and fired. 
          Limited batches available.
        </p>
      </div>

      {/* Grid Section */}
      <div className="container-px mx-auto max-w-[1600px]">
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8"
        >
          {newArrivals.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              wished={wishlist.has(product.id)}
              onWish={toggleWish}
              inCart={cart.has(product.id)}
              onCart={toggleCart}
              onClickProduct={handleProductClick} 
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// PRODUCT CARD COMPONENT (Grid Version without drag logic)
// ----------------------------------------------------------------------
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
  
  // WhatsApp Message Generator
  const waText = encodeURIComponent(
    `Hi ${BUSINESS.name}, I'm interested in the new "${product.name}" (${product.collection}, ${product.size}, ${product.finish}). Price: ${product.price}. Is it still in stock?`
  );
  const waHref = `https://wa.me/${BUSINESS.phoneHref.replace(/\D/g, '')}?text=${waText}`;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col cursor-pointer h-full"
      onClick={() => onClickProduct(product.id)}
    >
      {/* 1. Image Container */}
      <div className="relative w-full aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden bg-ivory mb-3 sm:mb-4 border border-ink-line/30 shadow-sm transition-all duration-500 group-hover:shadow-lg group-hover:border-ink-line/60 select-none">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-[0.25,1,0.5,1] group-hover:scale-105"
        />
        
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-500" />
        
        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 md:top-4 md:left-4 z-10 rounded-full bg-cobalt px-2.5 py-1 md:px-3 md:py-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-semibold text-ivory shadow-md">
            {product.badge}
          </span>
        )}
        
        {/* Wishlist Button (Floating) */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Blocks redirection when clicking the heart
            onWish(product.id);
          }}
          className={`absolute top-3 right-3 md:top-4 md:right-4 flex h-8 w-8 md:h-10 md:w-10 z-20 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${
            wished
              ? 'bg-cobalt text-ivory'
              : 'bg-white/90 text-ink/60 hover:text-cobalt hover:bg-white hover:scale-105'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={wished ? 2.5 : 1.8} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* 2. Content & Actions Area */}
      <div className="px-1 flex flex-1 flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center justify-between w-full mb-1.5">
            <p className="text-[10px] md:text-xs text-ink-muted uppercase tracking-wider font-semibold">
              {product.collection}
            </p>
            <p className="text-[10px] md:text-xs text-ink-muted font-medium">
              {product.size}
            </p>
          </div>
          
          {/* Title & Price */}
          <div className="flex justify-between items-start w-full gap-2 mb-4">
            <h4 className="font-sans font-bold text-sm md:text-lg text-ink leading-snug group-hover:text-cobalt transition-colors line-clamp-2">
              {product.name}
            </h4>
            <div className="text-right shrink-0">
              <p className="font-serif italic text-base md:text-xl text-ink whitespace-nowrap leading-none">
                {product.price}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Action Buttons */}
        <div className="mt-auto flex items-center gap-2">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()} // Blocks redirection when clicking WhatsApp
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg md:rounded-xl bg-[#25D366] px-2 py-2.5 md:px-3 text-[11px] md:text-xs font-semibold text-white transition-all duration-300 hover:bg-[#1da851] hover:shadow-md"
          >
            <WhatsAppIcon size={14} /> 
            <span>Inquire</span>
          </a>
          
          <button
            onClick={(e) => {
              e.stopPropagation(); // Blocks redirection when clicking Add to Cart
              onCart(product.id);
            }}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg md:rounded-xl px-2 py-2.5 md:px-3 text-[11px] md:text-xs font-semibold transition-all duration-300 ${
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