import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function ClosingCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '15%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['40%', '-20%']);

  return (
    <section
      ref={ref}
      className="relative h-[90vh] min-h-[600px] overflow-hidden bg-ink"
      data-cursor-dark="true"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 h-[120%]">
        <img
          src="https://images.pexels.com/photos/8063833/pexels-photo-8063833.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-30"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/80 to-ink" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-cobalt/20 blur-[140px] pointer-events-none" />

      <div className="container-px relative z-10 h-full flex flex-col items-center justify-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="eyebrow text-cobalt-light mb-8"
        >
          Let's make something
        </motion.p>
        <motion.h2
          style={{ y: textY }}
          className="font-serif italic text-5xl md:text-7xl lg:text-8xl leading-[1.02] max-w-4xl"
        >
          You imagine the piece.
          <br />
          <span className="text-cobalt-light">We hand-make it.</span>
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12"
        >
          <MagneticButton>
            <a href="#contact" className="btn-clay text-base px-8 py-4">
              Book a Workshop <ArrowRight size={18} strokeWidth={1.8} />
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
