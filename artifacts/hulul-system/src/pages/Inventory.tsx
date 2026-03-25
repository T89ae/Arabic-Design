import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useInventory, useCreateInventoryItem, useDeleteInventoryItem } from "@/hooks/use-data";
import { Trash2, Search, AlertTriangle } from "lucide-react";
import { PageHeader, KpiRow, TableWrap, Modal, FormGroup, Btn, EmptyState } from "@/components/shared/UI";

const CATS = ["معدات", "مستهلكات", "ملابس", "أجهزة", "مواد", "أخرى"];

export default function Inventory() {
  const { data: items = [] } = useInventory();
  const add = useCreateInventoryItem();
  const del = useDeleteInventoryItem();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "معدات", qty: "", minQty: "5", unit: "قطعة", price: "", updatedAt: new Date().toISOString() });

  const filtered = items.filter(i => !search || i.name.includes(search));
  const totalValue = items.reduce((s, i) => s + i.qty * i.price, 0);
  const lowStock = items.filter(i => i.qty <= i.minQty);

  const handleSubmit = () => {
    if (!form.name || !form.qty) return;
    add.mutate({ ...form, qty: +form.qty, minQty: +form.minQty, price: +form.price });
    setOpen(false);
    setForm({ name: "", category: "معدات", qty: "", minQty: "5", unit: "قطعة", price: "", updatedAt: new Date().toISOString() });
  };

  return (
    <AppLayout title="الجرد والمخزون">
      <PageHeader title="📦 الجرد والمخزون" onAdd={() => setOpen(true)} addLabel="إضافة صنف" />

      {lowStock.length > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5 text-sm font-semibold text-amber-700">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          تنبيه: {lowStock.length} {lowStock.length === 1 ? "صنف وصل" : "أصناف وصلت"} للحد الأدنى ← {lowStock.map(i=>i.name).join("، ")}
        </div>
      )}

      <KpiRow items={[
        { label: "إجمالي القيمة", value: `${totalValue.toLocaleString("ar-SA")} ﷼`, color: "green" },
        { label: "عدد الأصناف",   value: items.length.toLocaleString("ar-SA"),       color: "blue" },
        { label: "تحت الحد الأدنى", value: lowStock.length.toLocaleString("ar-SA"), color: "red" },
        { label: "إجمالي الكميات", value: items.reduce((s,i)=>s+i.qty,0).toLocaleString("ar-SA"), color: "muted" },
      ]} />

      <div className="flex gap-3 mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input pr-8 w-56" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <TableWrap>
        <table>
          <thead><tr><th>الصنف</th><th>الفئة</th><th>الكمية</th><th>الحد الأدنى</th><th>الوحدة</th><th>السعر</th><th>القيمة الإجمالية</th><th>الحالة</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && <EmptyState icon="📦" label="لا توجد أصناف في المخزن" />}
            {filtered.map(item => (
              <tr key={item.id}>
                <td className="font-semibold">{item.name}</td>
                <td><span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{item.category}</span></td>
                <td className="font-bold">{item.qty}</td>
                <td className="text-muted-foreground">{item.minQty}</td>
                <td>{item.unit}</td>
                <td>{item.price.toLocaleString("ar-SA")} ﷼</td>
                <td className="font-bold text-blue-600">{(item.qty * item.price).toLocaleString("ar-SA")} ﷼</td>
                <td>
                  {item.qty <= item.minQty
                    ? <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">نقص</span>
                    : <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">متوفر</span>}
                </td>
                <td><button onClick={() => del.mutate(item.id)} className="icon-btn text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة صنف للمخزن">
        <div className="form-grid">
          <FormGroup label="اسم الصنف"><input className="input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="اسم الصنف" /></FormGroup>
          <FormGroup label="الفئة"><select className="input" value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))}>{CATS.map(c=><option key={c}>{c}</option>)}</select></FormGroup>
          <FormGroup label="الكمية الحالية"><input type="number" className="input" value={form.qty} onChange={e => setForm(p=>({...p,qty:e.target.value}))} min={0} /></FormGroup>
          <FormGroup label="الحد الأدنى"><input type="number" className="input" value={form.minQty} onChange={e => setForm(p=>({...p,minQty:e.target.value}))} min={0} /></FormGroup>
          <FormGroup label="الوحدة"><input className="input" value={form.unit} onChange={e => setForm(p=>({...p,unit:e.target.value}))} placeholder="قطعة / كرتون / كيلو" /></FormGroup>
          <FormGroup label="السعر (﷼)"><input type="number" className="input" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} /></FormGroup>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="outline" onClick={() => setOpen(false)}>إلغاء</Btn>
          <Btn onClick={handleSubmit} loading={add.isPending}>حفظ</Btn>
        </div>
      </Modal>
    </AppLayout>
  );
}
