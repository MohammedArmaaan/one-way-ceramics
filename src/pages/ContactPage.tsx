import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { BUSINESS } from '@/data';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    project: '',
    message: '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: '', phone: '', email: '', project: '', message: '' });
    }, 4000);
  }

  const inputClass =
    'w-full rounded-xl border border-ink-line bg-white px-4 py-3 text-ink placeholder:text-ink-muted/50 focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 outline-none transition-all duration-300';

  return (
    <div className="bg-ivory min-h-screen pt-28 md:pt-32 pb-20">
      <div className="container-px">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="eyebrow text-cobalt mb-4"
        >
          Get in touch
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif italic text-4xl md:text-6xl text-ink leading-[1.05]"
        >
          Let's build <span className="text-sage-deep">something.</span>
        </motion.h1>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Info column */}
          <div className="lg:col-span-2 space-y-6">
            {[
              { icon: <Phone size={20} strokeWidth={1.6} />, label: 'Phone', value: BUSINESS.phone, href: `tel:${BUSINESS.phoneHref}` },
              { icon: <Mail size={20} strokeWidth={1.6} />, label: 'Email', value: BUSINESS.email, href: `mailto:${BUSINESS.email}` },
              { icon: <MapPin size={20} strokeWidth={1.6} />, label: 'Showroom', value: BUSINESS.address },
              { icon: <Clock size={20} strokeWidth={1.6} />, label: 'Hours', value: BUSINESS.hours },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-ink-line/60"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
                  {item.icon}
                </span>
                <div>
                  <p className="text-xs uppercase tracking-wider text-ink-muted">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-ink font-medium hover:text-cobalt transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-ink font-medium">{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Form column */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl bg-white border border-ink-line/60 p-6 md:p-8 shadow-[0_20px_60px_-30px_rgba(28,28,26,0.2)]"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Name *</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Phone *</label>
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                    placeholder="10-digit mobile"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputClass}
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-muted mb-1.5">Project type</label>
                  <select
                    value={form.project}
                    onChange={(e) => setForm({ ...form, project: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    <option>Home / Personal</option>
                    <option>Restaurant / Café</option>
                    <option>Retail / Boutique</option>
                    <option>Gifting / Corporate</option>
                    <option>Workshop Booking</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-ink-muted mb-1.5">Message</label>
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your project, requirements, timeline..."
                />
              </div>

              <button
                type="submit"
                disabled={sent}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-all duration-300 ${
                  sent
                    ? 'bg-sage-deep text-ivory'
                    : 'bg-cobalt text-ivory hover:bg-cobalt-deep hover:shadow-[0_12px_36px_-12px_rgba(43,94,167,0.7)]'
                }`}
              >
                {sent ? (
                  <>
                    <CheckCircle2 size={18} strokeWidth={1.8} /> Message Sent!
                  </>
                ) : (
                  <>
                    <Send size={18} strokeWidth={1.8} /> Send Message
                  </>
                )}
              </button>
              {sent && (
                <p className="mt-3 text-center text-sm text-sage-deep">
                  We'll get back to you within 24 hours.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
