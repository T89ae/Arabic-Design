import { Bell, Search, Menu, ChevronLeft } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useLocation } from "wouter";

const PAGE_LABELS: Record<string, string> = {
  "/":              "لوحة التحكم",
  "/workers":       "العمال والكفلاء",
  "/transfers":     "الحوالات",
  "/tasks":         "المهام",
  "/attendance":    "الحضور والغياب",
  "/saudi-workers": "العمال السعوديون",
  "/finance":       "المحاسبة والمالية",
  "/sales":         "المبيعات",
  "/expenses":      "المصروفات",
  "/inventory":     "الجرد والمخزون",
  "/contacts":      "جهات الاتصال",
  "/brokers":       "الوسطاء والعمولات",
  "/reports":       "التقارير",
  "/activity":      "سجل النشاطات",
  "/settings":      "الإعدادات",
};

export function Topbar({ title }: { title: string }) {
  const { toggle } = useSidebar();
  const [location] = useLocation();
  const pageLabel = PAGE_LABELS[location] || title;

  return (
    <header className="h-[57px] bg-white border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-5 flex-shrink-0">
      {/* Left: toggle + breadcrumb */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggle}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="تبديل القائمة"
        >
          <Menu className="w-[18px] h-[18px]" />
        </button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1 text-[12px] text-slate-400">
          <span className="hover:text-slate-600 cursor-pointer transition-colors">حلول</span>
          <ChevronLeft className="w-3 h-3 rotate-180" />
          <span className="text-slate-700 font-semibold">{pageLabel}</span>
        </nav>

        {/* Mobile: just title */}
        <span className="sm:hidden text-sm font-bold text-slate-700">{pageLabel}</span>
      </div>

      {/* Right: search + bell + user */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 absolute right-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="بحث سريع..."
            className="h-8 w-52 lg:w-60 pr-8 pl-3 text-[12px] bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[#0A2342] focus:bg-white transition-all font-[Cairo]"
          />
          <kbd className="absolute left-2 text-[9px] text-slate-300 font-mono hidden lg:block">⌘K</kbd>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <Bell className="w-[17px] h-[17px]" />
          <span className="absolute top-[9px] right-[9px] w-[6px] h-[6px] bg-red-500 rounded-full border border-white" />
        </button>

        <div className="w-px h-5 bg-slate-200 mx-1 hidden sm:block" />

        {/* User */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-slate-700 leading-none">المدير العام</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Administrator</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#0A2342] flex items-center justify-center text-white font-bold text-[12px] ring-2 ring-offset-1 ring-[#0A2342]/20 flex-shrink-0">
            م
          </div>
        </div>
      </div>
    </header>
  );
}
