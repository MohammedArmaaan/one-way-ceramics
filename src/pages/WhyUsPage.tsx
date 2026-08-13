import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hand,
  Heart,
  Palette,
  Sparkles,
  Store,
  FlaskConical,
  ChevronDown,
} from 'lucide-react';
import { FEATURES } from '@/data';

const ICONS = { Hand, Heart, Palette, Sparkles, Store, FlaskConical } as const;

// हर फीचर के लिए अलग कॉम्पोनेंट ताकि "Read more" का स्टेट अलग-अलग काम करे
const FeatureRow = ({ f, index, isEven }: { f: any, index: number, isEven: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = ICONS[f.icon as keyof typeof ICONS];

  return (
    <div className={`flex flex-col gap-10 md:gap-16 lg:gap-24 items-center ${
      isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
    }`}>
      {/* Image Side */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 40 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:w-1/2 relative group"
      >
        <div className="relative h-[400px] md:h-[550px] w-full rounded-[2rem] overflow-hidden">
          <img
            src={f.image}
            alt={f.title}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-ink/10 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
        </div>
        
        {/* Floating Number */}
        <div className={`absolute -top-6 md:-top-10 ${isEven ? '-left-4 md:-left-8' : '-right-4 md:-right-8'} -z-10`}>
           <span className="font-serif text-[120px] md:text-[180px] leading-none text-ink/5 select-none">
             {f.index}
           </span>
        </div>
      </motion.div>

      {/* Text Side */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full lg:w-1/2 flex flex-col justify-center"
      >
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory border border-ink/10 text-cobalt shadow-sm">
            <Icon size={20} strokeWidth={1.5} />
          </span>
          <span className="text-ink/50 font-mono text-sm tracking-widest uppercase">
            Feature {f.index}
          </span>
        </div>

        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.1] mb-6">
          {f.title}
        </h2>
        
        {/* Main Body Text */}
        <p className="text-base md:text-lg text-ink/70 leading-relaxed mb-2 max-w-lg">
          {f.body}
        </p>

        {/* Expandable Details Section */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden max-w-lg"
            >
              <p className="text-base md:text-lg text-ink/80 leading-relaxed pb-6 border-b border-ink/10">
                {/* अगर आपके डेटा में details नहीं है, तो यह डमी टेक्स्ट दिखेगा */}
                {f.details || "Here you can add more in-depth information about your craftsmanship, materials used, or the specific process that makes this feature unique. Update your FEATURES data to include a 'details' property."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Read More / Read Less Button */}
        <div className={`transition-all duration-500 ${isExpanded ? 'mt-6' : 'mt-8'}`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="group inline-flex items-center gap-3 text-sm font-semibold tracking-[0.15em] uppercase text-ink hover:text-cobalt transition-colors duration-300"
          >
            <span className="relative overflow-hidden pb-1">
              {isExpanded ? 'Read less' : 'Read more'}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-cobalt origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100" />
            </span>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <ChevronDown size={18} strokeWidth={1.5} />
            </motion.div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function WhyUsPage() {
  return (
    <section className="bg-ivory min-h-screen pt-28 md:pt-36 pb-24 md:pb-32 grain overflow-hidden">
      {/* Header Section */}
      <div className="container-px mb-20 md:mb-32">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-12">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow text-cobalt mb-5 md:mb-6 uppercase tracking-[0.2em]"
            >
              The One Way Ethos
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-serif italic text-5xl md:text-6xl lg:text-7xl text-ink leading-[1.05] tracking-tight"
            >
              Made by hand. <br className="hidden md:block" />
              <span className="text-sage-deep">Made to last.</span>
            </motion.h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:max-w-md lg:pb-3"
          >
            {/* <p className="text-ink/70 text-base md:text-lg leading-relaxed">
              We believe in the beauty of imperfection and the durability of true craftsmanship. Every piece is a testament to slow living and mindful design.
            </p> */}
          </motion.div>
        </div>
      </div>

      {/* Alternating Sections with Expandable Details */}
      <div className="container-px">
        <div className="flex flex-col gap-24 md:gap-32 lg:gap-40">
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.title} f={f} index={i} isEven={i % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}