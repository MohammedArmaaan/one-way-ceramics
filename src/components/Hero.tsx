import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ArrowRight, Star, MapPin, Heart, Sparkles } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { BUSINESS } from '@/data';

// --- FRAME SEQUENCE CONFIG ---
// 90 frames extracted at 8fps from the pottery video
const FRAME_COUNT = 90;
const getFramePath = (index: number) =>
  `/Banner/frames/frame_${String(index + 1).padStart(4, '0')}.jpg`;

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const rafRef = useRef<number | undefined>(undefined);

  const [framesLoaded, setFramesLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollAnimEnabled, setScrollAnimEnabled] = useState(true);

  // --- 0. LOW-END / REDUCED-MOTION FALLBACK ---
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowEndDevice =
      typeof navigator !== 'undefined' &&
      'hardwareConcurrency' in navigator &&
      navigator.hardwareConcurrency > 0 &&
      navigator.hardwareConcurrency < 4;

    if (prefersReduced || lowEndDevice) setScrollAnimEnabled(false);
  }, []);

  // --- 1. PRELOAD ALL FRAMES ---
  useEffect(() => {
    if (!scrollAnimEnabled) return;

    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = getFramePath(i);
      const onDone = () => {
        loaded += 1;
        setLoadProgress(Math.round((loaded / FRAME_COUNT) * 100));
        if (loaded === FRAME_COUNT) setFramesLoaded(true);
      };
      img.onload = onDone;
      img.onerror = onDone;
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, [scrollAnimEnabled]);

  // Raw + spring-smoothed scroll progress
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    restDelta: 0.0005,
  });

  // --- 2. DRAW A SINGLE FRAME ONTO THE CANVAS (object-fit: cover math) ---
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;
    const targetW = Math.round(cw * dpr);
    const targetH = Math.round(ch * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cw, ch);

    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;
    let sx: number, sy: number, sw: number, sh: number;

    if (imgRatio > canvasRatio) {
      sh = img.naturalHeight;
      sw = sh * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      sw = img.naturalWidth;
      sh = sw / canvasRatio;
      sx = 0;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }, []);

  // --- 3. CONTINUOUS rAF LOOP ---
  useEffect(() => {
    if (!framesLoaded) return;

    const animate = () => {
      const progress = smoothProgress.get();
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(progress * (FRAME_COUNT - 1)))
      );
      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;
        drawFrame(frameIndex);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [framesLoaded, smoothProgress, drawFrame]);

  // Draw first frame + redraw on resize
  useEffect(() => {
    if (!framesLoaded) return;
    drawFrame(0);
    const onResize = () => drawFrame(Math.max(0, currentFrameRef.current));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [framesLoaded, drawFrame]);

  // --- 4. TEXT SCENE TRANSFORMS ---
  const textProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 });

  const scene1Opacity = useTransform(textProgress, [0, 0.05, 0.15, 0.2], [1, 1, 0, 0]);
  const scene1Y = useTransform(textProgress, [0, 0.2], [0, -50]);

  const scene2Opacity = useTransform(textProgress, [0.2, 0.25, 0.4, 0.45], [0, 1, 1, 0]);
  const scene2Y = useTransform(textProgress, [0.2, 0.25, 0.4, 0.45], [50, 0, 0, -50]);

  const scene3Opacity = useTransform(textProgress, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0]);
  const scene3Y = useTransform(textProgress, [0.45, 0.5, 0.65, 0.7], [50, 0, 0, -50]);

  const scene4Opacity = useTransform(textProgress, [0.75, 0.8, 1, 1], [0, 1, 1, 1]);
  const scene4Y = useTransform(textProgress, [0.75, 0.8], [50, 0]);

  const layerStyle: React.CSSProperties = {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)',
  };

  return (
    <section ref={heroRef} className="relative h-[800vh] bg-ink">
      {/* STICKY CONTAINER */}
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        {/* Preloader */}
        {scrollAnimEnabled && !framesLoaded && (
          <div className="absolute inset-0 z-50 bg-ink flex flex-col items-center justify-center">
            <span className="font-serif italic text-2xl text-ivory tracking-widest mb-4">One Way</span>
            <span className="text-ivory/50 text-xs tracking-[0.3em] uppercase mb-3">Preparing the reveal</span>
            <span className="text-cobalt-light text-sm tracking-widest">{loadProgress}%</span>
          </div>
        )}

        {/* CANVAS — draws one frame at a time, driven by scroll */}
        <div className="absolute inset-0">
          {scrollAnimEnabled ? (
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full opacity-80"
              style={layerStyle}
            />
          ) : (
            <img
              src={getFramePath(0)}
              alt="One Way Ceramic Studio"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
          )}
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/80 opacity-90" />
        </div>

        {/* Ambient glow accents */}
        <div className="absolute -left-1/4 top-1/3 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-cobalt/20 blur-[140px] pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-clay/15 blur-[150px] pointer-events-none" />

        {/* SCENE 1: Intro Text */}
        <motion.div
          style={scrollAnimEnabled ? { opacity: scene1Opacity, y: scene1Y, ...layerStyle } : {}}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <span className="hero-pill inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 text-xs text-ivory/90">
              <span className="h-1.5 w-1.5 rounded-full bg-cobalt-light animate-pulse" />
              {BUSINESS.category}
            </span>
            <span className="hero-pill inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 text-xs text-ivory/90">
              <Star size={12} strokeWidth={1.6} className="fill-clay text-clay" /> {BUSINESS.rating} · {BUSINESS.reviews} reviews
            </span>
            <span className="hero-pill inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 text-xs text-ivory/90">
              <Heart size={12} strokeWidth={1.6} className="text-cobalt-light" /> Women-owned
            </span>
            <span className="hero-pill hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-4 py-1.5 text-xs text-ivory/90">
              <MapPin size={12} strokeWidth={1.6} /> Prahlad Nagar, Ahmedabad
            </span>
          </div>

          <h1 className="display text-ivory text-[15vw] sm:text-[12vw] lg:text-[8.5vw] drop-shadow-lg">
            <span className="block">Clay, Shaped</span>
            <span className="block">
              By{' '}
              <span className="font-serif italic font-medium text-cobalt-light">Hand.</span>
            </span>
            <span className="block text-ivory/30">— One Way.</span>
          </h1>

          <p className="mt-6 text-ivory/50 tracking-[0.3em] text-xs md:text-sm uppercase drop-shadow">
            Scroll to reveal
          </p>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <motion.div
              animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-10 bg-gradient-to-b from-ivory to-transparent origin-top"
            />
          </div>
        </motion.div>

        {/* SCENE 2 */}
        {scrollAnimEnabled && (
          <motion.div
            style={{ opacity: scene2Opacity, y: scene2Y, ...layerStyle }}
            className="absolute inset-0 flex flex-col justify-center pointer-events-none px-6 sm:px-10 md:px-32 items-start"
          >
            <span className="text-ivory/30 font-serif italic text-6xl md:text-8xl mb-2">01</span>
            <span className="text-cobalt-light tracking-[0.2em] uppercase text-xs font-semibold mb-3">
              The Wheel
            </span>
            <h2 className="font-serif italic text-4xl md:text-6xl text-ivory max-w-sm leading-tight drop-shadow-md">
              Born of earth & water
            </h2>
            <p className="mt-4 text-ivory/80 max-w-md text-sm md:text-base leading-relaxed drop-shadow">
              A lump of clay meets the spinning wheel. Hands guide, water smooths,
              and form emerges from nothing — every vessel begins here, in the quiet
              rhythm of the turn.
            </p>
          </motion.div>
        )}

        {/* SCENE 3 */}
        {scrollAnimEnabled && (
          <motion.div
            style={{ opacity: scene3Opacity, y: scene3Y, ...layerStyle }}
            className="absolute inset-0 flex flex-col justify-center pointer-events-none px-6 sm:px-10 md:px-32 items-end text-right"
          >
            <span className="text-ivory/30 font-serif italic text-6xl md:text-8xl mb-2">02</span>
            <span className="text-cobalt-light tracking-[0.2em] uppercase text-xs font-semibold mb-3">
              The Glaze
            </span>
            <h2 className="font-serif italic text-4xl md:text-6xl text-ivory max-w-sm leading-tight drop-shadow-md">
              Colour, fire & patience
            </h2>
            <p className="mt-4 text-ivory/80 max-w-md text-sm md:text-base leading-relaxed drop-shadow">
              Each piece is dipped, glazed and fired at over a thousand degrees.
              Cobalt blues, turquoise greens and warm clay tones — the signature
              palette of our studio, sealed by heat into permanence.
            </p>
          </motion.div>
        )}

        {/* SCENE 4: Final CTA */}
        <motion.div
          style={scrollAnimEnabled ? { opacity: scene4Opacity, y: scene4Y, ...layerStyle } : { opacity: 1 }}
          className={scrollAnimEnabled ? 'absolute inset-0 flex flex-col items-center justify-center text-center px-4' : 'hidden'}
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] tracking-[0.2em] uppercase text-ivory mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Made in Ahmedabad
          </span>
          <h2 className="font-serif italic text-3xl sm:text-5xl md:text-7xl text-ivory max-w-4xl leading-tight drop-shadow-lg">
            Some pots are made to hold water.{' '}
            <span className="text-cobalt-light">This one was made to hold stories.</span>
          </h2>
          <div className="mt-10 md:mt-12 pointer-events-auto flex flex-wrap justify-center gap-4">
            <MagneticButton>
              <a href="#contact" className="hero-cta btn-clay">
                Book a Workshop <ArrowRight size={16} strokeWidth={1.8} />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a href="#collections" className="hero-cta btn-outline-light">
                See Collections
              </a>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Fallback CTA for low-end devices */}
        {!scrollAnimEnabled && (
          <div className="absolute inset-x-0 bottom-16 flex justify-center pointer-events-auto">
            <MagneticButton>
              <a href="#collections" className="btn-clay">
                See Collections <ArrowRight size={16} strokeWidth={1.8} />
              </a>
            </MagneticButton>
          </div>
        )}
      </div>
    </section>
  );
}
