import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export type PageId =
  | 'home'
  | 'collection'
  | 'products'
  | 'process'
  | 'why-us'
  | 'contact';

type NavContextType = {
  page: PageId;
  navigate: (page: PageId) => void;
};

const NavContext = createContext<NavContextType | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>('home');

  function navigate(p: PageId) {
    setPage(p);
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
