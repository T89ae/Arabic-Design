import { AppLayout } from "@/components/layout/AppLayout";
import { useWorkers, useTransfers, useTransactions, useTasks } from "@/hooks/use-data";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  Users, Wallet, ShoppingCart, Clock, ArrowRightLeft,
  Package, UserCheck, UserCog, TrendingDown,
  RefreshCw, Pause, Play, CheckSquare
} from "lucide-react";

const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"];
const EXPENSE_CATEGORIES = ["رواتب", "صيانة", "مشتريات", "خدمات", "نقل"];
const PIE_COLORS = ["#0A2342", "#F9B264", "#3A7CA5", "#2E7D64", "#e08800"];

function randomInRange(base: number, delta: number) {
  return Math.max(0, base + (Math.random() - 0.5) * delta);
}

function generateInitialState() {
  return {
    totalWorkers: 12,
    currentBalance: 15480.75,
    totalSales: 28750,
    pendingTasks: 5,
    transfers: 3,
    inventory: 48,
    saudiEmployees: 8,
    clients: 24,
    expenses: 9320.5,
    revenueData: [12500, 14800, 16200, 18900, 22300, 19500],
    expenseMonthly: [4800, 5200, 6100, 7300, 8100, 7700],
    expenseValues: [4200, 1850, 2100, 750, 420],
    tasks: [
      { id: 1, title: "تسليم مشروع النظافة العامة", date: "2026-03-25", status: "قيد التنفيذ" },
      { id: 2, title: "صيانة معدات الفريق الميداني", date: "2026-03-24", status: "مكتملة" },
      { id: 3, title: "مقابلة عملاء جدد", date: "2026-03-26", status: "معلقة" },
      { id: 4, title: "تحديث المخزون", date: "2026-03-23", status: "مكتملة" },
      { id: 5, title: "إعداد تقرير الإيرادات الشهري", date: "2026-03-27", status: "مستعجلة" },
    ],
  };
}

type DashState = ReturnType<typeof generateInitialState>;

