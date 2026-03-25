import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useTransactions, useWorkers } from "@/hooks/use-data";

export default function Reports() {
  const { data: txs = [] } = useTransactions();
  const { data: workers = [] } = useWorkers();

  // Aggregate Data
  const incomeCategories = txs.filter(t => t.type === 'income').reduce((acc: any, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const pieData = Object.keys(incomeCategories).map(key => ({
    name: key,
    value: incomeCategories[key]
  }));
  if (pieData.length === 0) pieData.push({name: "لا بيانات", value: 1});

  const COLORS = ['#0A2342', '#F9B264', '#3A7CA5', '#2E7D64'];

  return (
    <AppLayout title="التقارير التحليلية">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        
        <Card className="rounded-2xl shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>مصادر الإيرادات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)'}} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-border/50 bg-gradient-to-br from-primary to-primary/90 text-white">
          <CardHeader>
            <CardTitle className="text-white">ملخص النظام</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-white/70">إجمالي العمالة المسجلة</span>
              <span className="text-3xl font-black">{workers.length}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-white/70">إجمالي الحركات المالية</span>
              <span className="text-3xl font-black">{txs.length}</span>
            </div>
            <div className="flex justify-between items-center pb-4">
              <span className="text-white/70">نسبة العمالة النشطة</span>
              <span className="text-3xl font-black text-accent">
                {workers.length ? Math.round((workers.filter(w=>w.status==='active').length / workers.length)*100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
}
