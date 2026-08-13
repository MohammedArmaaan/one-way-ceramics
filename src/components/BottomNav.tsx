import { motion } from 'framer-motion';
import { Grid3x3, Package, Phone, Home, Heart, ShoppingBag } from 'lucide-react';
import { useNav, type PageId } from '@/nav';

const TABS: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home size={20} strokeWidth={1.6} /> },
  { id: 'collection', label: 'Collection', icon: <Grid3x3 size={20} strokeWidth={1.6} /> },
  { id: 'products', label: 'Products', icon: <Package size={20} strokeWidth={1.6} /> },
  { id: 'wishlist', label: 'Wishlist', icon: <Heart size={20} strokeWidth={1.6} /> },
  { id: 'cart', label: 'Cart', icon: <ShoppingBag size={20} strokeWidth={1.6} /> },
  { id: 'contact', label: 'Contact', icon: <Phone size={20} strokeWidth={1.6} /> },
];

interface BottomNavProps {
  cartCount?: number;
  wishlistCount?: number;
}

export default function BottomNav({ cartCount = 0, wishlistCount = 0 }: BottomNavProps) {
  const { page, navigate } = useNav();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-3 mb-3 rounded-2xl bg-ink/90 backdrop-blur-xl border border-white/10 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex items-stretch justify-around">
          {TABS.map((tab) => {
            const isActive = page === tab.id;
            
            let badgeCount = 0;
            if (tab.id === 'wishlist') badgeCount = wishlistCount;
            if (tab.id === 'cart') badgeCount = cartCount;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  // --- FIX: Update browser URL dynamically ---
                  const newPath = tab.id === 'home' ? '/' : `/${tab.id}`;
                  window.history.pushState({}, '', newPath);
                  window.dispatchEvent(new Event('popstate'));
                  // -------------------------------------------
                  navigate(tab.id);
                }}
                className="relative flex flex-1 flex-col items-center gap-1 py-3 transition-colors"
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-cobalt-light' : 'text-ivory/55'
                    }`}
                  >
                    {tab.icon}
                  </span>
                  
                  {badgeCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-blue-600 px-[4px] text-[8px] font-bold text-white shadow-sm ring-1 ring-ink/90">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-cobalt-light' : 'text-ivory/55'
                  }`}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-dot"
                    className="absolute -top-0.5 h-1 w-6 rounded-full bg-cobalt-light"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}