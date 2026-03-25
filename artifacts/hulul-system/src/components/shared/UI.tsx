import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { clsx } from "clsx";

// ── PageHeader ─────────────────────────────────────────────
export function PageHeader({ title, onAdd, addLabel = "إضافة جديد" }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
      <h2 className="text-xl font-black text-foreground">{title}</h2>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

// ── KpiRow ─────────────────────────────────────────────────
const COLOR_MAP: Record<string, string> = {
  blue:   "border-r-4 border-blue-400",
  green:  "border-r-4 border-emerald-400",
  red:    "border-r-4 border-red-400",
  amber:  "border-r-4 border-amber-400",
  purple: "border-r-4 border-purple-400",
  muted:  "border-r-4 border-slate-300",
};

export function KpiRow({ items }: { items: { label: string; value: string | number; color?: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {items.map((k, i) => (
        <div key={i} className={clsx("bg-white rounded-2xl p-4 shadow-sm", COLOR_MAP[k.color || "muted"])}>
          <p className="text-xs text-muted-foreground mb-1">{k.label}</p>
          <p className="text-lg font-black text-foreground">{k.value}</p>
        </div>
      ))}
    </div>
  );
}

// ── TableWrap ──────────────────────────────────────────────
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <style>{`
          table { width: 100%; border-collapse: collapse; }
          thead tr { background: #f8fafc; }
          th { padding: 12px 16px; font-size: 12px; font-weight: 700; color: #64748b; text-align: right; white-space: nowrap; }
          td { padding: 12px 16px; font-size: 13px; color: #1e293b; border-top: 1px solid #f1f5f9; }
          tr:hover td { background: #fafafa; }
          .icon-btn { padding: 4px; border-radius: 8px; transition: background .15s; }
          .icon-btn:hover { background: #f1f5f9; }
          .input { border: 1px solid #e2e8f0; border-radius: 12px; padding: 8px 12px; font-family: inherit; width: 100%; font-size: 13px; outline: none; transition: border .15s; background: #fff; }
          .input:focus { border-color: #0A2342; }
          .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          @media (max-width: 480px) { .form-grid { grid-template-columns: 1fr; } }
        `}</style>
        {children}
      </div>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-black text-foreground">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 text-lg font-bold transition-colors">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── FormGroup ──────────────────────────────────────────────
export function FormGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted-foreground mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// ── Btn ────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", loading = false, type = "button" }: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "outline"; loading?: boolean; type?: "button" | "submit";
}) {
  const base = "px-5 py-2 rounded-full text-sm font-bold transition-all disabled:opacity-50";
  const cls = variant === "primary"
    ? `${base} bg-primary text-primary-foreground hover:opacity-90`
    : `${base} bg-white border border-slate-200 text-foreground hover:border-slate-400`;
  return <button type={type} onClick={onClick} disabled={loading} className={cls}>{loading ? "جاري الحفظ…" : children}</button>;
}

// ── StatusBadge ────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  active:    "bg-emerald-50 text-emerald-700",
  inactive:  "bg-slate-100 text-slate-500",
  pending:   "bg-amber-50 text-amber-700",
  sent:      "bg-blue-50 text-blue-700",
  cancelled: "bg-red-50 text-red-500",
  new:       "bg-purple-50 text-purple-700",
  progress:  "bg-blue-50 text-blue-700",
  done:      "bg-emerald-50 text-emerald-700",
  present:   "bg-emerald-50 text-emerald-700",
  absent:    "bg-red-50 text-red-500",
  late:      "bg-amber-50 text-amber-700",
};
const STATUS_LABELS: Record<string, string> = {
  active: "نشط", inactive: "غير نشط", pending: "معلقة", sent: "مُرسَلة", cancelled: "ملغاة",
  new: "جديدة", progress: "قيد التنفيذ", done: "مكتملة",
  present: "حاضر", absent: "غائب", late: "متأخر",
};
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx("text-xs font-bold px-2.5 py-1 rounded-full", STATUS_STYLES[status] || "bg-slate-100 text-slate-600")}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ── EmptyState ─────────────────────────────────────────────
export function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <tr><td colSpan={99} className="text-center py-16">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="text-muted-foreground font-medium">{label}</p>
    </td></tr>
  );
}
