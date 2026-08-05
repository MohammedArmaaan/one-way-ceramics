import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Phone, Clock, Star, Navigation, ExternalLink } from 'lucide-react';
import { BUSINESS } from '@/data';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '12%']);

  return (
    <section
      id="contact"
      ref={ref}
      className="relative bg-ink text-ivory overflow-hidden grain"
      data-cursor-dark="true"
    >
      <motion.div style={{ y: imgY }} className="absolute inset-0 h-[115%]">
        <img
          src="https://images.pexels.com/photos/32212371/pexels-photo-32212371.jpeg?auto=compress&cs=tinysrgb&w=1800"
          alt=""
          aria-hidden
          className="h-full w-full object-cover opacity-25"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/85 to-ink" />
      <div className="absolute right-0 top-1/4 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-cobalt/15 blur-[130px] pointer-events-none" />

      <div className="container-px relative py-24 md:py-36">
        <div className="max-w-2xl mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="eyebrow text-cobalt-light mb-5"
          >
            Visit Our Studio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1, ease: EASE }}
            className="font-serif italic text-5xl md:text-7xl leading-[1.02]"
          >
            Come see the
            <br />
            <span className="text-sage-light">pots in person.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10"
          >
            <div className="space-y-6">
              <ContactRow icon={<MapPin size={18} strokeWidth={1.6} />} label="Address">
                {BUSINESS.address}
              </ContactRow>
              <ContactRow icon={<Phone size={18} strokeWidth={1.6} />} label="Phone">
                <a href={`tel:${BUSINESS.phoneHref}`} className="hover:text-cobalt-light transition-colors">
                  {BUSINESS.phone}
                </a>
              </ContactRow>
              <ContactRow icon={<Clock size={18} strokeWidth={1.6} />} label="Hours">
                Open daily · {BUSINESS.hours}
              </ContactRow>
              <ContactRow icon={<Star size={18} strokeWidth={1.6} />} label="Rating">
                {BUSINESS.rating} · {BUSINESS.reviews} Google reviews
              </ContactRow>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a href={BUSINESS.mapsUrl} target="_blank" rel="noreferrer" className="btn-clay">
                <Navigation size={16} strokeWidth={1.8} /> Get Directions
              </a>
              <a href={`tel:${BUSINESS.phoneHref}`} className="btn-outline-light">
                Call the studio
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
            className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[400px] lg:min-h-[520px]"
          >
            <iframe
              title="One Way Ceramic Studio location map"
              src="https://www.google.com/maps?q=One+Way+Ceramic+Studio+Noorani+Road+Prahlad+Nagar+Ahmedabad+Gujarat+380015&output=embed"
              className="absolute inset-0 h-full w-full grayscale invert-[0.92] hue-rotate-180 contrast-[0.9] opacity-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-3xl" />
            <a
              href={BUSINESS.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 rounded-2xl bg-ink/80 backdrop-blur-md border border-white/10 px-5 py-4 hover:border-cobalt/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cobalt text-ivory">
                  <MapPin size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-sm font-medium">One Way Ceramic Studio</p>
                  <p className="text-xs text-ivory/55">Noorani Rd, Prahlad Nagar</p>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-cobalt-light">
                Open <ExternalLink size={12} strokeWidth={1.8} />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 border-t border-white/10 pt-5">
      <span className="mt-0.5 text-sage-light">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ivory/45 mb-1">{label}</p>
        <p className="text-ivory/90 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
