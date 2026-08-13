import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ParallaxImage, Reveal } from '@/components/motion';
import { useNav } from '@/nav';

// Total 10 Categories including "Shop All"
// Desktop Layout (12-column grid math):
// Row 1: 8 + 4 = 12 (Height: 500px)
// Row 2: 4 + 4 + 4 = 12 (Height: 400px)
// Row 3: 6 + 6 = 12 (Height: 450px)
// Row 4: 4 + 4 + 4 = 12 (Height: 440px)
const COLLECTION_CATEGORIES = [
  {
    id: 'all',
    name: 'Shop All',
    desc: 'Explore our complete collection of handcrafted ceramics for every corner of your home.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1200&auto=format&fit=crop',
    tag: 'Entire Catalog',
    span: 'col-span-1 lg:col-span-8',
    desktopHeight: 'lg:h-[500px]',
  },
  {
    id: 'Tableware',
    name: 'Tableware',
    desc: 'Plates, bowls, and everyday pieces.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    desktopHeight: 'lg:h-[500px]',
  },
  {
    id: 'Mugs & Cups',
    name: 'Mugs & Cups',
    desc: 'Your daily coffee companions.',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    desktopHeight: 'lg:h-[400px]',
  },
  {
    id: 'Vases & Decor',
    name: 'Vases & Decor',
    desc: 'Sculptural pieces for your space.',
    image: 'https://theknottyrope.com/cdn/shop/files/WhiteRibbedEarthenVase_Single_1copy.png?v=1773851208&width=1000',
    span: 'col-span-1 lg:col-span-4',
    desktopHeight: 'lg:h-[400px]',
  },
  {
    id: 'Planters',
    name: 'Planters',
    desc: 'Earthy homes for green friends.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    desktopHeight: 'lg:h-[400px]',
  },
  {
    id: 'Handmade Tiles',
    name: 'Handmade Tiles',
    desc: 'Artistic surfaces for your walls.',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-6',
    desktopHeight: 'lg:h-[450px]',
  },
  {
    id: 'Pitchers & Jugs',
    name: 'Pitchers & Jugs',
    desc: 'Elegant pouring for every occasion.',
    image: 'https://m.media-amazon.com/images/I/51jpRZEEKvL._SX679_.jpg',
    span: 'col-span-1 lg:col-span-6',
    desktopHeight: 'lg:h-[450px]',
  },
  {
    id: 'Serving Platters',
    name: 'Serving Platters',
    desc: 'Make your gatherings special.',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    desktopHeight: 'lg:h-[440px]',
  },
  {
    id: 'Sculptures',
    name: 'Sculptures',
    desc: 'Abstract art in ceramic form.',
    image: 'https://images.unsplash.com/photo-1613904985222-0d534430bdbd?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    desktopHeight: 'lg:h-[440px]',
  },
  {
    id: 'Candle Holders',
    name: 'Candle Holders',
    desc: 'Set the mood with ambient lighting.',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    desktopHeight: 'lg:h-[440px]',
  }
];

export default function CollectionPage() {
  const { navigate } = useNav();

  const handleCategoryClick = (categoryId: string) => {
    const newPath = `/products?category=${encodeURIComponent(categoryId)}`;
    window.history.pushState({}, '', newPath);
    window.dispatchEvent(new Event('popstate'));
    navigate('products');
  };

  return (
    <div className="bg-ivory-soft min-h-screen pt-28 md:pt-32 pb-20">
      {/* Header Section */}
      <div className="container-px mb-10 md:mb-16">
        <Reveal>
          <p className="eyebrow text-cobalt mb-3 md:mb-4">The Catalogue</p>
        </Reveal>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-4xl md:text-6xl text-ink leading-[1.05]"
        >
          Every surface, <span className="text-sage-deep">sorted.</span>
        </motion.h1>
      </div>

      {/* Grid Section */}
      <div className="container-px">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-6">
          {COLLECTION_CATEGORIES.map((c, i) => (
            <motion.button
              key={c.name}
              onClick={() => handleCategoryClick(c.id)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              // Mobile height: 280px | Tablet height: 350px | Desktop height: custom mapped
              className={`group relative overflow-hidden rounded-2xl lg:rounded-[2rem] text-left h-[280px] md:h-[350px] ${c.span} ${c.desktopHeight}`}
            >
              <ParallaxImage
                src={c.image}
                alt={c.name}
                strength={40}
                className="absolute inset-0 h-full w-full"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent transition-opacity duration-500 group-hover:from-ink" />
              
              {c.tag && (
                <span className="absolute top-4 left-4 lg:top-6 lg:left-6 rounded-full bg-ivory/90 backdrop-blur px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-bold text-ink shadow-sm">
                  {c.tag}
                </span>
              )}
              
              <div className="absolute inset-0 p-5 lg:p-10 flex flex-col justify-end">
                <div className="flex items-end justify-between gap-4">
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                    <h3 className="font-sans font-bold text-2xl lg:text-4xl text-ivory tracking-tight leading-tight">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-xs lg:text-sm text-ivory/70 max-w-sm leading-relaxed opacity-0 md:opacity-100 line-clamp-2 md:line-clamp-none transition-opacity duration-500 group-hover:text-ivory/90">
                      {c.desc}
                    </p>
                  </div>
                  
                  <span className="flex h-10 w-10 lg:h-12 lg:w-12 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-ivory group-hover:bg-cobalt group-hover:border-cobalt group-hover:rotate-45 transition-all duration-500 shadow-lg">
                    <ArrowUpRight className="w-5 h-5" strokeWidth={2} />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}