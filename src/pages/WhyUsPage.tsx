import { motion } from 'framer-motion';
import {
  Hand,
  Heart,
  Palette,
  Sparkles,
  Store,
  FlaskConical,
  ArrowUpRight,
} from 'lucide-react';
import { FEATURES } from '@/data';
import { useNav } from '@/nav';

const ICONS = { Hand, Heart, Palette, Sparkles, Store, FlaskConical } as const;

export default function WhyUsPage() {
  const { navigate } = useNav();
  return (
    <div className="bg-ivory min-h-screen pt-28 md:pt-32 pb-20 grain">
      <div className="container-px mb-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow text-cobalt mb-4"
        >
          Why One Way
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-4xl md:text-6xl text-ink leading-[1.05]"
        >
          Made by hand. <span className="text-sage-deep">Made to last.</span>
        </motion.h1>
      </div>

      <div className="container-px">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon as keyof typeof ICONS];
            return (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative h-[400px] md:h-[440px] shrink-0 rounded-3xl overflow-hidden bg-ink"
              >
                <img
                  src={f.image}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-45 transition-all duration-700 group-hover:opacity-65 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />

                <span className="absolute top-6 right-6 font-mono text-xs text-ivory/40">
                  {f.index}
                </span>
                <span className="absolute top-6 left-6 flex h-12 w-12 items-center justify-center rounded-full bg-cobalt text-ivory transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  <Icon size={22} strokeWidth={1.6} />
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="font-sans font-bold text-2xl md:text-3xl text-ivory tracking-tight mb-3">
                    {f.title}
                  </h3>
                  <p className="text-sm text-ivory/70 leading-relaxed mb-5 max-w-xs">
                    {f.body}
                  </p>
                  <button
                    onClick={() => navigate('contact')}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-cobalt-light group-hover:gap-3 transition-all duration-500"
                  >
                    Learn more <ArrowUpRight size={14} strokeWidth={1.8} />
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
