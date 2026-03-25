import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, ArrowRightLeft, CheckSquare } from "lucide-react";
import { useWorkers, useTransfers, useTransactions, useTasks } from "@/hooks/use-data";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { data: workers = [] } = useWorkers();
  const { data: transfers = [] } = useTransfers();
  const { data: transactions = [] } = useTransactions();
  const { data: tasks = [] } = useTasks();

  const activeWorkers = workers.filter(w => w.status === 'active').length;
  const pendingTransfers = transfers.filter(t => t.status === 'pending').length;
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const profit = income - expenses;

  const chartData = [
    { name: 'يناير', إيرادات: 4000, مصروفات: 2400 },
    { name: 'فبراير', إيرادات: 3000, مصروفات: 1398 },
    { name: 'مارس', إيرادات: 2000, مصروفات: 9800 },
    { name: 'أبريل', إيرادات: 2780, مصروفات: 3908 },
    { name: 'مايو', إيرادات: 1890, مصروفات: 4800 },
    { name: 'يونيو', إيرادات: income || 2390, مصروفات: expenses || 3800 },
  ];

  return (
    <AppLayout title="لوحة التحكم">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard 
          title="العمال النشطون" 
          value={activeWorkers.toString()} 
          icon={Users} 
          color="bg-blue-50 text-blue-600 border-blue-200" 
        />
        <KpiCard 
          title="إجمالي الإيرادات" 
          value={formatCurrency(income)} 
          icon={Wallet} 
          color="bg-emerald-50 text-emerald-600 border-emerald-200" 
        />
        <KpiCard 
          title="صافي الربح" 
          value={formatCurrency(profit)} 
          icon={LineChartIcon} 
          color="bg-amber-50 text-amber-600 border-amber-200" 
        />
        <KpiCard 
          title="حوالات معلقة" 
          value={pendingTransfers.toString()} 
          icon={ArrowRightLeft} 
          color="bg-rose-50 text-rose-600 border-rose-200" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">نظرة عامة على الأداء المالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7A8A', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7A8A', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#F5F7FA'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="إيرادات" fill="#0A2342" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="مصروفات" fill="#F9B264" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-accent" />
              المهام العاجلة
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.filter(t => t.priority === 'urgent').length === 0 ? (
              <p className="text-muted-foreground text-center py-8">لا توجد مهام عاجلة</p>
            ) : (
              tasks.filter(t => t.priority === 'urgent').map(task => (
                <div key={task.id} className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{task.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">تاريخ الاستحقاق: {new Date(task.dueDate).toLocaleDateString('ar-SA')}</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function KpiCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="rounded-2xl shadow-sm border-border/50 hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${color}`}>
          <Icon className="w-7 h-7" />
        </div>
        <div>
          <p className="text-sm font-bold text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-black text-foreground">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

// Dummy icon to fix missing import
function LineChartIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
}
