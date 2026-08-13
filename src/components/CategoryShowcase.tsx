import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { ParallaxImage, Reveal } from './motion';
import { useNav } from '@/nav';
import MagneticButton from './MagneticButton';

// 10 Items perfectly aligned for 2-column mobile and responsive desktop grids
const DISPLAY_CATEGORIES = [
  {
    name: 'Shop All',
    desc: 'Explore our complete collection of handcrafted ceramics.',
    image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop',
    tag: 'Entire Catalog',
    span: 'col-span-1 lg:col-span-4',
    tall: true,
  },
  {
    name: 'Tableware',
    desc: 'Plates, bowls, and everyday pieces.',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    tall: true,
  },
  {
    name: 'Mugs & Cups',
    desc: 'Your daily coffee companions.',
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    tall: true,
  },
  {
    name: 'Vases & Decor',
    desc: 'Sculptural pieces for your space.',
    image: 'https://theknottyrope.com/cdn/shop/files/WhiteRibbedEarthenVase_Single_1copy.png?v=1773851208&width=1000',
    span: 'col-span-1 lg:col-span-6',
    tall: false,
  },
  {
    name: 'Planters',
    desc: 'Earthy homes for green friends.',
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-6',
    tall: false,
  },
  {
    name: 'Handmade Tiles',
    desc: 'Artistic surfaces for your walls.',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    tall: false,
  },
  {
    name: 'Pitchers & Jugs',
    desc: 'Elegant pouring for every occasion.',
    image: 'https://m.media-amazon.com/images/I/51jpRZEEKvL._SX679_.jpg',
    span: 'col-span-1 lg:col-span-4',
    tall: false,
  },
  {
    name: 'Serving Platters',
    desc: 'Make your gatherings special.',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-4',
    tall: false,
  },
  {
    name: 'Sculptures',
    desc: 'Abstract art in ceramic form.',
    image: 'https://images.unsplash.com/photo-1613904985222-0d534430bdbd?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-6',
    tall: true,
  },
  {
    name: 'Candle Holders',
    desc: 'Set the mood with ambient lighting.',
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop',
    span: 'col-span-1 lg:col-span-6',
    tall: true,
  }
];

export default function CategoryShowcase() {
  const { navigate } = useNav();

  // Redirect to specific filtered category or 'all'
  const handleCategoryClick = (categoryName: string) => {
    const filterId = categoryName === 'Shop All' ? 'all' : categoryName;
    const newPath = `/products?category=${encodeURIComponent(filterId)}`;
    
    window.history.pushState({}, '', newPath);
    window.dispatchEvent(new Event('popstate'));
    navigate('products');
  };

  // Redirect to main Collections Page
  const handleViewAll = () => {
    const newPath = '/collection';
    window.history.pushState({}, '', newPath);
    window.dispatchEvent(new Event('popstate'));
    navigate('collection');
  };

  return (
    <section
      id="collections"
      className="bg-ivory-soft py-24 md:py-32 border-t border-ink-line/50"
    >
      <div className="container-px">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-16">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow text-cobalt mb-4 md:mb-5">The Catalogue</p>
            </Reveal>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif italic text-4xl md:text-6xl text-ink leading-[1.05]"
            >
              Every surface, <span className="text-sage-deep">sorted.</span>
            </motion.h2>
          </div>
          <Reveal delay={0.1}>
            <p className="text-ink-muted max-w-sm text-sm leading-relaxed">
              From the coffee table to the kitchen shelf — find the right
              piece, glaze and size for every corner of your home.
            </p>
          </Reveal>
        </div>

        {/* 10 Categories Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-3 md:gap-6 mb-16">
          {DISPLAY_CATEGORIES.map((c, i) => (
            <motion.button
              key={c.name}
              onClick={() => handleCategoryClick(c.name)}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.8,
                delay: (i % 2) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              /* FIXED UNIFORM HEIGHT (h-[250px]) FOR MOBILE, DYNAMIC FOR DESKTOP */
              className={`group relative overflow-hidden rounded-2xl md:rounded-3xl text-left block w-full h-[250px] ${c.span} ${
                c.tall ? 'md:h-[560px]' : 'md:h-[440px]'
              }`}
              data-cursor="hover"
            >
              <ParallaxImage
                src={c.image}
                alt={c.name}
                strength={50}
                className="absolute inset-0 h-full w-full"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent md:from-ink/90 md:via-ink/25" />
              
              {c.tag && (
                <span className="absolute top-3 left-3 md:top-5 md:left-5 rounded-full bg-ivory/90 backdrop-blur px-2.5 py-1 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-medium text-ink shadow-sm">
                  {c.tag}
                </span>
              )}
              
              <div className="absolute inset-0 p-4 md:p-9 flex flex-col justify-end">
                <div className="flex items-end justify-between gap-2 md:gap-4">
                  <div>
                    <h3 className="font-sans font-bold text-lg md:text-3xl text-ivory tracking-tight leading-tight">
                      {c.name}
                    </h3>
                    <p className="mt-1 md:mt-2 text-[11px] md:text-sm text-ivory/70 max-w-md leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                      {c.desc}
                    </p>
                  </div>
                  <span className="flex h-8 w-8 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-ivory group-hover:bg-cobalt group-hover:border-cobalt group-hover:rotate-45 transition-all duration-500">
                    <ArrowUpRight className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={1.6} />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <MagneticButton>
            <button 
              onClick={handleViewAll}
              className="flex items-center gap-3 px-8 py-4 rounded-full bg-ink text-ivory font-medium tracking-wide hover:bg-cobalt transition-colors duration-300 shadow-xl"
            >
              View All Collections <ArrowRight size={18} />
            </button>
          </MagneticButton>
        </motion.div>
        
      </div>
    </section>
  );
}