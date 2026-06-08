import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/context/SidebarContext";
import {
  LayoutDashboard, Users, ArrowRightLeft, CheckSquare, Wallet,
  LineChart, Settings, LogOut, CalendarCheck, ShoppingCart,
  CreditCard, Package, Phone, Handshake, UserCheck, Activity,
  PanelRightClose, FolderOpen,
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
      { name: "العمال والكفلاء",  icon: Users,          path: "/workers" },
      { name: "الحوالات",         icon: ArrowRightLeft, path: "/transfers" },
      { name: "المهام",           icon: CheckSquare,    path: "/tasks" },
      { name: "الحضور والغياب",   icon: CalendarCheck,  path: "/attendance" },
      { name: "العمال السعوديون", icon: UserCheck,      path: "/saudi-workers" },
    ],
  },
  {
    title: "المالية",
    items: [
      { name: "المحاسبة",   icon: Wallet,       path: "/finance" },
      { name: "المبيعات",   icon: ShoppingCart, path: "/sales" },
      { name: "المصروفات",  icon: CreditCard,   path: "/expenses" },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { name: "الجرد والمخزون",  icon: Package,  path: "/inventory" },
      { name: "جهات الاتصال",   icon: Phone,     path: "/contacts" },
      { name: "الوسطاء",        icon: Handshake, path: "/brokers" },
    ],
  },
  {
    title: "النظام",
    items: [
      { name: "التقارير",       icon: LineChart,   path: "/reports" },
      { name: "سجل النشاطات",  icon: Activity,    path: "/activity" },
      { name: "مدير الملفات",  icon: FolderOpen,  path: "/file-manager" },
      { name: "الإعدادات",     icon: Settings,    path: "/settings" },
    ],
  },
];

export function Sidebar() {
  const [location] = useLocation();
  const { open, close, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed right-0 top-0 h-full w-[240px] flex flex-col z-40 transition-transform duration-300",
        "bg-[#0A1929] text-white border-l border-white/5",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* ── Brand header ── */}
      <div className="h-[64px] flex items-center justify-between px-4 border-b border-white/8 flex-shrink-0 bg-[#0A1929]">
        <div className="flex items-center gap-2.5">
          {/* Circular logo frame */}
          <div className="w-9 h-9 rounded-full bg-white/10 ring-1 ring-white/15 flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src="/logo-transparent.png"
              alt="حلول"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="leading-none">
            <p className="text-[13px] font-bold text-white tracking-wide">نظام حلول</p>
            <p className="text-[10px] text-white/40 mt-0.5 font-medium">للخدمات العامة</p>
          </div>
        </div>

        <button
          onClick={toggle}
          title="إغلاق القائمة"
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/8 text-white/40 hover:text-white/80 transition-colors"
        >
          <PanelRightClose className="w-4 h-4" />
        </button>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4 scrollbar-thin">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            <p className="px-3 mb-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white/30 select-none">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const active = location === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => { if (window.innerWidth < 1024) close(); }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13px] font-medium transition-all duration-150 group relative",
                        active
                          ? "bg-[#F9B264]/12 text-[#F9B264] font-semibold"
                          : "text-white/55 hover:text-white/85 hover:bg-white/5"
                      )}
                    >
                      {active && (
                        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#F9B264] rounded-full" />
                      )}
                      <item.icon className={cn(
                        "w-[15px] h-[15px] flex-shrink-0 transition-colors",
                        active ? "text-[#F9B264]" : "text-white/35 group-hover:text-white/60"
                      )} />
                      <span className="truncate leading-none">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 border-t border-white/8 p-2">
        <button className="flex items-center gap-3 w-full px-3 py-[7px] rounded-lg text-[13px] font-medium text-white/45 hover:text-red-400 hover:bg-red-500/8 transition-all group">
          <LogOut className="w-[15px] h-[15px] flex-shrink-0 group-hover:text-red-400 text-white/30" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
