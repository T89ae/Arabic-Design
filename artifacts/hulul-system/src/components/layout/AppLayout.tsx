import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ReactNode } from "react";
import { motion } from "framer-motion";

export function AppLayout({ children, title }: { children: ReactNode, title: string }) {
  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      <Sidebar />
      <div className="flex-1 lg:mr-64 flex flex-col min-h-screen">
        <Topbar title={title} />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
