import { motion } from 'framer-motion';
import { COLLECTIONS } from '@/data';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function BrandsStrip() {
  const row = [...COLLECTIONS, ...COLLECTIONS];
  return (
    <section
      id="collections-strip"
      className="relative bg-ink text-ivory py-20 md:py-24 overflow-hidden grain"
      data-cursor-dark="true"
    >
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[80vw] h-40 max-w-[900px] bg-cobalt/15 blur-[120px] pointer-events-none" />

      <div className="container-px relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col items-center text-center mb-12"
        >
          <span className="eyebrow text-cobalt-light mb-3">Collections we craft</span>
          <p className="font-serif italic text-2xl md:text-3xl text-ivory/80 max-w-2xl">
            Six ceramic bodies, each with its own character — from earthy terracotta to refined porcelain.
          </p>
        </motion.div>
      </div>

      <div className="relative overflow-hidden mask-fade-x">
        <div className="flex w-max animate-marquee gap-16 px-6">
          {row.map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="font-serif italic text-3xl md:text-5xl text-ivory/25 hover:text-cobalt-light transition-colors duration-500 whitespace-nowrap select-none"
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 1.2, ease: EASE }}
        className="container-px mt-14"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent origin-center" />
      </motion.div>
    </section>
  );
}
