import { motion } from 'framer-motion';
import { PROCESS } from '@/data';
import { Reveal, ParallaxImage } from '@/components/motion';

export default function ProcessPage() {
  return (
    <div className="bg-ivory-soft min-h-screen pt-28 md:pt-32 pb-20 grain">
      <div className="container-px mb-16 md:mb-24">
        <Reveal>
          <p className="eyebrow text-cobalt mb-5">How it works</p>
        </Reveal>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-4xl md:text-6xl text-ink leading-[1.05]"
        >
          From clay to <span className="text-sage-deep">kiln.</span>
        </motion.h1>
      </div>

      <div className="container-px">
        <div className="space-y-20 md:space-y-28">
          {PROCESS.map((p, i) => {
            const reverse = i % 2 === 1;
            return (
              <div
                key={p.step}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${
                  reverse ? 'md:[direction:rtl]' : ''
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: reverse ? 40 : -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="[direction:ltr]"
                >
                  <ParallaxImage
                    src={p.image}
                    alt={p.title}
                    strength={40}
                    className="h-[300px] md:h-[440px] rounded-3xl"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: reverse ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="[direction:ltr]"
                >
                  <span className="font-serif italic text-6xl md:text-7xl text-cobalt/40">
                    {p.step}
                  </span>
                  <h3 className="font-sans font-bold text-2xl md:text-3xl text-ink mt-4 tracking-tight">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-ink-muted leading-relaxed max-w-md">
                    {p.body}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
