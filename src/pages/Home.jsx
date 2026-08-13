import Hero from '@/components/Hero';
import BrandsStrip from '@/components/BrandsStrip';
import CategoryShowcase from '@/components/CategoryShowcase';
import GalleryScroll from '@/components/GalleryScroll';
import ClosingCTA from '@/components/ClosingCTA';
import Contact from '@/components/Contact';
import CategoryProducts from '@/components/Category-Products';
import NewArrivals from '@/components/New-Arrivals';

export default function Home() {
  return (
    <main>
      <Hero />
      <BrandsStrip />
      {/* <Features /> */}
      <CategoryShowcase />
      <NewArrivals />
      <CategoryProducts />
      <GalleryScroll />
      {/* <Process /> */}
      <ClosingCTA />
      <Contact />
    </main>
  );
}