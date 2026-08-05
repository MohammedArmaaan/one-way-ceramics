import { motion } from 'framer-motion';
import { Grid3x3, Package, Workflow, Sparkles, Phone } from 'lucide-react';
import { useNav, type PageId } from '@/nav';

const TABS: { id: PageId; label: string; icon: React.ReactNode }[] = [
  { id: 'collection', label: 'Collection', icon: <Grid3x3 size={20} strokeWidth={1.6} /> },
  { id: 'products', label: 'Products', icon: <Package size={20} strokeWidth={1.6} /> },
  { id: 'process', label: 'Process', icon: <Workflow size={20} strokeWidth={1.6} /> },
  { id: 'why-us', label: 'Why Us', icon: <Sparkles size={20} strokeWidth={1.6} /> },
  { id: 'contact', label: 'Contact', icon: <Phone size={20} strokeWidth={1.6} /> },
];

export default function BottomNav() {
  const { page, navigate } = useNav();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="mx-3 mb-3 rounded-2xl bg-ink/90 backdrop-blur-xl border border-white/10 shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex items-stretch justify-around">
          {TABS.map((tab) => {
            const isActive = page === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className="relative flex flex-1 flex-col items-center gap-1 py-3 transition-colors"
              >
                <span
                  className={`transition-colors duration-300 ${
                    isActive ? 'text-cobalt-light' : 'text-ivory/55'
                  }`}
                >
                  {tab.icon}
                </span>
                <span
                  className={`text-[10px] font-medium tracking-wide transition-colors duration-300 ${
                    isActive ? 'text-cobalt-light' : 'text-ivory/55'
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-dot"
                    className="absolute -top-0.5 h-1 w-6 rounded-full bg-cobalt-light"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
