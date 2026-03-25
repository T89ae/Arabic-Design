import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useSales, useCreateSale, useDeleteSale } from "@/hooks/use-data";
import { Trash2, Search, TrendingUp } from "lucide-react";
import { PageHeader, KpiRow, TableWrap, Modal, FormGroup, Btn, EmptyState } from "@/components/shared/UI";

const CATS = ["خدمات", "أمن", "نقل", "نظافة", "صيانة", "استشارات", "أخرى"];

export default function Sales() {
  const { data: items = [] } = useSales();
  const add = useCreateSale();
  const del = useDeleteSale();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ item: "", category: "خدمات", qty: "1", price: "", cost: "", customer: "", date: new Date().toISOString().split("T")[0], notes: "" });

  const filtered = items.filter(s => !search || s.item.includes(search) || s.customer.includes(search));
  const totalRevenue = items.reduce((s, v) => s + v.qty * v.price, 0);
  const totalProfit  = items.reduce((s, v) => s + (v.price - v.cost) * v.qty, 0);
  const thisMonth    = items.filter(v => v.date.startsWith(new Date().toISOString().slice(0,7))).reduce((s,v) => s + v.qty * v.price, 0);

  const handleSubmit = () => {
    if (!form.item || !form.price) return;
    add.mutate({ ...form, qty: +form.qty, price: +form.price, cost: +form.cost });
    setOpen(false);
    setForm({ item: "", category: "خدمات", qty: "1", price: "", cost: "", customer: "", date: new Date().toISOString().split("T")[0], notes: "" });
  };

  return (
    <AppLayout title="المبيعات">
      <PageHeader title="📦 المبيعات" onAdd={() => setOpen(true)} addLabel="تسجيل بيع" />
      <KpiRow items={[
        { label: "إجمالي الإيرادات", value: `${totalRevenue.toLocaleString("ar-SA")} ﷼`, color: "green" },
        { label: "صافي الربح",       value: `${totalProfit.toLocaleString("ar-SA")} ﷼`,  color: "blue" },
        { label: "هذا الشهر",        value: `${thisMonth.toLocaleString("ar-SA")} ﷼`,    color: "amber" },
        { label: "عدد الصفقات",      value: items.length.toLocaleString("ar-SA"),         color: "muted" },
      ]} />

      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input pr-8 w-56" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <TableWrap>
        <table>
          <thead><tr><th>الصنف</th><th>الفئة</th><th>الكمية</th><th>السعر</th><th>التكلفة</th><th>الربح</th><th>العميل</th><th>التاريخ</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && <EmptyState icon="📊" label="لا توجد مبيعات مسجلة بعد" />}
            {filtered.map(s => (
              <tr key={s.id}>
                <td className="font-semibold">{s.item}</td>
                <td><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{s.category}</span></td>
                <td>{s.qty}</td>
                <td className="font-bold text-emerald-600">{(s.qty * s.price).toLocaleString("ar-SA")} ﷼</td>
                <td className="text-red-500">{(s.qty * s.cost).toLocaleString("ar-SA")} ﷼</td>
                <td className="font-bold text-blue-600">{((s.price - s.cost) * s.qty).toLocaleString("ar-SA")} ﷼</td>
                <td>{s.customer || "—"}</td>
                <td className="text-muted-foreground">{s.date}</td>
                <td><button onClick={() => del.mutate(s.id)} className="icon-btn text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={open} onClose={() => setOpen(false)} title="تسجيل عملية بيع">
        <div className="form-grid">
          <FormGroup label="الصنف / الخدمة"><input className="input" value={form.item} onChange={e => setForm(p=>({...p,item:e.target.value}))} placeholder="اسم الصنف أو الخدمة" /></FormGroup>
          <FormGroup label="الفئة"><select className="input" value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></FormGroup>
          <FormGroup label="الكمية"><input type="number" className="input" value={form.qty} onChange={e => setForm(p=>({...p,qty:e.target.value}))} min={1} /></FormGroup>
          <FormGroup label="سعر البيع (﷼)"><input type="number" className="input" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} /></FormGroup>
          <FormGroup label="التكلفة (﷼)"><input type="number" className="input" value={form.cost} onChange={e => setForm(p=>({...p,cost:e.target.value}))} /></FormGroup>
          <FormGroup label="العميل"><input className="input" value={form.customer} onChange={e => setForm(p=>({...p,customer:e.target.value}))} placeholder="اختياري" /></FormGroup>
          <FormGroup label="التاريخ"><input type="date" className="input" value={form.date} onChange={e => setForm(p=>({...p,date:e.target.value}))} /></FormGroup>
          <FormGroup label="ملاحظات"><input className="input" value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} placeholder="اختياري" /></FormGroup>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="outline" onClick={() => setOpen(false)}>إلغاء</Btn>
          <Btn onClick={handleSubmit} loading={add.isPending}>حفظ</Btn>
        </div>
      </Modal>
    </AppLayout>
  );
}
