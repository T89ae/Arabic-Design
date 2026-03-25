import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type SidebarCtx = {
  open: boolean;
  toggle: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarCtx>({ open: false, toggle: () => {}, close: () => {} });

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(() => window.innerWidth >= 1024);

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setOpen(true);
      else setOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <SidebarContext.Provider value={{ open, toggle: () => setOpen(v => !v), close: () => setOpen(false) }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
