import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useExpenses, useCreateExpense, useDeleteExpense } from "@/hooks/use-data";
import { Trash2, Search } from "lucide-react";
import { PageHeader, KpiRow, TableWrap, Modal, FormGroup, Btn } from "@/components/shared/UI";

const CATS = ["رواتب", "صيانة", "مشتريات", "خدمات", "نقل", "نثريات", "أخرى"];

export default function Expenses() {
  const { data: items = [] } = useExpenses();
  const add  = useCreateExpense();
  const del  = useDeleteExpense();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ item: "", category: "نثريات", amount: "", method: "cash" as "cash"|"bank", vendor: "", date: new Date().toISOString().split("T")[0], notes: "" });

  const filtered = items.filter(e =>
    (!search || e.item.includes(search) || e.vendor.includes(search)) &&
    (!catFilter || e.category === catFilter)
  );

  const total      = items.reduce((s, e) => s + e.amount, 0);
  const thisMonth  = items.filter(e => e.date.startsWith(new Date().toISOString().slice(0,7))).reduce((s, e) => s + e.amount, 0);
  const cash       = items.filter(e => e.method === "cash").reduce((s, e) => s + e.amount, 0);

  const handleSubmit = () => {
    if (!form.item || !form.amount) return;
    add.mutate({ ...form, amount: +form.amount });
    setOpen(false);
    setForm({ item: "", category: "نثريات", amount: "", method: "cash", vendor: "", date: new Date().toISOString().split("T")[0], notes: "" });
  };

  return (
    <AppLayout title="المصروفات">
      <PageHeader title="💳 المصروفات" onAdd={() => setOpen(true)} addLabel="مصروف جديد" />

      <KpiRow items={[
        { label: "إجمالي المصروفات", value: `${total.toLocaleString("ar-SA")} ﷼`, color: "red" },
        { label: "هذا الشهر",        value: `${thisMonth.toLocaleString("ar-SA")} ﷼`, color: "amber" },
        { label: "نقداً",            value: `${cash.toLocaleString("ar-SA")} ﷼`, color: "blue" },
        { label: "عدد البنود",       value: items.length.toLocaleString("ar-SA"), color: "muted" },
      ]} />

      {/* Filters */}
      <div className="flex gap-3 flex-wrap mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input pr-8 w-56" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">كل الفئات</option>
          {CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <TableWrap>
        <table>
          <thead><tr>
            <th>البند</th><th>الفئة</th><th>المبلغ</th><th>طريقة الدفع</th><th>المورد</th><th>التاريخ</th><th></th>
          </tr></thead>
          <tbody>
            {filtered.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">لا توجد مصروفات</td></tr>}
            {filtered.map(e => (
              <tr key={e.id}>
                <td className="font-semibold">{e.item}</td>
                <td><Badge color="blue">{e.category}</Badge></td>
                <td className="font-bold text-red-600">{e.amount.toLocaleString("ar-SA")} ﷼</td>
                <td>{e.method === "cash" ? "نقداً" : "بنكي"}</td>
                <td>{e.vendor || "—"}</td>
                <td className="text-muted-foreground">{e.date}</td>
                <td>
                  <button onClick={() => del.mutate(e.id)} className="icon-btn text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة مصروف">
        <div className="form-grid">
          <FormGroup label="البند"><input className="input" value={form.item} onChange={e => setForm(p=>({...p, item: e.target.value}))} placeholder="اسم البند" /></FormGroup>
          <FormGroup label="الفئة"><select className="input" value={form.category} onChange={e => setForm(p=>({...p, category: e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></FormGroup>
          <FormGroup label="المبلغ (﷼)"><input type="number" className="input" value={form.amount} onChange={e => setForm(p=>({...p, amount: e.target.value}))} /></FormGroup>
          <FormGroup label="طريقة الدفع"><select className="input" value={form.method} onChange={e => setForm(p=>({...p, method: e.target.value as any}))}><option value="cash">نقداً</option><option value="bank">بنكي</option></select></FormGroup>
          <FormGroup label="المورد"><input className="input" value={form.vendor} onChange={e => setForm(p=>({...p, vendor: e.target.value}))} placeholder="اختياري" /></FormGroup>
          <FormGroup label="التاريخ"><input type="date" className="input" value={form.date} onChange={e => setForm(p=>({...p, date: e.target.value}))} /></FormGroup>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="outline" onClick={() => setOpen(false)}>إلغاء</Btn>
          <Btn onClick={handleSubmit} loading={add.isPending}>حفظ</Btn>
        </div>
      </Modal>
    </AppLayout>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const map: Record<string, string> = { blue: "bg-blue-50 text-blue-700", green: "bg-emerald-50 text-emerald-700" };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${map[color] || "bg-slate-100 text-slate-600"}`}>{children}</span>;
}
