import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAttendance, useCreateAttendance, useDeleteAttendance, useWorkers } from "@/hooks/use-data";
import { Trash2, Search, Calendar } from "lucide-react";
import { PageHeader, KpiRow, TableWrap, Modal, FormGroup, Btn, EmptyState, StatusBadge } from "@/components/shared/UI";

export default function Attendance() {
  const { data: records = [] } = useAttendance();
  const { data: workers = [] } = useWorkers();
  const add = useCreateAttendance();
  const del = useDeleteAttendance();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split("T")[0]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    workerId: "", workerName: "", date: new Date().toISOString().split("T")[0],
    status: "present" as "present"|"absent"|"late", notes: ""
  });

  const filtered = records.filter(r =>
    (!search || r.workerName.includes(search)) &&
    (!dateFilter || r.date === dateFilter)
  );

  const today = records.filter(r => r.date === new Date().toISOString().split("T")[0]);
  const present = today.filter(r => r.status === "present").length;
  const absent  = today.filter(r => r.status === "absent").length;
  const late    = today.filter(r => r.status === "late").length;

  const handleWorkerChange = (id: string) => {
    const w = workers.find(w => w.id === id);
    setForm(p => ({ ...p, workerId: id, workerName: w?.name || "" }));
  };

  const handleSubmit = () => {
    if (!form.workerId) return;
    add.mutate(form);
    setOpen(false);
    setForm({ workerId: "", workerName: "", date: new Date().toISOString().split("T")[0], status: "present", notes: "" });
  };

  return (
    <AppLayout title="سجل الحضور والغياب">
      <PageHeader title="🗓 الحضور والغياب" onAdd={() => setOpen(true)} addLabel="تسجيل حضور" />

      <KpiRow items={[
        { label: "إجمالي السجلات", value: records.length.toLocaleString("ar-SA"), color: "blue" },
        { label: "حاضر اليوم",     value: present.toLocaleString("ar-SA"),        color: "green" },
        { label: "غائب اليوم",     value: absent.toLocaleString("ar-SA"),         color: "red" },
        { label: "متأخر اليوم",    value: late.toLocaleString("ar-SA"),           color: "amber" },
      ]} />

      <div className="flex gap-3 flex-wrap mb-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input className="input pr-8 w-56" placeholder="بحث بالاسم..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <input type="date" className="input" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        </div>
        <button onClick={() => setDateFilter("")} className="text-xs text-muted-foreground hover:text-foreground underline">عرض الكل</button>
      </div>

      <TableWrap>
        <table>
          <thead><tr><th>اسم العامل</th><th>التاريخ</th><th>الحالة</th><th>ملاحظات</th><th></th></tr></thead>
          <tbody>
            {filtered.length === 0 && <EmptyState icon="🗓" label="لا توجد سجلات حضور" />}
            {filtered.map(r => (
              <tr key={r.id}>
                <td className="font-semibold">{r.workerName}</td>
                <td className="text-muted-foreground">{r.date}</td>
                <td><StatusBadge status={r.status} /></td>
                <td className="text-muted-foreground">{r.notes || "—"}</td>
                <td><button onClick={() => del.mutate(r.id)} className="icon-btn text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      <Modal open={open} onClose={() => setOpen(false)} title="تسجيل حضور">
        <div className="form-grid">
          <FormGroup label="العامل">
            <select className="input" value={form.workerId} onChange={e => handleWorkerChange(e.target.value)}>
              <option value="">اختر العامل</option>
              {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </FormGroup>
          <FormGroup label="الحالة">
            <select className="input" value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value as any}))}>
              <option value="present">حاضر</option>
              <option value="absent">غائب</option>
              <option value="late">متأخر</option>
            </select>
          </FormGroup>
          <FormGroup label="التاريخ">
            <input type="date" className="input" value={form.date} onChange={e => setForm(p=>({...p,date:e.target.value}))} />
          </FormGroup>
          <FormGroup label="ملاحظات">
            <input className="input" value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} placeholder="اختياري" />
          </FormGroup>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="outline" onClick={() => setOpen(false)}>إلغاء</Btn>
          <Btn onClick={handleSubmit} loading={add.isPending}>تسجيل</Btn>
        </div>
      </Modal>
    </AppLayout>
  );
}
