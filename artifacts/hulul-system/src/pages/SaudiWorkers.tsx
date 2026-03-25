import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSaudiWorkers, useCreateSaudiWorker, useDeleteSaudiWorker } from "@/hooks/use-data";
import { Trash2, Search, UserCheck } from "lucide-react";
import { PageHeader, KpiRow, TableWrap, Modal, FormGroup, Btn, EmptyState, StatusBadge } from "@/components/shared/UI";

export default function SaudiWorkers() {
  const { data: items = [] } = useSaudiWorkers();
  const add = useCreateSaudiWorker();
  const del = useDeleteSaudiWorker();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "", id_number: "", profession: "", phone: "", salary: "", status: "active" as "active"|"inactive", notes: "", createdAt: new Date().toISOString()
  });

  const filtered = items.filter(w => !search || w.name.includes(search) || w.profession.includes(search));
  const active = items.filter(w => w.status === "active");
  const totalSalaries = active.reduce((s, w) => s + w.salary, 0);

  const handleSubmit = () => {
    if (!form.name || !form.id_number) return;
    add.mutate({ ...form, salary: +form.salary });
    setOpen(false);
    setForm({ name: "", id_number: "", profession: "", phone: "", salary: "", status: "active", notes: "", createdAt: new Date().toISOString() });
  };

  return (
    <AppLayout title="العمال السعوديون">
      <PageHeader title="🇸🇦 العمال السعوديون" onAdd={() => setOpen(true)} addLabel="إضافة موظف سعودي" />

      <KpiRow items={[
        { label: "إجمالي العمال",   value: items.length.toLocaleString("ar-SA"),         color: "blue" },
        { label: "نشط",             value: active.length.toLocaleString("ar-SA"),         color: "green" },
        { label: "إجمالي الرواتب", value: `${totalSalaries.toLocaleString("ar-SA")} ﷼`,  color: "amber" },
        { label: "غير نشط",         value: (items.length - active.length).toLocaleString("ar-SA"), color: "muted" },
      ]} />

      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input pr-8 w-56" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <TableWrap>
        <table>
          <thead><tr><th>الاسم</th><th>رقم الهوية</th><th>المهنة</th><th>الهاتف</th><th>الراتب</th><th>الحالة</th><th>ملاحظات</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && <EmptyState icon="🇸🇦" label="لا يوجد موظفون سعوديون مسجلون" />}
            {filtered.map(w => (
              <tr key={w.id}>
                <td className="font-semibold">{w.name}</td>
                <td dir="ltr" className="text-muted-foreground font-mono">{w.id_number}</td>
                <td>{w.profession}</td>
                <td dir="ltr" className="text-muted-foreground">{w.phone}</td>
                <td className="font-bold text-blue-600">{w.salary.toLocaleString("ar-SA")} ﷼</td>
                <td><StatusBadge status={w.status} /></td>
                <td className="text-muted-foreground">{w.notes || "—"}</td>
                <td><button onClick={() => del.mutate(w.id)} className="icon-btn text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة موظف سعودي">
        <div className="form-grid">
          <FormGroup label="الاسم الكامل"><input className="input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="الاسم" /></FormGroup>
          <FormGroup label="رقم الهوية"><input className="input" value={form.id_number} onChange={e => setForm(p=>({...p,id_number:e.target.value}))} dir="ltr" placeholder="10xxxxxxxx" /></FormGroup>
          <FormGroup label="المهنة"><input className="input" value={form.profession} onChange={e => setForm(p=>({...p,profession:e.target.value}))} /></FormGroup>
          <FormGroup label="الهاتف"><input className="input" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} dir="ltr" /></FormGroup>
          <FormGroup label="الراتب (﷼)"><input type="number" className="input" value={form.salary} onChange={e => setForm(p=>({...p,salary:e.target.value}))} /></FormGroup>
          <FormGroup label="الحالة">
            <select className="input" value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value as any}))}>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </select>
          </FormGroup>
          <div className="col-span-2">
            <FormGroup label="ملاحظات"><input className="input" value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} placeholder="اختياري" /></FormGroup>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="outline" onClick={() => setOpen(false)}>إلغاء</Btn>
          <Btn onClick={handleSubmit} loading={add.isPending}>حفظ</Btn>
        </div>
      </Modal>
    </AppLayout>
  );
}
