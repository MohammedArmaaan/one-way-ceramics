import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ArrowUpRight, Heart, ShoppingBag } from 'lucide-react';
import { BUSINESS } from '@/data';
import MagneticButton from './MagneticButton';
import { useNav, type PageId } from '@/nav';

// --- Helper to read localStorage counts dynamically ---
const getStorageCount = (key: string) => {
  if (typeof window === 'undefined') return 0;
  try {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return 0;
    const item = JSON.parse(itemStr);
    if (new Date().getTime() > item.expiry) {
      localStorage.removeItem(key);
      return 0;
    }
    return Array.isArray(item.value) ? item.value.length : 0;
  } catch {
    return 0;
  }
};
// ------------------------------------------------------

interface NavProps {
  cartCount?: number;
  wishlistCount?: number;
}

const LINKS: { label: string; page: PageId }[] = [
  { label: 'Collection', page: 'collection' },
  { label: 'Products', page: 'products' },
  { label: 'Process', page: 'process' },
  { label: 'Why Us', page: 'why-us' },
  { label: 'Contact', page: 'contact' },
];

export default function Nav({ cartCount = 0, wishlistCount = 0 }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // States to hold the live counts
  const [currentCartCount, setCurrentCartCount] = useState(cartCount);
  const [currentWishlistCount, setCurrentWishlistCount] = useState(wishlistCount);
  
  const { page, navigate } = useNav();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // --- Live Sync Logic for Cart & Wishlist ---
  useEffect(() => {
    const syncCounts = () => {
      const localCart = getStorageCount('user_cart');
      const localWish = getStorageCount('user_wishlist');
      
      setCurrentCartCount(localCart > 0 ? localCart : cartCount);
      setCurrentWishlistCount(localWish > 0 ? localWish : wishlistCount);
    };

    syncCounts(); // Initial load
    const interval = setInterval(syncCounts, 500); // Auto-update every 500ms
    window.addEventListener('storage', syncCounts); // Listen across tabs

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', syncCounts);
    };
  }, [cartCount, wishlistCount]);
  // ---------------------------------------------

  const go = (p: PageId) => {
    const newPath = p === 'home' ? '/' : `/${p}`;
    window.history.pushState({}, '', newPath);
    window.dispatchEvent(new Event('popstate')); 
    navigate(p);
    setOpen(false);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8"
        style={{ paddingTop: scrolled ? '0.6rem' : '1rem' }}
      >
        <div
          className={`mx-auto max-w-6xl flex items-center justify-between rounded-full transition-all duration-500 ${
            scrolled || page !== 'home'
              ? 'bg-ivory/85 backdrop-blur-xl border border-ink-line/50 shadow-[0_10px_40px_-15px_rgba(28,28,26,0.25)] px-5 py-2.5'
              : 'bg-white/10 backdrop-blur-md border border-white/15 px-5 py-3'
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => go('home')}
            className="flex items-center gap-2.5 group shrink-0"
            aria-label="One Way Ceramic home"
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full font-serif text-lg italic transition-all duration-500 group-hover:rotate-[-8deg] ${
                scrolled || page !== 'home' ? 'bg-ink text-ivory' : 'bg-ivory text-ink'
              }`}
            >
              o
            </span>
            <span
              className={`font-semibold tracking-tight text-[15px] transition-colors duration-500 ${
                scrolled || page !== 'home' ? 'text-ink' : 'text-ivory'
              }`}
            >
              One Way <span className="text-cobalt">Ceramic</span>
            </span>
          </button>

          {/* Center links (desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {LINKS.map((l) => (
              <button
                key={l.page}
                onClick={() => go(l.page)}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 group/link ${
                  scrolled || page !== 'home'
                    ? 'text-ink/70 hover:text-cobalt'
                    : 'text-ivory/80 hover:text-ivory'
                } ${page === l.page ? '!text-cobalt' : ''}`}
              >
                {l.label}
                <span
                  className={`absolute left-4 right-4 -bottom-0.5 h-px origin-left transition-transform duration-300 ${
                    page === l.page ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'
                  } ${scrolled || page !== 'home' ? 'bg-cobalt' : 'bg-ivory'}`}
                />
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* --- WISHLIST & CART ICONS --- */}
            <div className="flex items-center gap-3.5 lg:gap-4 mr-1">
              <button
                onClick={() => go('wishlist')}
                className={`relative flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  scrolled || page !== 'home' ? 'text-ink/80 hover:text-cobalt' : 'text-ivory/90 hover:text-ivory'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={20} strokeWidth={1.8} />
                {currentWishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-cobalt px-1 text-[9px] font-bold text-white shadow-sm">
                    {currentWishlistCount > 99 ? '99+' : currentWishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => go('cart')}
                className={`relative flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  scrolled || page !== 'home' ? 'text-ink/80 hover:text-cobalt' : 'text-ivory/90 hover:text-ivory'
                }`}
                aria-label="Cart"
              >
                <ShoppingBag size={20} strokeWidth={1.8} />
                {currentCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-cobalt px-1 text-[9px] font-bold text-white shadow-sm">
                    {currentCartCount > 99 ? '99+' : currentCartCount}
                  </span>
                )}
              </button>
              
              {/* Separator line */}
              <span className={`hidden lg:block h-5 w-px ml-2 transition-colors duration-500 ${scrolled || page !== 'home' ? 'bg-ink-line' : 'bg-white/20'}`}></span>
            </div>
            {/* ------------------------------------- */}

            <a
              href={`tel:${BUSINESS.phoneHref}`}
              className={`hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors duration-300 ${
                scrolled || page !== 'home' ? 'text-ink/70 hover:text-cobalt' : 'text-ivory/80 hover:text-ivory'
              }`}
            >
              <Phone size={15} strokeWidth={1.7} />
              <span className="hidden md:inline">{BUSINESS.phone}</span>
            </a>

            <MagneticButton className="hidden md:block">
              <button
                onClick={() => go('contact')}
                className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-500 ${
                  scrolled || page !== 'home'
                  ? 'bg-cobalt text-ivory hover:bg-cobalt-deep hover:shadow-[0_12px_36px_-12px_rgba(43,94,167,0.7)]'
                  : 'bg-ivory text-ink hover:bg-cobalt hover:text-ivory'
                }`}
              >
                Get a Quote <ArrowUpRight size={15} strokeWidth={1.8} />
              </button>
            </MagneticButton>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(true)}
              className={`lg:hidden flex items-center gap-2 text-sm font-medium transition-colors ${
                scrolled || page !== 'home' ? 'text-ink/80 hover:text-cobalt' : 'text-ivory/90 hover:text-ivory'
              }`}
              aria-label="Open menu"
            >
              <Menu size={20} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Overlay menu (mobile/tablet) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-ink/60 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-ink text-ivory flex flex-col"
              data-cursor-dark="true"
            >
              <div className="flex items-center justify-between px-8 py-7 border-b border-white/10">
                <span className="font-serif italic text-2xl">Menu</span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="text-ivory/70 hover:text-cobalt-light transition-colors"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-col px-8 py-6">
                <button
                  onClick={() => go('home')}
                  className="group flex items-baseline gap-4 py-4 border-b border-white/5 text-left"
                >
                  <span className="text-xs text-cobalt-light font-mono">00</span>
                  <span className="font-serif italic text-3xl md:text-4xl text-ivory/90 group-hover:text-cobalt-light group-hover:translate-x-2 transition-all duration-300">
                    Home
                  </span>
                </button>
                {LINKS.map((l, i) => (
                  <motion.button
                    key={l.page}
                    onClick={() => go(l.page)}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-baseline gap-4 py-4 border-b border-white/5 text-left"
                  >
                    <span className="text-xs text-cobalt-light font-mono">0{i + 1}</span>
                    <span className="font-serif italic text-3xl md:text-4xl text-ivory/90 group-hover:text-cobalt-light group-hover:translate-x-2 transition-all duration-300">
                      {l.label}
                    </span>
                  </motion.button>
                ))}
              </div>
              <div className="mt-auto px-8 pb-10 flex flex-col gap-4">
                <a
                  href={`tel:${BUSINESS.phoneHref}`}
                  className="flex items-center gap-3 text-ivory/80 hover:text-cobalt-light transition-colors"
                >
                  <Phone size={18} strokeWidth={1.5} />
                  <span className="text-lg">{BUSINESS.phone}</span>
                </a>
                <button onClick={() => go('contact')} className="btn-clay justify-center">
                  Book a Visit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}