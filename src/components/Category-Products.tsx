import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag, Check } from 'lucide-react';
import { useNav } from '@/nav';
import { PRODUCTS, PRODUCT_CATEGORIES, Product, BUSINESS } from '@/data';

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

export default function HomeProductsShowcase() {
  const { navigate } = useNav();

  const [wishlist, setWishlist] = useState<Set<string>>(() => getStorageWithExpiry('user_wishlist'));
  const [cart, setCart] = useState<Set<string>>(() => getStorageWithExpiry('user_cart'));

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

  const handleViewCategory = (categoryName: string) => {
    const newPath = `/products?category=${encodeURIComponent(categoryName)}`;
    window.history.pushState({}, '', newPath);
    window.dispatchEvent(new Event('popstate'));
    navigate('products');
  };

  return (
    <section className="bg-ivory-soft py-24 md:py-32 border-t border-ink-line/50 overflow-hidden">
      <div className="container-px mx-auto mb-14 md:mb-24">
        <div className="max-w-3xl">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow text-cobalt mb-4 md:mb-6"
          >
            Featured Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif italic text-4xl sm:text-5xl md:text-7xl text-ink leading-[1.05] tracking-tight"
          >
            Curated by <span className="text-sage-deep">Category.</span>
          </motion.h2>
        </div>
      </div>

      <div className="flex flex-col gap-20 md:gap-32 w-full">
        {PRODUCT_CATEGORIES.map((category, index) => {
          const categoryProducts = PRODUCTS.filter((p) => p.category === category).slice(0, 8);
          if (categoryProducts.length === 0) return null;

          return (
            <CategoryRow
              key={category}
              category={category}
              products={categoryProducts}
              index={index}
              onViewAll={() => handleViewCategory(category)}
              wishlist={wishlist}
              cart={cart}
              toggleWish={toggleWish}
              toggleCart={toggleCart}
            />
          );
        })}
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// CATEGORY ROW COMPONENT
// ----------------------------------------------------------------------
function CategoryRow({
  category,
  products,
  index,
  onViewAll,
  wishlist,
  cart,
  toggleWish,
  toggleCart,
}: {
  category: string;
  products: Product[];
  index: number;
  onViewAll: () => void;
  wishlist: Set<string>;
  cart: Set<string>;
  toggleWish: (id: string) => void;
  toggleCart: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-50px' });

  const { scrollXProgress } = useScroll({ container: scrollRef });

  // Intelligent Drag State Tracking
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [dragDistance, setDragDistance] = useState(0);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsPointerDown(true);
    setDragDistance(0); // Reset distance on fresh click
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsPointerDown(false);
  const handleMouseUp = () => setIsPointerDown(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPointerDown || !scrollRef.current) return;
    e.preventDefault();
    
    const currentX = e.pageX - scrollRef.current.offsetLeft;
    const distanceMoved = Math.abs(currentX - startX);
    setDragDistance(distanceMoved);

    // Only physically scroll if mouse moves more than 5px
    if (distanceMoved > 5) {
      const walk = (currentX - startX) * 2;
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // If distance > 5px, it's considered a genuine drag, not a click.
  const isGenuineDrag = dragDistance > 5;

  return (
    <div ref={containerRef} className="container-px mx-auto w-full max-w-[1600px]">
      
      <div className="flex items-end justify-between mb-6 md:mb-10 w-full">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-3 md:gap-4"
        >
          <h3 className="text-3xl md:text-5xl font-serif text-ink tracking-tight">
            {category}
          </h3>
          <span className="hidden md:flex text-sm text-ink-muted font-medium mt-2">
            ({products.length})
          </span>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={onViewAll}
          className="group hidden md:flex items-center gap-2 text-sm font-semibold tracking-wide text-ink hover:text-cobalt transition-colors"
        >
          Explore All
          <span className="flex items-center justify-center h-7 w-7 rounded-full bg-ink/5 group-hover:bg-cobalt/10 transition-colors">
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </span>
        </motion.button>
      </div>

      <div className="relative w-full">
        <motion.div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`
            flex overflow-x-auto gap-4 md:gap-6 pb-6 w-full items-stretch
            ${isPointerDown ? 'cursor-grabbing' : 'cursor-grab'}
            max-md:snap-x max-md:snap-mandatory
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          `}
        >
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isDragging={isGenuineDrag}
              wished={wishlist.has(product.id)}
              inCart={cart.has(product.id)}
              onWish={toggleWish}
              onCart={toggleCart}
            />
          ))}

          <ViewAllTile category={category} onClick={onViewAll} isDragging={isGenuineDrag} />
        </motion.div>
      </div>

      <div className="w-full mt-2 md:mt-4">
        <div className="w-full h-[2px] md:h-[3px] bg-ink-line/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-ink origin-left rounded-full"
            style={{ scaleX: scrollXProgress }}
          />
        </div>
      </div>
      
      <div className="mt-8 md:hidden w-full">
         <button
          onClick={onViewAll}
          className="w-full py-3.5 rounded-xl border border-ink-line text-sm font-semibold text-ink flex items-center justify-center gap-2 hover:bg-ink/5 active:scale-[0.98] transition-all"
        >
          Explore All {category} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// PRODUCT CARD COMPONENT
// ----------------------------------------------------------------------
function ProductCard({ 
  product, 
  isDragging,
  wished,
  inCart,
  onWish,
  onCart 
}: { 
  product: Product; 
  isDragging: boolean;
  wished: boolean;
  inCart: boolean;
  onWish: (id: string) => void;
  onCart: (id: string) => void;
}) {
  const { navigate } = useNav();

  // Smart Navigation click handler
  const handleCardClick = (e: React.MouseEvent) => {
    if (isDragging) return; // Prevent navigation if the user was actively swiping/dragging
    
    window.history.pushState({}, '', `/product/${product.id}`);
    window.dispatchEvent(new Event('popstate'));
    navigate(`product/${product.id}`);
  };

  // Safe Button Click Handler to stop propagation and drags
  const handleAction = (e: React.MouseEvent, actionFn: () => void) => {
    e.stopPropagation(); 
    if (isDragging) {
      e.preventDefault(); 
      return;
    }
    actionFn();
  };

  const waText = encodeURIComponent(
    `Hi ${BUSINESS.name}, I'm interested in "${product.name}" (${product.collection}, ${product.size}, ${product.finish}). Price: ${product.price}. Is it available?`
  );
  const waHref = `https://wa.me/${BUSINESS.phoneHref.replace(/\D/g, '')}?text=${waText}`;

  return (
    <div 
      onClick={handleCardClick}
      // Removed pointer-events-none so it doesn't break hover/click events immediately
      className="max-md:snap-start shrink-0 w-[260px] md:w-[320px] group flex flex-col cursor-pointer"
    >
      <div className="relative w-full aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden bg-ivory mb-4 sm:mb-5 border border-ink-line/30 shadow-sm transition-all duration-500 group-hover:shadow-lg group-hover:border-ink-line/60 select-none">
        
        {product.badge && (
          <span className="absolute top-3 left-3 md:top-4 md:left-4 z-10 rounded-full bg-cobalt px-2.5 py-1 md:px-3 md:py-1.5 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-semibold text-ivory shadow-md">
            {product.badge}
          </span>
        )}

        <button
          onClick={(e) => handleAction(e, () => onWish(product.id))}
          className={`absolute top-3 right-3 md:top-4 md:right-4 flex h-8 w-8 md:h-10 md:w-10 z-20 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${
            wished
              ? 'bg-cobalt text-ivory'
              : 'bg-white/90 text-ink/60 hover:text-cobalt hover:bg-white hover:scale-105'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={wished ? 2.5 : 1.8} fill={wished ? 'currentColor' : 'none'} />
        </button>
        
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          draggable={false} 
          className="w-full h-full object-cover transition-transform duration-700 ease-[0.25,1,0.5,1] group-hover:scale-105 pointer-events-none"
        />
        
        <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/5 transition-colors duration-500" />
      </div>

      <div className="px-1 flex flex-col flex-1 justify-between items-start w-full">
        <div className="w-full">
          <div className="flex items-center justify-between w-full mb-1">
            <p className="text-[10px] md:text-xs text-ink-muted uppercase tracking-wider font-semibold">
              {product.collection}
            </p>
            <p className="text-[10px] md:text-xs text-ink-muted font-medium">
               {product.size}
            </p>
          </div>
          
          <div className="flex justify-between items-end w-full gap-2 mb-4 md:mb-5">
            <h4 className="font-sans font-bold text-sm md:text-lg text-ink leading-snug group-hover:text-cobalt transition-colors line-clamp-1">
              {product.name}
            </h4>
            <p className="font-serif italic text-base md:text-xl text-ink whitespace-nowrap">
              {product.price}
            </p>
          </div>
        </div>

        <div className="mt-auto flex items-center w-full gap-2">
          {/* WhatsApp Link handled safely */}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              if (isDragging) e.preventDefault();
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg md:rounded-xl bg-[#25D366] px-2 py-2.5 md:px-3 text-[11px] md:text-xs font-semibold text-white transition-all duration-300 hover:bg-[#1da851] hover:shadow-md"
          >
            <WhatsAppIcon size={14} /> 
            <span>Inquire</span>
          </a>
          
          <button
            onClick={(e) => handleAction(e, () => onCart(product.id))}
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
    </div>
  );
}

// ----------------------------------------------------------------------
// VIEW ALL TILE COMPONENT
// ----------------------------------------------------------------------
function ViewAllTile({ category, onClick, isDragging }: { category: string; onClick: () => void; isDragging: boolean }) {
  const handleClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    onClick();
  }

  return (
    <button
      onClick={handleClick}
      className="max-md:snap-start shrink-0 w-[240px] md:w-[320px] aspect-[4/5] rounded-xl md:rounded-2xl border border-ink-line/50 flex flex-col items-center justify-center gap-5 bg-ink/5 hover:bg-ink hover:text-ivory text-ink transition-all duration-500 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-cobalt translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
      
      <span className="relative z-10 flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full border border-current transition-transform duration-500 group-hover:scale-110 bg-ivory text-ink group-hover:border-transparent">
        <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
      </span>
      
      <div className="text-center relative z-10">
        <p className="font-serif italic text-2xl md:text-3xl mb-1 group-hover:text-ivory transition-colors">
          View All
        </p>
        <p className="text-xs tracking-[0.2em] opacity-70 uppercase font-medium group-hover:text-ivory/80 transition-colors">
          {category}
        </p>
      </div>
    </button>
  );
}