import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '@/data';
import { ParallaxImage, Reveal } from './motion';

export default function CategoryShowcase() {
  return (
    <section
      id="collections"
      className="bg-ivory-soft py-24 md:py-32 border-t border-ink-line/50"
    >
      <div className="container-px">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div className="max-w-2xl">
            <Reveal>
              <p className="eyebrow text-cobalt mb-5">The Catalogue</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
          {CATEGORIES.map((c, i) => (
            <motion.article
              key={c.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.8,
                delay: (i % 2) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden rounded-3xl ${c.span} ${
                c.tall ? 'h-[420px] md:h-[560px]' : 'h-[340px] md:h-[440px]'
              }`}
              data-cursor="hover"
            >
              <ParallaxImage
                src={c.image}
                alt={c.name}
                strength={50}
                className="absolute inset-0 h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
              {c.tag && (
                <span className="absolute top-5 left-5 rounded-full bg-ivory/90 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium text-ink">
                  {c.tag}
                </span>
              )}
              <div className="absolute inset-0 p-7 md:p-9 flex flex-col justify-end">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-sans font-bold text-2xl md:text-3xl text-ivory tracking-tight">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-sm text-ivory/70 max-w-md leading-relaxed">
                      {c.desc}
                    </p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-ivory group-hover:bg-cobalt group-hover:border-cobalt transition-all duration-500">
                    <ArrowUpRight size={18} strokeWidth={1.6} />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
