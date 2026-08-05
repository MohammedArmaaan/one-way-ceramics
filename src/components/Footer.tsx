import { motion } from 'framer-motion';
import { MapPin, Phone, Globe, Instagram, Facebook, ArrowUp, Heart } from 'lucide-react';
import { BUSINESS } from '@/data';

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory/70 border-t border-white/10 overflow-hidden">
      <div className="container-px py-16 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="font-serif italic text-3xl md:text-4xl text-ivory max-w-lg leading-tight">
            Ready to make something beautiful?
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="btn-clay">Book a Workshop</a>
            <a href={`tel:${BUSINESS.phoneHref}`} className="btn-outline-light">Call now</a>
          </div>
        </div>
      </div>

      <div className="container-px py-12 border-b border-white/10">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="display text-ivory/10 text-[18vw] leading-[0.85] tracking-tightest select-none"
        >
          ONE WAY
        </motion.h2>
      </div>

      <div className="container-px py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-ink font-serif text-lg italic">
                o
              </span>
              <span className="font-semibold tracking-tight text-[15px] text-ivory">
                One Way <span className="text-cobalt">Ceramic</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Handmade ceramics, tableware and tiles — thrown, glazed and fired
              in our Prahlad Nagar studio. A women-owned ceramic manufacturer
              serving Ahmedabad and beyond.
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-cobalt-light">
              <Heart size={12} strokeWidth={1.8} className="fill-cobalt-light" /> Women-owned business
            </p>
          </div>

          <div className="md:col-span-4 space-y-4 text-sm">
            <p className="eyebrow text-ivory/40 mb-4">Reach us</p>
            <p className="flex items-start gap-3">
              <MapPin size={16} strokeWidth={1.6} className="mt-0.5 text-sage-light shrink-0" />
              {BUSINESS.address}
            </p>
            <a href={`tel:${BUSINESS.phoneHref}`} className="flex items-center gap-3 hover:text-cobalt-light transition-colors">
              <Phone size={16} strokeWidth={1.6} className="text-sage-light shrink-0" />
              {BUSINESS.phone}
            </a>
            <a href={`https://${BUSINESS.website}`} className="flex items-center gap-3 hover:text-cobalt-light transition-colors">
              <Globe size={16} strokeWidth={1.6} className="text-sage-light shrink-0" />
              {BUSINESS.website}
            </a>
          </div>

          <div className="md:col-span-3 space-y-4 text-sm">
            <p className="eyebrow text-ivory/40 mb-4">Explore</p>
            <ul className="space-y-2.5">
              <li><a href="#collections" className="hover:text-cobalt-light transition-colors">Collections</a></li>
              <li><a href="#collections-strip" className="hover:text-cobalt-light transition-colors">Studio</a></li>
              <li><a href="#features" className="hover:text-cobalt-light transition-colors">Why Us</a></li>
              <li><a href="#process" className="hover:text-cobalt-light transition-colors">Process</a></li>
              <li><a href="#contact" className="hover:text-cobalt-light transition-colors">Visit</a></li>
            </ul>
            <div className="flex gap-3 pt-3">
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:border-cobalt hover:text-cobalt-light transition-colors">
                <Instagram size={16} strokeWidth={1.6} />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 hover:border-cobalt hover:text-cobalt-light transition-colors">
                <Facebook size={16} strokeWidth={1.6} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/40">
          <p>© {new Date().getFullYear()} One Way Ceramic Studio. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Open daily · {BUSINESS.hours} · Ahmedabad, Gujarat</span>
            <a href="#top" className="flex items-center gap-1 hover:text-cobalt-light transition-colors">
              Back to top <ArrowUp size={12} strokeWidth={1.8} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
