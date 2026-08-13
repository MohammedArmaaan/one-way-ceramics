import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react';
import MagneticButton from '../components/MagneticButton';
import { PRODUCTS, BUSINESS, type Product } from '@/data'; // Apne real data import karein

// ----------------------------------------------------------------------
// HELPER FUNCTIONS FOR 30-DAY LOCAL STORAGE (Same as ProductsPage)
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

// Extended Product type to include quantity
interface CartItem extends Product {
  quantity: number;
}

export default function CartPage() {
  // 1. LocalStorage se Cart IDs fetch karein
  const [cartIds, setCartIds] = useState<Set<string>>(() => getStorageWithExpiry('user_cart'));

  // 2. IDs ko map karke real products data aur default quantity (1) assign karein
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const items: CartItem[] = [];
    cartIds.forEach((id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      if (product) {
        items.push({ ...product, quantity: 1 });
      }
    });
    return items;
  });

  // 3. Jab bhi items remove hon, LocalStorage update karein taaki BottomNav count sync rahe
  useEffect(() => {
    setStorageWithExpiry('user_cart', cartIds);
  }, [cartIds]);

  // Quantity Update logic
  const updateQuantity = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Redirect rokne ke liye
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  // Item Remove logic
  const removeItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Redirect rokne ke liye
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setCartIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const total = cartItems.reduce((sum, item) => {
    // Agar price string (e.g., '₹3,200') me hai toh usko number me convert karein
    const numericPrice = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/\D/g, ''), 10) 
      : item.price;
    return sum + numericPrice * item.quantity;
  }, 0);

  // WhatsApp Checkout Format
  const handleWhatsAppCheckout = () => {
    const text = cartItems
      .map((item) => {
        const numericPrice = typeof item.price === 'string' ? parseInt(item.price.replace(/\D/g, ''), 10) : item.price;
        return `${item.quantity}x ${item.name} (${item.size}, ${item.finish}) - ₹${numericPrice * item.quantity}`;
      })
      .join('%0A');
      
    // BUSINESS object se phone number le rahe hain
    const phone = BUSINESS?.phoneHref?.replace(/\D/g, '') || '919999999999';
    window.open(
      `https://wa.me/${phone}?text=Hello! I would like to place an order for:%0A%0A${text}%0A%0ATotal: ₹${total.toLocaleString()}`,
      '_blank'
    );
  };

  // Product Redirect Logic
  const handleProductClick = (id: string) => {
    window.location.href = `/product/${id}`; 
    // Ya agar react-router use kar rahe ho toh navigate(`/product/${id}`) use karein
  };

  return (
    <section className="min-h-screen bg-ink pt-28 pb-32 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="font-serif italic text-4xl md:text-5xl text-ivory drop-shadow-md">
            Your Cart <span className="text-ivory/30 text-3xl">({cartItems.length})</span>
          </h1>
          <p className="text-ivory/50 mt-2 text-sm tracking-widest uppercase">Ready to hold your stories</p>
        </motion.div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm">
            <ShoppingBag size={48} className="text-ivory/20 mb-4" strokeWidth={1} />
            <h2 className="font-serif italic text-2xl text-ivory mb-2">Your cart is empty</h2>
            <p className="text-ivory/50 mb-6">Let's find some beautiful clay pieces for you.</p>
            <MagneticButton>
              <button 
                onClick={() => window.location.href = '/products'} 
                className="btn-clay flex items-center gap-2"
              >
                Explore Collection <ArrowRight size={16} />
              </button>
            </MagneticButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    onClick={() => handleProductClick(item.id)} // Product redirect event
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-ivory font-medium truncate">{item.name}</h3>
                      <p className="text-ivory/50 text-xs tracking-wider uppercase mt-1 truncate">
                        {item.collection}
                      </p>
                      <div className="text-cobalt-light mt-2">{item.price}</div>
                    </div>

                    <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-white/10 rounded-full px-3 py-1.5 border border-white/15">
                        <button 
                          onClick={(e) => updateQuantity(item.id, -1, e)} 
                          className="text-ivory/70 hover:text-ivory transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-ivory text-sm w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={(e) => updateQuantity(item.id, 1, e)} 
                          className="text-ivory/70 hover:text-ivory transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => removeItem(item.id, e)}
                        className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-24 h-fit p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <h3 className="font-serif italic text-2xl text-ivory mb-6 border-b border-white/10 pb-4">Summary</h3>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-ivory/70">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-ivory/70">
                  <span>Shipping</span>
                  <span className="text-cobalt-light text-xs tracking-widest uppercase">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-white/10 pt-4 mb-8">
                <span className="text-ivory/90 font-medium">Total</span>
                <span className="text-2xl text-ivory">₹{total.toLocaleString()}</span>
              </div>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-[#25D366] text-ink font-medium tracking-wide hover:bg-[#20b858] transition-colors shadow-[0_0_20px_rgba(37,211,102,0.3)]"
              >
                <MessageCircle size={20} /> Checkout via WhatsApp
              </button>
              <p className="text-center text-ivory/40 text-xs mt-4">
                You'll confirm your order directly with our team.
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}