import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

export type PageId =
  | 'home'
  | 'collection'
  | 'products'
  | 'process'
  | 'why-us'
  | 'contact'
  | 'wishlist'
  | 'cart';

const PATH_BY_PAGE: Record<PageId, string> = {
  home: '/',
  collection: '/collection',
  products: '/products',
  process: '/process',
  'why-us': '/why-us',
  contact: '/contact',
  wishlist: '/wishlist',
  cart: '/cart',
};

function getPageFromPath(path: string): PageId {
  if (path.startsWith('/product/')) return 'products';
  if (path === '/collection') return 'collection';
  if (path === '/products') return 'products';
  if (path === '/process') return 'process';
  if (path === '/why-us') return 'why-us';
  if (path === '/contact') return 'contact';
  if (path === '/wishlist') return 'wishlist';
  if (path === '/cart') return 'cart';
  return 'home';
}

type NavContextType = {
  page: PageId;
  navigate: (page: PageId) => void;
};

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>(() => {
    if (typeof window === 'undefined') return 'home';
    return getPageFromPath(window.location.pathname);
  });

  useEffect(() => {
    const syncPageFromLocation = () => {
      setPage(getPageFromPath(window.location.pathname));
    };

    syncPageFromLocation();
    window.addEventListener('popstate', syncPageFromLocation);
    return () => window.removeEventListener('popstate', syncPageFromLocation);
  }, []);

  function navigate(p: PageId) {
    setPage(p);
    const nextPath = PATH_BY_PAGE[p];
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }

  return (
    <NavContext.Provider value={{ page, navigate }}>
      {children}
    </NavContext.Provider>
  );
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
