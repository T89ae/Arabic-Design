import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/context/SidebarContext";

export function Topbar({ title }: { title: string }) {
  const { toggle } = useSidebar();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-sm shadow-primary/5 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Hamburger — always visible, toggles sidebar */}
        <button
          onClick={toggle}
          className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors flex-shrink-0"
          title="تبديل القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-primary truncate">{title}</h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search — hidden on small screens */}
        <div className="relative hidden md:block w-52 lg:w-64">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث سريع..."
            className="pl-3 pr-9 h-9 bg-muted/50 border-transparent focus:bg-white rounded-xl text-sm"
          />
        </div>

        {/* Notification bell */}
        <button className="relative p-2 text-muted-foreground hover:bg-accent/10 hover:text-accent rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white" />
        </button>

        <div className="h-7 w-px bg-border hidden sm:block" />

        {/* User avatar */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-xl transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20 flex-shrink-0">
            م
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-foreground leading-none">المدير العام</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">مدير النظام</p>
          </div>
        </div>
      </div>
    </header>
  );
}
