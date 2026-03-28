import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { clsx } from "clsx";

// ── PageHeader ─────────────────────────────────────────────
export function PageHeader({ title, onAdd, addLabel = "إضافة جديد" }: {
  title: string; onAdd?: () => void; addLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
      <div>
        <h2 className="text-[17px] font-bold text-[#0A2342] leading-none">{title}</h2>
        <div className="h-[2px] w-8 bg-[#F9B264] rounded-full mt-1.5" />
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 bg-[#0A2342] hover:bg-[#0d2d54] text-white px-4 py-2 rounded-lg text-[12px] font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          {addLabel}
        </button>
      )}
    </div>
  );
}

// ── KpiRow ─────────────────────────────────────────────────
const ACCENT_MAP: Record<string, string> = {
  blue:   "#3b82f6",
  green:  "#10b981",
  red:    "#ef4444",
  amber:  "#f59e0b",
  purple: "#8b5cf6",
  muted:  "#94a3b8",
};

export function KpiRow({ items }: { items: { label: string; value: string | number; color?: string }[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
      {items.map((k, i) => {
        const color = ACCENT_MAP[k.color || "muted"];
        return (
          <div
            key={i}
            className="bg-white border border-slate-200/80 rounded-lg p-4 shadow-sm relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-1 h-full rounded-r-lg"
              style={{ background: color }}
            />
            <p className="text-[11px] font-semibold text-slate-500 mb-1 leading-none">{k.label}</p>
            <p className="text-[17px] font-black text-[#0A2342] leading-tight">{k.value}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── TableWrap ──────────────────────────────────────────────
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-lg max-h-[92vh] overflow-y-auto border border-slate-200">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <div>
            <h3 className="text-[14px] font-bold text-[#0A2342]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 text-lg font-bold transition-colors leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ── FormGroup ──────────────────────────────────────────────
export function FormGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

// ── Btn ────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = "primary", loading = false, type = "button" }: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "outline"; loading?: boolean; type?: "button" | "submit";
}) {
  const base = "px-4 py-2 rounded-lg text-[12px] font-semibold transition-all disabled:opacity-50";
  const cls = variant === "primary"
    ? `${base} bg-[#0A2342] hover:bg-[#0d2d54] text-white shadow-sm`
    : `${base} bg-white border border-slate-200 text-slate-700 hover:border-slate-400`;
  return (
    <button type={type} onClick={onClick} disabled={loading} className={cls}>
      {loading ? "جاري الحفظ…" : children}
    </button>
  );
}

// ── StatusBadge ────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  active:    "bg-emerald-50 text-emerald-700 border border-emerald-100",
  inactive:  "bg-slate-100 text-slate-500",
  pending:   "bg-amber-50 text-amber-700 border border-amber-100",
  sent:      "bg-blue-50 text-blue-700 border border-blue-100",
  cancelled: "bg-red-50 text-red-500",
  new:       "bg-violet-50 text-violet-700 border border-violet-100",
  progress:  "bg-blue-50 text-blue-700 border border-blue-100",
  done:      "bg-emerald-50 text-emerald-700 border border-emerald-100",
  present:   "bg-emerald-50 text-emerald-700 border border-emerald-100",
  absent:    "bg-red-50 text-red-500",
  late:      "bg-amber-50 text-amber-700 border border-amber-100",
};
const STATUS_LABELS: Record<string, string> = {
  active: "نشط", inactive: "غير نشط", pending: "معلقة", sent: "مُرسَلة", cancelled: "ملغاة",
  new: "جديدة", progress: "قيد التنفيذ", done: "مكتملة",
  present: "حاضر", absent: "غائب", late: "متأخر",
};
export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={clsx("text-[11px] font-bold px-2 py-0.5 rounded-md", STATUS_STYLES[status] || "bg-slate-100 text-slate-600")}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

// ── EmptyState ─────────────────────────────────────────────
export function EmptyState({ icon, label }: { icon: string; label: string }) {
  return (
    <tr>
      <td colSpan={99} className="text-center py-16">
        <div className="text-4xl mb-3 opacity-60">{icon}</div>
        <p className="text-slate-400 text-[13px] font-medium">{label}</p>
      </td>
    </tr>
  );
}
