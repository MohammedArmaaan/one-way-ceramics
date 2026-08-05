import { useLenis } from '@/hooks/useLenis';
import { NavProvider, useNav } from '@/nav';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import Nav from '@/components/Nav';
import BottomNav from '@/components/BottomNav';
import Hero from '@/components/Hero';
import BrandsStrip from '@/components/BrandsStrip';
import Features from '@/components/Features';
import CategoryShowcase from '@/components/CategoryShowcase';
import GalleryScroll from '@/components/GalleryScroll';
import Process from '@/components/Process';
import ClosingCTA from '@/components/ClosingCTA';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import ProductsPage from '@/pages/ProductsPage';
import CollectionPage from '@/pages/CollectionPage';
import ProcessPage from '@/pages/ProcessPage';
import WhyUsPage from '@/pages/WhyUsPage';
import ContactPage from '@/pages/ContactPage';

function Home() {
  return (
    <main>
      <Hero />
      <BrandsStrip />
      <Features />
      <CategoryShowcase />
      <GalleryScroll />
      <Process />
      <ClosingCTA />
      <Contact />
    </main>
  );
}

function PageRouter() {
  const { page } = useNav();

  switch (page) {
    case 'products':
      return <main><ProductsPage /></main>;
    case 'collection':
      return <main><CollectionPage /></main>;
    case 'process':
      return <main><ProcessPage /></main>;
    case 'why-us':
      return <main><WhyUsPage /></main>;
    case 'contact':
      return <main><ContactPage /></main>;
    default:
      return <Home />;
  }
}

function AppContent() {
  useLenis();

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Nav />
      <PageRouter />
      <Footer />
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <NavProvider>
      <AppContent />
    </NavProvider>
  );
}
