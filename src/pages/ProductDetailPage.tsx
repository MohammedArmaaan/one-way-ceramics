import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingBag, Check, Share2, MessageCircle, Ruler, Paintbrush } from 'lucide-react';
import { PRODUCTS, BUSINESS, type Product } from '@/data';
import { useNav } from '@/nav'; 

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

export default function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const [cartSet, setCartSet] = useState<Set<string>>(new Set());
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(new Set());
  
  const { navigate } = useNav(); 

  useEffect(() => {
    window.scrollTo(0, 0);

    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1]; 

    const foundProduct = PRODUCTS.find((p) => p.id === productId || p.id.toString() === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);

      // CHANGED: slice(0, 3) ताकि डेस्कटॉप पर 3 कॉलम में बिल्कुल 3 कार्ड्स आएं
      const related = PRODUCTS.filter(
        (p) => p.category === foundProduct.category && p.id !== foundProduct.id
      ).slice(0, 3);
      setRelatedProducts(related);

      setCartSet(getStorageWithExpiry('user_cart'));
      setWishlistSet(getStorageWithExpiry('user_wishlist'));
    }
  }, []);

  const handleGoBack = () => {
    window.history.pushState({}, '', '/products');
    window.dispatchEvent(new Event('popstate'));
    navigate('products'); 
  };

  const handleRelatedClick = (id: string) => {
    window.location.href = `/product/${id}`;
  };

  const toggleCartItem = (id: string) => {
    const newCart = new Set(cartSet);
    if (newCart.has(id)) {
      newCart.delete(id);
    } else {
      newCart.add(id);
    }
    setCartSet(newCart);
    setStorageWithExpiry('user_cart', newCart);
  };

  const toggleWishlistItem = (id: string) => {
    const newWishlist = new Set(wishlistSet);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
    } else {
      newWishlist.add(id);
    }
    setWishlistSet(newWishlist);
    setStorageWithExpiry('user_wishlist', newWishlist);
  };

  const handleWhatsAppProduct = (p: Product) => {
    const waText = encodeURIComponent(
      `Hi ${BUSINESS.name}, I'm interested in "${p.name}" (${p.collection}, ${p.size}, ${p.finish}). Price: ${p.price}. Is it available?`
    );
    const phone = BUSINESS?.phoneHref?.replace(/\D/g, '') || '919999999999';
    window.open(`https://wa.me/${phone}?text=${waText}`, '_blank');
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out this beautiful ${product.name} from ${BUSINESS.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col items-center justify-center">
        <h2 className="text-2xl font-serif italic text-ink mb-4">Piece Not Found</h2>
        <button onClick={handleGoBack} className="text-cobalt underline transition-colors hover:text-ink">
          Return to Catalogue
        </button>
      </div>
    );
  }

  const isInCart = cartSet.has(product.id.toString());
  const isWished = wishlistSet.has(product.id.toString());

  return (
    <div className="bg-ivory min-h-screen pt-24 pb-32">
      <div className="max-w-6xl mx-auto px-5 md:px-8">
        
        {/* Top Navigation */}
        <button 
          onClick={handleGoBack} 
          className="group flex items-center gap-2 text-ink-muted hover:text-ink transition-colors mb-8 md:mb-12 text-sm font-medium w-fit"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> 
          Back to Catalogue
        </button>

        {/* --- MAIN PRODUCT SECTION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full aspect-[4/5] rounded-2xl md:rounded-[2rem] overflow-hidden bg-ivory-soft shadow-[0_24px_60px_-20px_rgba(28,28,26,0.15)] group"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            {product.badge && (
              <span className="absolute top-5 left-5 rounded-full bg-cobalt px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-ivory shadow-lg backdrop-blur-md">
                {product.badge}
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-5 right-5 flex items-center justify-center h-10 w-10 rounded-full bg-white/90 backdrop-blur-md text-ink/70 hover:text-ink hover:scale-105 shadow-sm transition-all duration-300"
              aria-label="Share product"
            >
              <Share2 size={18} strokeWidth={2} />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-ink/5 text-ink rounded-full text-[10px] font-bold uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-sage-deep font-semibold tracking-widest uppercase text-[11px]">
                {product.collection} Collection
              </span>
            </div>
            
            <h1 className="font-serif italic text-4xl md:text-5xl lg:text-6xl text-ink leading-[1.1] mb-5">
              {product.name}
            </h1>
            
            <div className="flex items-baseline gap-2 mb-8 md:mb-10">
              <span className="font-serif italic text-3xl text-ink">{product.price}</span>
              <span className="text-xs font-medium text-ink-muted uppercase tracking-wider">/ Piece</span>
            </div>

            <hr className="border-ink-line/40 mb-8" />

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-ink-muted"><Ruler size={18} /></div>
                <div>
                  <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wider mb-1">Dimensions</p>
                  <p className="text-ink font-medium text-sm">{product.size}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-ink-muted"><Paintbrush size={18} /></div>
                <div>
                  <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wider mb-1">Finish Type</p>
                  <p className="text-ink font-medium text-sm capitalize">{product.finish} Glaze</p>
                </div>
              </div>
              <div className="col-span-2 pt-2">
                <p className="text-[10px] text-ink-muted font-bold uppercase tracking-wider mb-2">About this piece</p>
                <p className="text-ink/80 text-sm leading-relaxed max-w-lg">
                  Carefully handcrafted ceramic piece belonging to our signature <em>{product.collection}</em> collection. 
                  Its {product.finish} finish makes it a perfect addition to any modern or traditional space. 
                  Due to its handmade nature, minor variations in size and color are to be expected and celebrated.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <button
                onClick={() => handleWhatsAppProduct(product)}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#25D366] text-white text-sm font-bold tracking-wide hover:bg-[#1da851] hover:shadow-[0_8px_24px_-8px_rgba(37,211,102,0.6)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <MessageCircle size={18} /> Inquire & Buy
              </button>

              <div className="flex gap-3 h-[52px] sm:h-auto">
                <button
                  onClick={() => toggleCartItem(product.id.toString())}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                    isInCart 
                      ? 'bg-[#4A6455] text-white shadow-md' 
                      : 'bg-ink text-ivory hover:bg-ink-soft'
                  }`}
                >
                  {isInCart ? <Check size={18} strokeWidth={2.5} /> : <ShoppingBag size={18} strokeWidth={2} />}
                  <span className="sm:hidden xl:inline">{isInCart ? 'Added' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={() => toggleWishlistItem(product.id.toString())}
                  className={`flex items-center justify-center aspect-square sm:aspect-auto sm:px-5 rounded-2xl border transition-all duration-300 ${
                    isWished
                      ? 'border-cobalt bg-cobalt text-white shadow-md'
                      : 'border-ink-line text-ink hover:border-cobalt hover:text-cobalt bg-white'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={18} strokeWidth={2} className={isWished ? 'fill-white' : 'fill-transparent'} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* --- RELATED PRODUCTS SECTION --- */}
        {relatedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.7 }}
            className="border-t border-ink-line/40 pt-16"
          >
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-serif italic text-3xl md:text-4xl text-ink">
                  You might also like
                </h2>
                <p className="text-ink-muted text-sm mt-2">More from the {product.category} collection</p>
              </div>
            </div>

            {/* CHANGED: grid-cols-2 for mobile, md:grid-cols-3 for desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {relatedProducts.map((p) => {
                const isRelInCart = cartSet.has(p.id.toString());
                const isRelWished = wishlistSet.has(p.id.toString());

                return (
                  <div 
                    key={p.id}
                    onClick={() => handleRelatedClick(p.id)}
                    // CHANGED: Adjusted border radius for mobile
                    className="group cursor-pointer flex flex-col h-full bg-white rounded-[16px] md:rounded-[24px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-[4/5] w-full shrink-0 bg-ivory-soft overflow-hidden">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      
                      {/* Badge */}
                      {p.badge && (
                        <span className="absolute top-2.5 left-2.5 md:top-4 md:left-4 rounded-full bg-cobalt px-2 py-0.5 md:px-3.5 md:py-1 text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                          {p.badge}
                        </span>
                      )}
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlistItem(p.id.toString());
                        }}
                        // CHANGED: Size adjusted for mobile (h-7 w-7 on small, h-8 w-8 on md)
                        className={`absolute top-2.5 right-2.5 md:top-4 md:right-4 flex items-center justify-center h-7 w-7 md:h-8 md:w-8 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 ${
                          isRelWished ? 'bg-cobalt' : 'bg-white'
                        }`}
                      >
                        <Heart 
                          size={14} 
                          strokeWidth={isRelWished ? 1 : 1.5} 
                          className={isRelWished ? "text-white fill-white" : "text-ink/70"} 
                        />
                      </button>
                    </div>
                    
                    {/* Content Section - Padding adjusted for mobile */}
                    <div className="flex flex-col flex-1 p-3 md:p-5 pt-3 md:pt-4">
                      {/* Top Row: Category & Details */}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-slate-500">
                          {p.category}
                        </span>
                        <span className="text-[9px] md:text-[10px] text-ink/50 capitalize">
                          {p.size || 'Small'}
                        </span>
                      </div>
                      
                      {/* Title & Finish */}
                      <h3 className="font-sans font-bold text-[13px] md:text-[15px] text-ink leading-tight group-hover:text-cobalt transition-colors line-clamp-1 mb-0.5">
                        {p.name}
                      </h3>
                      <p className="text-[9px] md:text-[11px] text-ink/50 capitalize mb-2 md:mb-4">
                         {p.finish || 'Textured'} Finish
                      </p>

                      {/* Price Row */}
                      <div className="flex items-baseline justify-between mt-auto mb-3 md:mb-4">
                        <span className="font-serif italic text-lg md:text-2xl text-ink whitespace-nowrap">
                          {p.price}
                        </span>
                        <span className="text-[8px] md:text-[10px] text-ink/40 tracking-wide">
                          per piece
                        </span>
                      </div>
                    
                      {/* Action Buttons Box */}
                      <div className="flex items-center gap-1.5 md:gap-2">
                        {/* Inquire Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppProduct(p);
                          }}
                          className="flex-1 flex items-center justify-center gap-1 md:gap-1.5 py-1.5 md:py-2.5 rounded-lg md:rounded-[10px] bg-[#25D366] text-white text-[11px] md:text-[13px] font-semibold tracking-wide hover:bg-[#1da851] transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 md:w-4 md:h-4" /> 
                          <span className="block">Inquire</span>
                        </button>

                        {/* Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCartItem(p.id.toString());
                          }}
                          className={`flex-1 flex items-center justify-center gap-1 md:gap-1.5 py-1.5 md:py-2.5 rounded-lg md:rounded-[10px] text-[11px] md:text-[13px] font-semibold tracking-wide transition-colors ${
                            isRelInCart
                              ? 'bg-[#4A6455] text-white' 
                              : 'bg-[#1C1C1A] text-white hover:bg-ink-soft'
                          }`}
                        >
                          {isRelInCart ? <Check className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2.5}/> : <ShoppingBag className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2}/>}
                          <span className="block">{isRelInCart ? 'Added' : 'Cart'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}