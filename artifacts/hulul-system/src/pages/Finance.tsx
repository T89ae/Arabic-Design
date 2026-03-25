import { AppLayout } from "@/components/layout/AppLayout";
import { useTransactions } from "@/hooks/use-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function Finance() {
  const { data: txs = [], isLoading } = useTransactions();

  return (
    <AppLayout title="السجل المالي الشامل">
      <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">التصنيف</TableHead>
              <TableHead className="text-right">الوصف</TableHead>
              <TableHead className="text-right">طريقة الدفع</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">جاري التحميل...</TableCell></TableRow>
            ) : txs.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">لا توجد حركات مالية</TableCell></TableRow>
            ) : (
              txs.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.date).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell>
                    {t.type === 'income' 
                      ? <Badge variant="success" className="gap-1 bg-emerald-50"><ArrowUpRight className="w-3 h-3"/> إيراد</Badge>
                      : <Badge variant="destructive" className="gap-1 bg-rose-50 text-rose-600"><ArrowDownRight className="w-3 h-3"/> مصروف</Badge>
                    }
                  </TableCell>
                  <TableCell className={`font-bold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell className="text-muted-foreground">{t.description}</TableCell>
                  <TableCell>{t.method === 'bank' ? 'تحويل بنكي' : 'نقدي'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
