import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, HeartOff, ShoppingBag, ArrowRight } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';
import { PRODUCTS, type Product } from '@/data'; // Real data import karein

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

  // Agar 30 din ho chuke hain toh expire karein
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

export default function WishlistPage() {
  // 1. LocalStorage se Wishlist IDs fetch karein
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => getStorageWithExpiry('user_wishlist'));

  // 2. IDs ko map karke real products set karein
  const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
    const items: Product[] = [];
    wishlistIds.forEach((id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (product) items.push(product);
    });
    return items;
  });

  // 3. Jab Wishlist update ho, localStorage me save karein (30 days limit ke sath)
  useEffect(() => {
    setStorageWithExpiry('user_wishlist', wishlistIds);
  }, [wishlistIds]);

  const removeFromWishlist = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Redirect rokne ke liye

    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    setWishlistIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const moveToCart = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Card click redirect rukega

    // 1. Current cart ko storage se nikalein aur naya item add karein
    const currentCart = getStorageWithExpiry('user_cart');
    currentCart.add(id);
    
    // 2. Cart storage update karein taaki BottomNav aur Cart page dono sync ho jayein
    setStorageWithExpiry('user_cart', currentCart);

    // 3. Item ko current Wishlist page se hata dein
    removeFromWishlist(id);
  };

  // Product Redirect Logic
  const handleProductClick = (id: string) => {
    window.location.href = `/product/${id}`;
    // Agar React Router hai toh: navigate(`/product/${id}`)
  };

  return (
    <section className="min-h-screen bg-ink pt-28 pb-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-10"
        >
          <Heart size={32} strokeWidth={1.5} className="text-clay fill-clay" />
          <h1 className="font-serif italic text-4xl md:text-5xl text-ivory drop-shadow-md">
            Wishlist
          </h1>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
            <HeartOff size={48} className="text-ivory/20 mb-4" strokeWidth={1} />
            <h2 className="font-serif italic text-2xl text-ivory mb-2">Nothing to see here</h2>
            <p className="text-ivory/50 mb-6">Save your favorite pieces for later.</p>
            <MagneticButton>
              <button 
                onClick={() => window.location.href = '/products'}
                className="flex items-center gap-2 py-3 px-6 rounded-full bg-clay text-white font-medium hover:bg-clay/90 transition-colors"
              >
                Explore Collection <ArrowRight size={16} />
              </button>
            </MagneticButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={() => handleProductClick(item.id)} // Product detail pe redirect
                  className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col cursor-pointer hover:border-white/20 hover:shadow-xl transition-all"
                >
                  {/* Remove Button (Absolute) */}
                  <button
                    onClick={(e) => removeFromWishlist(item.id, e)}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-ink/50 backdrop-blur-md text-ivory hover:bg-clay hover:text-white transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={16} className="fill-current" />
                  </button>

                  {/* Image */}
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Details & CTA */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-ivory font-medium text-lg leading-tight mb-1">{item.name}</h3>
                    
                    {/* Check for proper price format rendering */}
                    <p className="text-cobalt-light mb-4 font-medium">
                      {typeof item.price === 'number' ? `₹${item.price.toLocaleString()}` : item.price}
                    </p>
                    
                    <div className="mt-auto pt-2">
                      <button
                        onClick={(e) => moveToCart(item.id, e)}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-ivory hover:bg-white/10 hover:border-white/40 transition-all text-sm font-medium tracking-wide uppercase"
                      >
                        <ShoppingBag size={16} /> Move to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}