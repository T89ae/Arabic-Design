import { AppLayout } from "@/components/layout/AppLayout";
import { useActivityLogs } from "@/hooks/use-data";
import { Activity, Trash2, Plus, Edit3 } from "lucide-react";

const ACTION_STYLE: Record<string, string> = {
  "إضافة": "bg-emerald-50 text-emerald-700",
  "تعديل": "bg-blue-50 text-blue-700",
  "حذف":   "bg-red-50 text-red-600",
};

const ACTION_ICON: Record<string, typeof Plus> = {
  "إضافة": Plus,
  "تعديل": Edit3,
  "حذف":   Trash2,
};

export default function ActivityLog() {
  const { data: logs = [] } = useActivityLogs();

  return (
    <AppLayout title="سجل النشاطات">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          سجل النشاطات
        </h2>
        <span className="text-sm text-muted-foreground">{logs.length} نشاط مسجل</span>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">لا توجد نشاطات مسجلة بعد</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((log, i) => {
            const Icon = ACTION_ICON[log.action] || Activity;
            const style = ACTION_STYLE[log.action] || "bg-slate-100 text-slate-600";
            const t = new Date(log.timestamp);
            const timeStr = t.toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
            const dateStr = t.toLocaleDateString("ar-SA", { day: "2-digit", month: "short", year: "numeric" });
            return (
              <div key={log.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${style}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{log.details}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${style}`}>{log.action}</span>
                    <span className="text-xs text-muted-foreground">{log.section}</span>
                  </div>
                </div>
                <div className="text-left text-xs text-muted-foreground flex-shrink-0">
                  <p className="font-semibold">{timeStr}</p>
                  <p>{dateStr}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
