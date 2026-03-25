import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";

function Layout({ children, title }: { children: ReactNode; title: string }) {
  const { open, close } = useSidebar();

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={close}
        />
      )}

      <Sidebar />

      {/* Main content — shifts right on desktop when sidebar is open */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          open ? "lg:mr-64" : "mr-0"
        }`}
      >
        <Topbar title={title} />
        <main className="flex-1 p-4 sm:p-6 w-full max-w-7xl mx-auto overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export function AppLayout({ children, title }: { children: ReactNode; title: string }) {
  return (
    <SidebarProvider>
      <Layout title={title}>{children}</Layout>
    </SidebarProvider>
  );
}
