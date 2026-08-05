import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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

const ICONS = { Hand, Heart, Palette, Sparkles, Store, FlaskConical } as const;

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  // Measure how far the track needs to move so the last card's right edge
  // aligns with the viewport's right edge. Recompute on resize.
  useEffect(() => {
    function measure() {
      const track = trackRef.current;
      if (!track) return;
      // track.scrollWidth includes all cards + gaps
      // we need to move left by (trackWidth - viewportWidth + leftPadding)
      const trackWidth = track.scrollWidth;
      const vw = window.innerWidth;
      // account for the left padding (matches container-px: lg:px-20 = 80px)
      const leftPad = vw >= 1024 ? 80 : vw >= 768 ? 48 : vw >= 640 ? 32 : 20;
      const t = Math.max(0, trackWidth - vw + leftPad);
      setTravel(t);
    }
    measure();
    window.addEventListener('resize', measure);
    // re-measure after images load
    const imgs = trackRef.current?.querySelectorAll('img') ?? [];
    imgs.forEach((img) => img.addEventListener('load', measure));
    return () => {
      window.removeEventListener('resize', measure);
      imgs.forEach((img) => img.removeEventListener('load', measure));
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // translate from 0 to -travel(px) so the last card ends exactly at the right edge
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  // section height: enough scroll distance for a comfortable horizontal pan
  // 6 cards -> more scroll distance. ~100vh per "screen" of horizontal travel.
  const sectionHeight = `${Math.max(280, 120 + travel / 8)}vh`;

  return (
    <section
      id="features"
      ref={ref}
      className="relative bg-ivory grain"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="container-px mb-10 md:mb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="eyebrow text-cobalt mb-4"
              >
                Why One Way
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="font-serif italic text-4xl md:text-6xl text-ink leading-[1.05]"
              >
                Made by hand. <span className="text-sage-deep">Made to last.</span>
              </motion.h2>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs text-ink-muted uppercase tracking-[0.2em] hidden md:block"
            >
              Scroll to explore →
            </motion.p>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-5 md:gap-7 px-5 sm:px-8 md:px-12 lg:px-20"
        >
          {FEATURES.map((f, i) => {
            const Icon = ICONS[f.icon as keyof typeof ICONS];
            return (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.8,
                  delay: (i % 3) * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative h-[400px] md:h-[460px] w-[300px] md:w-[380px] shrink-0 rounded-3xl overflow-hidden bg-ink"
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
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-cobalt-light group-hover:gap-3 transition-all duration-500">
                    Learn more <ArrowUpRight size={14} strokeWidth={1.8} />
                  </span>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <div className="container-px mt-8 flex items-center gap-3 text-xs text-ink-muted">
          <span className="h-px flex-1 bg-ink-line" />
          <span>Keep scrolling</span>
        </div>
      </div>
    </section>
  );
}
