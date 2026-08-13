import { useEffect, useState } from 'react';
import { useLenis } from '@/hooks/useLenis';
import { NavProvider, useNav } from '@/nav';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import Nav from '@/components/Nav';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';

// --- SEPARATE PAGES IMPORTS ---
import Home from '@/pages/Home';
import ProductsPage from '@/pages/ProductsPage';
import CollectionPage from '@/pages/CollectionPage';
import ProcessPage from '@/pages/ProcessPage';
import WhyUsPage from '@/pages/WhyUsPage';
import WishlistPage from '@/pages/WishlistPage';
import CartPage from '@/pages/CartPage';
import ContactPage from '@/pages/ContactPage';
import ProductDetailPage from '@/pages/ProductDetailPage';

// --- STATIC PAGE ROUTER ---
function PageRouter() {
  const { page } = useNav();
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  if (currentPath.startsWith('/product/')) {
    return (
      <main>
        <ProductDetailPage />
      </main>
    );
  }

  if (currentPath === '/products') return <main><ProductsPage /></main>;
  if (currentPath === '/process') return <main><ProcessPage /></main>;
  if (currentPath === '/why-us') return <main><WhyUsPage /></main>;
  if (currentPath === '/cart') return <main><CartPage /></main>;
  if (currentPath === '/wishlist') return <main><WishlistPage /></main>;
  if (currentPath === '/collection') return <main><CollectionPage /></main>;
  if (currentPath === '/contact') return <main><ContactPage /></main>;

  switch (page) {
    case 'home':
      return <main><Home /></main>;
    case 'products':
      return <main><ProductsPage /></main>;
    case 'process':
      return <main><ProcessPage /></main>;
    case 'why-us':
      return <main><WhyUsPage /></main>;
    case 'collection':
      return <main><CollectionPage /></main>;
    case 'wishlist':
      return <main><WishlistPage /></main>;
    case 'cart':
      return <main><CartPage /></main>;
    case 'contact':
      return <main><ContactPage /></main>;
    default:
      if (currentPath === '/') return <main><Home /></main>;
      return <main><Home /></main>;
  }
}

// --- MAIN APP LAYOUT ---
function AppContent() {
  useLenis();
  
  // LocalStorage se count nikal kar BottomNav ko pass karne ka logic
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    // Har 500ms me local storage check karega taaki navigation tab update rahe
    const interval = setInterval(() => {
      const cartData = localStorage.getItem('user_cart');
      const wishlistData = localStorage.getItem('user_wishlist');
      
      if (cartData) setCartCount(JSON.parse(cartData).value.length);
      if (wishlistData) setWishlistCount(JSON.parse(wishlistData).value.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      
      {/* Global Header */}
      <Nav />
      
      {/* Dynamic Content based on Custom Router */}
      <PageRouter />
      
      {/* Global Footers */}
      <Footer />
      <BottomNav cartCount={cartCount} wishlistCount={wishlistCount} />
    </>
  );
}

// --- PROVIDER WRAPPER ---
export default function App() {
  return (
    <NavProvider>
      <AppContent />
    </NavProvider>
  );
}