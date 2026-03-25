import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useWorkers, useCreateWorker, useDeleteWorker } from "@/hooks/use-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, Edit } from "lucide-react";

export default function Workers() {
  const { data: workers = [], isLoading } = useWorkers();
  const deleteMutation = useDeleteWorker();
  const [search, setSearch] = useState("");

  const filteredWorkers = workers.filter(w => 
    w.name.includes(search) || w.nationality.includes(search)
  );

  return (
    <AppLayout title="العمال والكفلاء">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="ابحث عن عامل أو كفيل..." 
            className="pl-3 pr-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <AddWorkerDialog />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border/50 overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-right">الجنسية</TableHead>
              <TableHead className="text-right">المهنة</TableHead>
              <TableHead className="text-right">رقم الجوال</TableHead>
              <TableHead className="text-right">انتهاء الإقامة</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-center">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8">جاري التحميل...</TableCell></TableRow>
            ) : filteredWorkers.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">لا يوجد عمال مطابقين للبحث</TableCell></TableRow>
            ) : (
              filteredWorkers.map((worker) => (
                <TableRow key={worker.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="font-bold text-primary">{worker.name}</TableCell>
                  <TableCell>{worker.nationality}</TableCell>
                  <TableCell>{worker.profession}</TableCell>
                  <TableCell dir="ltr" className="text-right">{worker.phone}</TableCell>
                  <TableCell>{worker.iqamaExpiry}</TableCell>
                  <TableCell>
                    <Badge variant={worker.status === 'active' ? 'success' : 'destructive'}>
                      {worker.status === 'active' ? 'نشط' : 'غير نشط'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          if (confirm("هل أنت متأكد من حذف هذا العامل؟")) {
                            deleteMutation.mutate(worker.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

function AddWorkerDialog() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateWorker();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      name: formData.get('name') as string,
      nationality: formData.get('nationality') as string,
      sponsor: formData.get('sponsor') as string || '',
      profession: formData.get('profession') as string,
      phone: formData.get('phone') as string,
      status: 'active',
      iqamaExpiry: formData.get('iqamaExpiry') as string,
      passportExpiry: formData.get('passportExpiry') as string || '',
      notes: '',
    }, {
      onSuccess: () => setOpen(false)
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="accent" className="gap-2">
          <Plus className="w-4 h-4" /> إضافة عامل جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-primary font-bold">إضافة عامل جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">الاسم الكامل</label>
              <Input name="name" required placeholder="مثال: أحمد محمد" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">الجنسية</label>
              <Input name="nationality" required placeholder="مثال: مصري" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">المهنة</label>
              <Input name="profession" required placeholder="مثال: محاسب" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">رقم الجوال</label>
              <Input name="phone" required placeholder="05xxxxxxxx" dir="ltr" className="text-right" />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-bold text-muted-foreground">تاريخ انتهاء الإقامة</label>
              <Input name="iqamaExpiry" type="date" required />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2 border-t mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "جاري الحفظ..." : "حفظ العامل"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