function randomizeData(prev: DashState): DashState {
  const tasks = [...prev.tasks];
  if (Math.random() > 0.7) {
    const pool = [
      { title: "مراجعة عقود جديدة", status: "معلقة" },
      { title: "تحديث بيانات الموظفين", status: "قيد التنفيذ" },
      { title: "صيانة دورية للمعدات", status: "مستعجلة" },
      { title: "اجتماع مع الشركاء", status: "معلقة" },
    ];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    tasks.unshift({ id: Date.now(), title: pick.title, date: new Date().toISOString().split("T")[0], status: pick.status });
    if (tasks.length > 8) tasks.pop();
  }
  return {
    totalWorkers: Math.floor(10 + Math.random() * 15),
    currentBalance: Math.max(0, +(prev.currentBalance + (Math.random() - 0.5) * 800).toFixed(2)),
    totalSales: Math.max(0, +(prev.totalSales + (Math.random() - 0.5) * 1200).toFixed(2)),
    pendingTasks: Math.max(0, prev.pendingTasks + Math.floor(Math.random() * 3) - 1),
    transfers: Math.max(0, prev.transfers + Math.floor(Math.random() * 2)),
    inventory: Math.max(0, prev.inventory + Math.floor(Math.random() * 7) - 2),
    saudiEmployees: Math.max(0, prev.saudiEmployees + Math.floor(Math.random() * 3) - 1),
    clients: Math.max(0, prev.clients + Math.floor(Math.random() * 5) - 1),
    expenses: Math.max(0, +(prev.expenses + (Math.random() - 0.5) * 400).toFixed(2)),
    revenueData: prev.revenueData.map(v => Math.max(5000, Math.round(randomInRange(v, 800)))),
    expenseMonthly: prev.expenseMonthly.map(v => Math.max(2000, Math.round(randomInRange(v, 500)))),
    expenseValues: prev.expenseValues.map(v => Math.max(100, Math.round(randomInRange(v, 300)))),
    tasks,
  };
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  "مكتملة":      { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  "معلقة":       { bg: "bg-orange-50",  text: "text-orange-600",  dot: "bg-orange-400" },
  "مستعجلة":     { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-500" },
  "قيد التنفيذ": { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-500" },
};

function formatNum(n: number, currency = false) {
  const s = n.toLocaleString("ar-SA");
  return currency ? `${s} ﷼` : s;
}

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-full shadow-xl text-sm font-semibold animate-[slideUp_.3s_ease]">
      <CheckSquare className="w-4 h-4" />
      {message}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashState>(generateInitialState);
  const [autoOn, setAutoOn] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const [toast, setToast] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const countRef = useRef(countdown);
  countRef.current = countdown;

  const { data: workers = [] } = useWorkers();
  const { data: transfers = [] } = useTransfers();
  const { data: transactions = [] } = useTransactions();
  const { data: tasks = [] } = useTasks();

  const doUpdate = useCallback((showToast = true) => {
    setUpdating(true);
    setData(prev => randomizeData(prev));
    setTimeout(() => setUpdating(false), 300);
    if (showToast) {
      const t = new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setToast(`تم تحديث البيانات بنجاح ${t}`);
      setTimeout(() => setToast(null), 3000);
    }
  }, []);

  useEffect(() => {
    if (!autoOn) return;
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          doUpdate(true);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [autoOn, doUpdate]);

  useEffect(() => {
    if (!autoOn) setCountdown(30);
  }, [autoOn]);

  // build real KPIs from localStorage data where available, else use dashboard state
  const activeWorkers = workers.filter(w => w.status === "active").length || data.totalWorkers;
  const pendingTransfers = transfers.filter(t => t.status === "pending").length || data.transfers;
  const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0) || data.totalSales;
  const expTotal = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0) || data.expenses;

  const kpis = [
    { label: "إجمالي العمال",       value: formatNum(activeWorkers),          icon: Users,         color: "text-blue-500",   bg: "bg-blue-50" },
    { label: "الرصيد الحالي",       value: formatNum(income, true),           icon: Wallet,        color: "text-emerald-600",bg: "bg-emerald-50" },
    { label: "إجمالي المبيعات",     value: formatNum(data.totalSales, true),  icon: ShoppingCart,  color: "text-amber-500",  bg: "bg-amber-50" },
    { label: "المهام المعلقة",      value: formatNum(tasks.filter(t => t.status === "pending").length || data.pendingTasks), icon: Clock, color: "text-rose-500", bg: "bg-rose-50" },
    { label: "الحوالات",            value: formatNum(pendingTransfers),        icon: ArrowRightLeft,color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "المخزون",             value: formatNum(data.inventory),          icon: Package,       color: "text-teal-600",   bg: "bg-teal-50" },
    { label: "الموظفون السعوديون",  value: formatNum(data.saudiEmployees),     icon: UserCheck,     color: "text-green-600",  bg: "bg-green-50" },
    { label: "العملاء",             value: formatNum(data.clients),            icon: UserCog,       color: "text-purple-500", bg: "bg-purple-50" },
    { label: "النفقات",             value: formatNum(expTotal, true),          icon: TrendingDown,  color: "text-red-500",    bg: "bg-red-50" },
  ];

  const chartData = MONTHS.map((name, i) => ({
    name,
    إيرادات: data.revenueData[i],
    مصروفات: data.expenseMonthly[i],
  }));

  const pieData = EXPENSE_CATEGORIES.map((name, i) => ({ name, value: data.expenseValues[i] }));

  const now = new Date();
  const dateStr = now.toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  return (
    <AppLayout title="لوحة التحكم">

      {/* Header */}
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight">حلول للخدمات العامة</h1>
          <p className="text-sm text-muted-foreground mt-0.5">لوحة التحكم · نظرة عامة على أعمالك</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Countdown */}
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm text-muted-foreground">
            <RefreshCw className={`w-3.5 h-3.5 ${autoOn ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
            <span>تحديث تلقائي بعد</span>
            <span className="font-black text-blue-500 text-base min-w-[2.5rem] text-center">
              {autoOn ? countdown : "—"}
            </span>
            <span>ثانية</span>
          </div>

          {/* Manual Update */}
          <button
            onClick={() => { doUpdate(true); setCountdown(30); }}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-400 hover:-translate-y-0.5 px-4 py-2 rounded-full text-sm font-semibold text-foreground transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            تحديث يدوي
          </button>

          {/* Toggle Auto */}
          <button
            onClick={() => setAutoOn(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              autoOn
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
          >
            {autoOn ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {autoOn ? "إيقاف التحديث التلقائي" : "تشغيل التحديث التلقائي"}
          </button>

          {/* Date */}
          <div className="bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium text-foreground border border-slate-100">
            {dateStr}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className={`bg-white border border-slate-100 rounded-3xl p-4 flex items-center justify-between shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
              updating ? "bg-yellow-50 border-yellow-200" : ""
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 leading-tight">{kpi.label}</p>
              <p className="text-xl font-black text-foreground leading-tight">{kpi.value}</p>
            </div>
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${kpi.bg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-blue-500">📈</span>
            الإيرادات والمصروفات
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "13px" }}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="إيرادات" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={18} />
                <Bar dataKey="مصروفات" fill="#f97316" radius={[6, 6, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <h3 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-emerald-500">🥧</span>
            توزيع النفقات
          </h3>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: "13px" }}
                  formatter={(v: number) => [`${v.toLocaleString("ar-SA")} ﷼`, ""]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span style={{ fontSize: 12, color: "#475569" }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-500" />
            آخر المهام
          </h3>
          <button className="border border-slate-200 hover:border-slate-400 hover:bg-slate-50 text-foreground text-xs font-semibold px-4 py-1.5 rounded-full transition-all">
            فتح السجل ←
          </button>
        </div>

        {data.tasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">لا توجد مهام مسجلة حالياً</p>
        ) : (
          <div className="flex flex-col divide-y divide-slate-50">
            {data.tasks.slice(0, 6).map(task => {
              const cfg = STATUS_CONFIG[task.status] ?? STATUS_CONFIG["معلقة"];
              return (
                <div key={task.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{task.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
                    {task.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && <Toast message={toast} />}
    </AppLayout>
  );
}
