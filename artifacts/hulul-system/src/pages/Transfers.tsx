import { AppLayout } from "@/components/layout/AppLayout";
import { useTransfers, useUpdateTransferStatus } from "@/hooks/use-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function Transfers() {
  const { data: transfers = [], isLoading } = useTransfers();
  const updateMutation = useUpdateTransferStatus();

  return (
    <AppLayout title="سجل الحوالات المالية">
      <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden mt-6">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">العامل</TableHead>
              <TableHead className="text-right">المبلغ</TableHead>
              <TableHead className="text-right">ملاحظات</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-center">تحديث الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">جاري التحميل...</TableCell></TableRow>
            ) : transfers.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8">لا توجد حوالات</TableCell></TableRow>
            ) : (
              transfers.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.date).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell className="font-bold text-primary">{t.workerName}</TableCell>
                  <TableCell className="font-bold">{formatCurrency(t.amount)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">{t.notes}</TableCell>
                  <TableCell>
                    <StatusBadge status={t.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {t.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 h-8"
                            onClick={() => updateMutation.mutate({id: t.id, status: 'sent'})}
                          >
                            <CheckCircle className="w-4 h-4 ml-1" /> تم التحويل
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8"
                            onClick={() => updateMutation.mutate({id: t.id, status: 'cancelled'})}
                          >
                            <XCircle className="w-4 h-4 ml-1" /> إلغاء
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'sent': return <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3"/> مرسلة</Badge>;
    case 'cancelled': return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3"/> ملغاة</Badge>;
    case 'pending': return <Badge variant="warning" className="gap-1"><Clock className="w-3 h-3"/> قيد الانتظار</Badge>;
    default: return <Badge variant="outline">{status}</Badge>;
  }
}
