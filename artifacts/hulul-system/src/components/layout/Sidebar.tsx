import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";
import {
  LayoutDashboard,
  Users,
  ArrowRightLeft,
  CheckSquare,
  Wallet,
  LineChart,
  Settings,
  LogOut,
  CalendarCheck,
  ShoppingCart,
  CreditCard,
  Package,
  Phone,
  Handshake,
  UserCheck,
  Activity,
  ChevronRight,
} from "lucide-react";

const navGroups = [
  {
    title: "الرئيسية",
    items: [{ name: "لوحة التحكم", icon: LayoutDashboard, path: "/" }],
  },
  {
    title: "العمل اليومي",
    items: [
      { name: "العمال والكفلاء", icon: Users, path: "/workers" },
      { name: "الحوالات", icon: ArrowRightLeft, path: "/transfers" },
      { name: "المهام", icon: CheckSquare, path: "/tasks" },
      { name: "الحضور والغياب", icon: CalendarCheck, path: "/attendance" },
      { name: "العمال السعوديون", icon: UserCheck, path: "/saudi-workers" },
    ],
  },
  {
    title: "المالية",
    items: [
      { name: "المحاسبة والمالية", icon: Wallet, path: "/finance" },
      { name: "المبيعات", icon: ShoppingCart, path: "/sales" },
      { name: "المصروفات", icon: CreditCard, path: "/expenses" },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { name: "الجرد والمخزون", icon: Package, path: "/inventory" },
      { name: "جهات الاتصال", icon: Phone, path: "/contacts" },
      { name: "الوسطاء", icon: Handshake, path: "/brokers" },
    ],
  },
  {
    title: "أخرى",
    items: [
      { name: "التقارير", icon: LineChart, path: "/reports" },
      { name: "سجل النشاطات", icon: Activity, path: "/activity" },
      { name: "الإعدادات", icon: Settings, path: "/settings" },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { open, close, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col z-40 shadow-2xl shadow-primary/10 transition-transform duration-300",
        open ? "translate-x-0" : "translate-x-full",
      )}
    >
      {/* Logo row */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-accent/30 bg-sidebar-accent/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary font-bold text-xl shadow-inner shadow-white/20 flex-shrink-0">
            ح
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight tracking-tight">
              نظام حلول
            </h1>
            <p className="text-[10px] text-sidebar-foreground/50 font-medium">
              للخدمات العامة
            </p>
          </div>
        </div>

        {/* Close / collapse button */}
        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-sidebar-foreground/60 hover:text-white transition-colors flex-shrink-0"
          title="إغلاق القائمة"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-3">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-wider mb-1">
              {group.title}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => {
                        if (window.innerWidth < 1024) close();
                      }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-150 group",
                        isActive
                          ? "bg-accent/15 text-accent border border-accent/20 shadow-sm"
                          : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0 transition-colors",
                          isActive
                            ? "text-accent"
                            : "text-sidebar-foreground/40 group-hover:text-white",
                        )}
                      />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-accent/30 flex-shrink-0">
        <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-semibold group">
          <LogOut className="w-4 h-4 text-sidebar-foreground/40 group-hover:text-destructive flex-shrink-0" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
