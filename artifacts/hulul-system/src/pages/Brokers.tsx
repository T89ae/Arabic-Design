import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useBrokers, useCreateBroker, useDeleteBroker } from "@/hooks/use-data";
import { Trash2, Search } from "lucide-react";
import { PageHeader, KpiRow, TableWrap, Modal, FormGroup, Btn, EmptyState } from "@/components/shared/UI";

export default function Brokers() {
  const { data: items = [] } = useBrokers();
  const add = useCreateBroker();
  const del = useDeleteBroker();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", specialty: "تجنيد", totalDue: "", paid: "0", dueDate: new Date().toISOString().split("T")[0], notes: "", createdAt: new Date().toISOString() });

  const filtered = items.filter(b => !search || b.name.includes(search));
  const totalDue = items.reduce((s, b) => s + (b.totalDue - b.paid), 0);
  const totalPaid = items.reduce((s, b) => s + b.paid, 0);

  const handleSubmit = () => {
    if (!form.name) return;
    add.mutate({ ...form, totalDue: +form.totalDue, paid: +form.paid });
    setOpen(false);
    setForm({ name: "", phone: "", specialty: "تجنيد", totalDue: "", paid: "0", dueDate: new Date().toISOString().split("T")[0], notes: "", createdAt: new Date().toISOString() });
  };

  return (
    <AppLayout title="الوسطاء والعمولات">
      <PageHeader title="🤝 الوسطاء والعمولات" onAdd={() => setOpen(true)} addLabel="إضافة وسيط" />

      <KpiRow items={[
        { label: "إجمالي الوسطاء",    value: items.length.toLocaleString("ar-SA"),               color: "blue" },
        { label: "المبلغ المستحق",     value: `${totalDue.toLocaleString("ar-SA")} ﷼`,            color: "red" },
        { label: "إجمالي المدفوع",     value: `${totalPaid.toLocaleString("ar-SA")} ﷼`,           color: "green" },
        { label: "متأخر السداد",       value: items.filter(b => b.totalDue > b.paid).length.toLocaleString("ar-SA"), color: "amber" },
      ]} />

      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input pr-8 w-56" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <TableWrap>
        <table>
          <thead><tr><th>الاسم</th><th>الهاتف</th><th>التخصص</th><th>إجمالي العمولة</th><th>المدفوع</th><th>المتبقي</th><th>تاريخ الاستحقاق</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && <EmptyState icon="🤝" label="لا يوجد وسطاء مسجلون" />}
            {filtered.map(b => {
              const remaining = b.totalDue - b.paid;
              return (
                <tr key={b.id}>
                  <td className="font-semibold">{b.name}</td>
                  <td dir="ltr" className="text-muted-foreground">{b.phone}</td>
                  <td><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{b.specialty}</span></td>
                  <td className="font-bold">{b.totalDue.toLocaleString("ar-SA")} ﷼</td>
                  <td className="text-emerald-600">{b.paid.toLocaleString("ar-SA")} ﷼</td>
                  <td className={`font-bold ${remaining > 0 ? "text-red-600" : "text-emerald-600"}`}>{remaining.toLocaleString("ar-SA")} ﷼</td>
                  <td className="text-muted-foreground">{b.dueDate}</td>
                  <td>
                    {remaining <= 0
                      ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">مسدد</span>
                      : <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">مستحق</span>}
                  </td>
                  <td><button onClick={() => del.mutate(b.id)} className="icon-btn text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة وسيط">
        <div className="form-grid">
          <FormGroup label="الاسم"><input className="input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="اسم الوسيط" /></FormGroup>
          <FormGroup label="الهاتف"><input className="input" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} dir="ltr" /></FormGroup>
          <FormGroup label="التخصص"><input className="input" value={form.specialty} onChange={e => setForm(p=>({...p,specialty:e.target.value}))} /></FormGroup>
          <FormGroup label="إجمالي العمولة (﷼)"><input type="number" className="input" value={form.totalDue} onChange={e => setForm(p=>({...p,totalDue:e.target.value}))} /></FormGroup>
          <FormGroup label="المدفوع (﷼)"><input type="number" className="input" value={form.paid} onChange={e => setForm(p=>({...p,paid:e.target.value}))} /></FormGroup>
          <FormGroup label="تاريخ الاستحقاق"><input type="date" className="input" value={form.dueDate} onChange={e => setForm(p=>({...p,dueDate:e.target.value}))} /></FormGroup>
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
