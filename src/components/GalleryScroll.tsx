import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GALLERY } from '@/data';

export default function GalleryScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    function measure() {
      const track = trackRef.current;
      if (!track) return;
      const trackWidth = track.scrollWidth;
      const vw = window.innerWidth;
      const leftPad = vw >= 1024 ? 80 : vw >= 768 ? 48 : vw >= 640 ? 32 : 20;
      setTravel(Math.max(0, trackWidth - vw + leftPad));
    }
    measure();
    window.addEventListener('resize', measure);
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
  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);
  const sectionHeight = `${Math.max(280, 120 + travel / 8)}vh`;

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative bg-ivory py-24 md:py-28"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
        <div className="container-px mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="eyebrow text-cobalt mb-4"
          >
            Recent work
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif italic text-4xl md:text-6xl text-ink leading-[1.05]"
          >
            Spaces we helped <span className="text-sage-deep">finish.</span>
          </motion.h2>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-5 md:gap-7 px-5 sm:px-8 md:px-12 lg:px-20"
        >
          {GALLERY.map((g, i) => (
            <div
              key={g.label}
              className="group relative h-[360px] w-[280px] md:h-[460px] md:w-[360px] shrink-0 overflow-hidden rounded-2xl bg-ink"
            >
              <img
                src={g.src}
                alt={g.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <span className="font-mono text-xs text-cobalt-light">0{i + 1}</span>
                <p className="font-serif italic text-xl text-ivory mt-1">{g.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="container-px mt-8 flex items-center gap-3 text-xs text-ink-muted">
          <span className="h-px flex-1 bg-ink-line" />
          <span>Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}
