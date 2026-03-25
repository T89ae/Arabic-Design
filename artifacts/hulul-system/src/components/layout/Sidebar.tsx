import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, ArrowRightLeft, CheckSquare, Wallet,
  LineChart, Settings, LogOut, CalendarCheck, ShoppingCart,
  CreditCard, Package, Phone, Handshake, UserCheck, Activity
} from "lucide-react";

const navGroups = [
  {
    title: "الرئيسية",
    items: [
      { name: "لوحة التحكم", icon: LayoutDashboard, path: "/" },
    ],
  },
  {
    title: "العمل اليومي",
    items: [
      { name: "العمال والكفلاء",    icon: Users,           path: "/workers" },
      { name: "الحوالات",           icon: ArrowRightLeft,  path: "/transfers" },
      { name: "المهام",             icon: CheckSquare,     path: "/tasks" },
      { name: "الحضور والغياب",     icon: CalendarCheck,   path: "/attendance" },
      { name: "العمال السعوديون",   icon: UserCheck,       path: "/saudi-workers" },
    ],
  },
  {
    title: "المالية",
    items: [
      { name: "المحاسبة والمالية",  icon: Wallet,          path: "/finance" },
      { name: "المبيعات",           icon: ShoppingCart,    path: "/sales" },
      { name: "المصروفات",          icon: CreditCard,      path: "/expenses" },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { name: "الجرد والمخزون",     icon: Package,         path: "/inventory" },
      { name: "جهات الاتصال",       icon: Phone,           path: "/contacts" },
      { name: "الوسطاء والعمولات",  icon: Handshake,       path: "/brokers" },
    ],
  },
  {
    title: "أخرى",
    items: [
      { name: "التقارير",           icon: LineChart,       path: "/reports" },
      { name: "سجل النشاطات",       icon: Activity,        path: "/activity" },
      { name: "الإعدادات",          icon: Settings,        path: "/settings" },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen fixed right-0 top-0 border-l border-sidebar-accent/20 z-40 shadow-2xl shadow-primary/10">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-accent/30 bg-sidebar-accent/10 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-primary font-bold text-xl ml-3 shadow-inner shadow-white/20">
          ح
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">نظام حلول</h1>
          <p className="text-[10px] text-sidebar-foreground/50 font-medium">للخدمات العامة</p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
        {navGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-[10px] font-bold text-sidebar-foreground/40 uppercase tracking-wider mb-1.5">
              {group.title}
            </h3>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-xl transition-all duration-200 group text-sm font-semibold",
                        isActive
                          ? "bg-accent/15 text-accent border border-accent/20 shadow-sm"
                          : "text-sidebar-foreground/70 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className={cn(
                        "w-4 h-4 ml-3 transition-colors flex-shrink-0",
                        isActive ? "text-accent" : "text-sidebar-foreground/40 group-hover:text-white"
                      )} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-accent/30 flex-shrink-0">
        <button className="flex items-center w-full px-3 py-2.5 rounded-xl text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-colors text-sm font-semibold group">
          <LogOut className="w-4 h-4 ml-3 text-sidebar-foreground/40 group-hover:text-destructive" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
