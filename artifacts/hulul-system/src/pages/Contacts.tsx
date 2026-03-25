import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useContacts, useCreateContact, useDeleteContact } from "@/hooks/use-data";
import { Trash2, Search, Phone } from "lucide-react";
import { PageHeader, KpiRow, TableWrap, Modal, FormGroup, Btn, EmptyState } from "@/components/shared/UI";

const TYPES = ["عميل", "مورد", "شريك", "مقاول", "جهة حكومية", "أخرى"];

export default function Contacts() {
  const { data: items = [] } = useContacts();
  const add = useCreateContact();
  const del = useDeleteContact();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", type: "عميل", notes: "", createdAt: new Date().toISOString() });

  const filtered = items.filter(c =>
    (!search || c.name.includes(search) || c.phone.includes(search)) &&
    (!typeFilter || c.type === typeFilter)
  );

  const handleSubmit = () => {
    if (!form.name || !form.phone) return;
    add.mutate(form);
    setOpen(false);
    setForm({ name: "", phone: "", type: "عميل", notes: "", createdAt: new Date().toISOString() });
  };

  return (
    <AppLayout title="جهات الاتصال">
      <PageHeader title="📋 جهات الاتصال" onAdd={() => setOpen(true)} addLabel="إضافة جهة اتصال" />

      <KpiRow items={[
        { label: "إجمالي جهات الاتصال", value: items.length.toLocaleString("ar-SA"),                                         color: "blue" },
        { label: "العملاء",              value: items.filter(c=>c.type==="عميل").length.toLocaleString("ar-SA"),              color: "green" },
        { label: "الموردون",             value: items.filter(c=>c.type==="مورد").length.toLocaleString("ar-SA"),              color: "amber" },
        { label: "الشركاء",              value: items.filter(c=>c.type==="شريك").length.toLocaleString("ar-SA"),              color: "muted" },
      ]} />

      <div className="flex gap-3 flex-wrap mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input pr-8 w-56" placeholder="بحث..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-36" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">كل الأنواع</option>
          {TYPES.map(t => <option key={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted-foreground">
            <div className="text-5xl mb-3">📋</div>
            <p className="font-medium">لا توجد جهات اتصال</p>
          </div>
        )}
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-black text-foreground">{c.name}</p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${
                  c.type==="عميل" ? "bg-blue-50 text-blue-700" :
                  c.type==="مورد" ? "bg-amber-50 text-amber-700" :
                  c.type==="شريك" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                  {c.type}
                </span>
              </div>
              <button onClick={() => del.mutate(c.id)} className="icon-btn text-red-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-3.5 h-3.5" />
              <span dir="ltr">{c.phone}</span>
            </div>
            {c.notes && <p className="text-xs text-muted-foreground border-t border-slate-50 pt-2">{c.notes}</p>}
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة جهة اتصال">
        <div className="form-grid">
          <FormGroup label="الاسم"><input className="input" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} placeholder="الاسم الكامل" /></FormGroup>
          <FormGroup label="النوع"><select className="input" value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></FormGroup>
          <FormGroup label="رقم الهاتف"><input className="input" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} placeholder="05xxxxxxxx" dir="ltr" /></FormGroup>
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
