import { Bell, Search, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-30 flex items-center justify-between px-6 shadow-sm shadow-primary/5">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-primary">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="بحث سريع..." 
            className="pl-3 pr-9 h-10 bg-muted/50 border-transparent focus:bg-white rounded-xl"
          />
        </div>
        
        <button className="relative p-2.5 text-muted-foreground hover:bg-accent/10 hover:text-accent rounded-xl transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-white"></span>
        </button>

        <div className="h-8 w-[1px] bg-border mx-1"></div>

        <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-1.5 rounded-xl transition-colors">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
            م
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-foreground leading-none">المدير العام</p>
            <p className="text-xs text-muted-foreground mt-1">مدير النظام</p>
          </div>
        </div>
      </div>
    </header>
  );
}
