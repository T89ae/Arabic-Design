/**
 * ── مدير الملفات والوثائق ─────────────────────────────────────────────
 * رفع + تحليل ذكاء اصطناعي + مراجعة + حفظ
 */
import { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload, FileText, FileImage, File, Trash2, RefreshCw,
  CheckCircle, XCircle, Clock, Loader2, ChevronDown, ChevronUp,
  Download, Save, Search, Filter, AlertCircle, Sparkles,
} from "lucide-react";
import { PageHeader } from "../components/shared/UI";
import { db } from "../lib/db";

// ── API base URL
const API = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.hostname}:${import.meta.env.VITE_API_PORT ?? 3001}`
  : "";

const API_BASE = `${API}/api`;

// ── Types ───────────────────────────────────────────────────────────────
type FileStatus = "pending" | "analyzing" | "done" | "error";
type FileCategory =
  | "عقد_إيجار" | "معاملة_عامل" | "كفيل"
  | "طلب_حكومي" | "إيصال_مالي" | "وثيقة_هوية" | "أخرى";

interface ExtractedData {
  name?: string;
  idNumber?: string;
  phone?: string;
  transactionType?: string;
  dates?: string[];
  amounts?: string[];
  details?: string;
  raw?: string;
}

interface FileRecord {
  id: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  status: FileStatus;
  category: FileCategory | null;
  extractedData: ExtractedData | null;
  confirmedData: ExtractedData | null;
  savedToSection: string | null;
  errorMessage: string | null;
}

// ── Helpers ──────────────────────────────────────────────────────────────
const CATEGORY_AR: Record<FileCategory, string> = {
  عقد_إيجار:   "عقد إيجار",
  معاملة_عامل: "معاملة عامل",
  كفيل:         "كفيل",
  طلب_حكومي:  "طلب حكومي",
  إيصال_مالي:  "إيصال مالي",
  وثيقة_هوية:  "وثيقة هوية",
  أخرى:         "أخرى",
};

const CATEGORY_COLORS: Record<FileCategory, string> = {
  عقد_إيجار:   "bg-blue-50 text-blue-700 border-blue-200",
  معاملة_عامل: "bg-purple-50 text-purple-700 border-purple-200",
  كفيل:         "bg-orange-50 text-orange-700 border-orange-200",
  طلب_حكومي:  "bg-red-50 text-red-700 border-red-200",
  إيصال_مالي:  "bg-green-50 text-green-700 border-green-200",
  وثيقة_هوية:  "bg-yellow-50 text-yellow-700 border-yellow-200",
  أخرى:         "bg-slate-50 text-slate-600 border-slate-200",
};

const STATUS_INFO: Record<FileStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "في الانتظار",  color: "text-slate-500",  icon: <Clock size={12} />     },
  analyzing: { label: "جاري التحليل",  color: "text-blue-600",   icon: <Loader2 size={12} className="animate-spin" /> },
  done:      { label: "تم التحليل",   color: "text-emerald-600", icon: <CheckCircle size={12} /> },
  error:     { label: "خطأ في التحليل", color: "text-red-600",    icon: <XCircle size={12} />   },
};

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} ب`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} ك.ب`;
  return `${(bytes / 1048576).toFixed(1)} م.ب`;
}

function fileIcon(mime: string) {
  if (mime.startsWith("image/")) return <FileImage size={16} className="text-purple-500" />;
  if (mime.includes("pdf"))      return <FileText size={16} className="text-red-500" />;
  if (mime.includes("word") || mime.includes("document")) return <FileText size={16} className="text-blue-500" />;
  if (mime.includes("sheet") || mime.includes("excel"))   return <FileText size={16} className="text-emerald-500" />;
  return <File size={16} className="text-slate-400" />;
}

// ── Edit Form for extracted data ───────────────────────────────────────────────
function DataEditForm({
  data, category, categories, onChange, onCategoryChange,
}: {
  data: ExtractedData;
  category: FileCategory | null;
  categories: FileCategory[];
  onChange: (d: ExtractedData) => void;
  onCategoryChange: (c: FileCategory) => void;
}) {
  const field = (label: string, key: keyof ExtractedData, type = "text") => (
    <div key={key}>
      <label className="block text-[11px] font-semibold text-slate-500 mb-1">{label}</label>
      {type === "textarea" ? (
        <textarea
          rows={2}
          value={(data[key] as string) ?? ""}
          onChange={e => onChange({ ...data, [key]: e.target.value })}
          className="w-full text-[12px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2342] resize-none"
        />
      ) : (
        <input
          type="text"
          value={(data[key] as string) ?? ""}
          onChange={e => onChange({ ...data, [key]: e.target.value })}
          className="w-full text-[12px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2342]"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[11px] font-semibold text-slate-500 mb-1">تصنيف المستند</label>
        <select
          value={category ?? "أخرى"}
          onChange={e => onCategoryChange(e.target.value as FileCategory)}
          className="w-full text-[12px] px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2342]"
        >
          {categories.map(c => (
            <option key={c} value={c}>{CATEGORY_AR[c]}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {field("الاسم الكامل",    "name")}
        {field("رقم الهوية",      "idNumber")}
        {field("رقم الجوال",      "phone")}
        {field("نوع المعاملة",    "transactionType")}
      </div>
      {field("ملاحظات / تفاصيل", "details", "textarea")}
    </div>
  );
}

// ── Single file card ─────────────────────────────────────────────────────────────
function FileCard({
  file, onAnalyze, onDelete, onSave, onUpdate,
}: {
  file: FileRecord;
  onAnalyze: (id: string) => void;
  onDelete: (id: string) => void;
  onSave: (id: string, data: ExtractedData, cat: FileCategory) => void;
  onUpdate: (id: string, data: ExtractedData, cat: FileCategory) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editData, setEditData] = useState<ExtractedData>(
    file.confirmedData ?? file.extractedData ?? {}
  );
  const [editCat, setEditCat] = useState<FileCategory>(file.category ?? "أخرى");
  const [saving, setSaving] = useState(false);

  const status = STATUS_INFO[file.status];
  const allCategories = Object.keys(CATEGORY_AR) as FileCategory[];

  const handleSave = async () => {
    setSaving(true);
    await onSave(file.id, editData, editCat);
    setSaving(false);
  };

  const handleUpdate = () => {
    onUpdate(file.id, editData, editCat);
  };

  return (
    <div className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
      file.status === "error" ? "border-red-200" : "border-slate-200/80"
    }`}>
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-shrink-0">{fileIcon(file.mimeType)}</div>

        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-semibold text-[#0A2342] truncate">{file.originalName}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[10px] text-slate-400">{fmtSize(file.sizeBytes)}</span>
            <span className="text-[10px] text-slate-400">·</span>
            <span className="text-[10px] text-slate-400">
              {new Date(file.uploadedAt).toLocaleString("ar-SA")}
            </span>
            {file.category && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${CATEGORY_COLORS[file.category]}`}>
                {CATEGORY_AR[file.category]}
              </span>
            )}
            {file.savedToSection && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ✓ محفوظ في: {file.savedToSection}
              </span>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-1 text-[10px] font-semibold ${status.color}`}>
          {status.icon}
          <span className="hidden sm:inline">{status.label}</span>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {file.status === "pending" && (
            <button onClick={() => onAnalyze(file.id)} title="تحليل"
              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
              <Sparkles size={14} />
            </button>
          )}
          {file.status === "error" && (
            <button onClick={() => onAnalyze(file.id)} title="إعادة التحليل"
              className="p-1.5 rounded-lg hover:bg-orange-50 text-orange-600 transition-colors">
              <RefreshCw size={14} />
            </button>
          )}
          {(file.status === "done" || file.status === "error") && (
            <button onClick={() => setExpanded(v => !v)} title="تفاصيل"
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          <button onClick={() => onDelete(file.id)} title="حذف"
            className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {file.status === "error" && file.errorMessage && (
        <div className="mx-4 mb-3 flex items-center gap-2 text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <AlertCircle size={12} />
          {file.errorMessage}
        </div>
      )}

      {expanded && file.status === "done" && (
        <div className="border-t border-slate-100 px-4 py-4 bg-slate-50/50">
          <h4 className="text-[11px] font-bold text-[#0A2342] mb-3 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#F9B264]" />
            البيانات المستخرجة — راجع وعدّل قبل الحفظ
          </h4>

          <DataEditForm
            data={editData}
            category={editCat}
            categories={allCategories}
            onChange={d => { setEditData(d); handleUpdate(); }}
            onCategoryChange={c => { setEditCat(c); }}
          />

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
            <button
              onClick={handleSave}
              disabled={saving || !!file.savedToSection}
              className="flex items-center gap-1.5 bg-[#0A2342] hover:bg-[#0d2d5a] disabled:opacity-50 text-white text-[11px] font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {file.savedToSection ? "تم الحفظ مسبقاً" : "حفظ في النظام"}
            </button>
            <span className="text-[10px] text-slate-400">
              سيُحفظ في قسم:{" "}
              <strong className="text-[#0A2342]">
                {editCat === "معاملة_عامل" ? "العمال" :
                 editCat === "كفيل" ? "الكفلاء" :
                 editCat === "إيصال_مالي" ? "المحاسبة" :
                 editCat === "عقد_إيجار" ? "المعاملات" : "سجل الأنشطة"}
              </strong>
            </span>
          </div>

          {file.extractedData?.raw && (
            <details className="mt-3">
              <summary className="text-[10px] text-slate-400 cursor-pointer hover:text-slate-600 select-none">
                النص الخام المستخرج
              </summary>
              <p className="mt-2 text-[10px] text-slate-500 bg-white border border-slate-200 rounded p-2 font-mono leading-5 max-h-24 overflow-auto whitespace-pre-wrap">
                {file.extractedData.raw}
              </p>
            </details>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function FileManager() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [analyzingAll, setAnalyzingAll] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<FileCategory | "">("");
  const [filterStatus, setFilterStatus] = useState<FileStatus | "">("");
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const checkApi = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/healthz`, { signal: AbortSignal.timeout(3000) });
      setApiAvailable(r.ok);
    } catch {
      setApiAvailable(false);
    }
  }, []);

  // Check API health on mount
  useEffect(() => {
    checkApi();
  }, [checkApi]);

  // ── Upload files ───────────────────────────────────────────────────────────────
  const uploadFiles = useCallback(async (fileList: File[]) => {
    if (!fileList.length) return;
    setUploading(true);

    if (apiAvailable === false) {
      const newRecords: FileRecord[] = fileList.map(f => ({
        id: crypto.randomUUID(),
        originalName: f.name,
        mimeType: f.type || "application/octet-stream",
        sizeBytes: f.size,
        uploadedAt: new Date().toISOString(),
        status: "pending" as FileStatus,
        category: null,
        extractedData: null,
        confirmedData: null,
        savedToSection: null,
        errorMessage: null,
      }));
      setFiles(prev => [...prev, ...newRecords]);
      setUploading(false);
      showToast(`تم إضافة ${newRecords.length} ملف — يعمل في الوضع المحلي`);
      return;
    }

    try {
      const fd = new FormData();
      fileList.forEach(f => fd.append("files", f));
      const res = await fetch(`${API_BASE}/files/upload`, { method: "POST", body: fd });
      if (!res.ok) throw new Error("فشل رفع الملفات");
      const data: { uploaded: number; files: FileRecord[] } = await res.json();
      setFiles(prev => [...prev, ...data.files]);
      showToast(`تم رفع ${data.uploaded} ملف بنجاح`);
    } catch (e) {
      showToast((e as Error).message, "err");
    } finally {
      setUploading(false);
    }
  }, [apiAvailable]);

  // ── Analyze single ──────────────────────────────────────────────────────────────
  const analyzeFile = useCallback(async (id: string) => {
    if (apiAvailable === false) {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "analyzing" } : f));
      await new Promise(r => setTimeout(r, 1200));
      setFiles(prev => prev.map(f => {
        if (f.id !== id) return f;
        const cat = guessCategory(f.originalName);
        return {
          ...f,
          status: "done",
          category: cat,
          extractedData: {
            details: `تحليل تلقائي — اسم الملف: ${f.originalName}`,
            dates: [new Date().toISOString().split("T")[0]!],
            amounts: [],
          },
        };
      }));
      return;
    }

    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "analyzing" } : f));
    try {
      const res = await fetch(`${API_BASE}/files/analyze/${id}`, { method: "POST" });
      const data: { file: FileRecord; aiEnabled?: boolean } = await res.json();
      if (data.aiEnabled !== undefined) setAiEnabled(data.aiEnabled);
      setFiles(prev => prev.map(f => f.id === id ? data.file : f));
    } catch {
      setFiles(prev => prev.map(f => f.id === id
        ? { ...f, status: "error", errorMessage: "تعذر التواصل مع الخادم" }
        : f
      ));
    }
  }, [apiAvailable]);

  // ── Analyze all pending ───────────────────────────────────────────────────────────
  const analyzeAll = useCallback(async () => {
    setAnalyzingAll(true);
    const pending = files.filter(f => f.status === "pending");
    for (const f of pending) await analyzeFile(f.id);
    setAnalyzingAll(false);
  }, [files, analyzeFile]);

  // ── Delete ───────────────────────────────────────────────────────────────────
  const deleteFile = useCallback(async (id: string) => {
    if (apiAvailable !== false) {
      await fetch(`${API_BASE}/files/${id}`, { method: "DELETE" }).catch(() => {});
    }
    setFiles(prev => prev.filter(f => f.id !== id));
  }, [apiAvailable]);

  // ── Save to system (localStorage) ───────────────────────────────────────────────
  const saveToSystem = useCallback(async (
    id: string, data: ExtractedData, cat: FileCategory,
  ) => {
    if (apiAvailable !== false) {
      await fetch(`${API_BASE}/files/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmedData: data,
          savedToSection: CATEGORY_AR[cat],
          category: cat,
        }),
      }).catch(() => {});
    }

    try {
      const name  = data.name    ?? "غير محدد";
      const notes = data.details ?? "";
      const idNum = data.idNumber ?? "";
      const phone = data.phone   ?? "";
      const now   = new Date().toISOString();

      if (cat === "معاملة_عامل") {
        await db.workers.add({
          name,
          nationality: "",
          sponsor: "",
          profession: "",
          phone,
          status: "active",
          iqamaExpiry: data.dates?.[0] ?? "",
          passportExpiry: "",
          notes: `رقم الهوية: ${idNum}\n${notes}`.trim(),
          createdAt: now,
        });
      } else if (cat === "كفيل") {
        await db.contacts.add({
          name,
          phone,
          type: "كفيل",
          notes: `رقم الهوية: ${idNum}\n${notes}`.trim(),
          createdAt: now,
        });
      } else if (cat === "إيصال_مالي") {
        const amount = parseFloat(data.amounts?.[0]?.replace(/[^\d.]/g, "") ?? "0") || 0;
        await db.transactions.add({
          type: "income",
          category: "إيصالات مالية",
          amount,
          date: now.split("T")[0]!,
          description: data.transactionType ?? "إيصال مالي",
          method: "cash",
          vendor: "",
        });
      } else {
        // Write to activity log directly
        const logs = JSON.parse(localStorage.getItem('hulul_logs') ?? '[]');
        logs.unshift({
          id: crypto.randomUUID(),
          action: "رفع ملف",
          section: CATEGORY_AR[cat],
          details: `${name} — ${notes}`.trim(),
          timestamp: now,
        });
        localStorage.setItem('hulul_logs', JSON.stringify(logs.slice(0, 100)));
      }

      setFiles(prev => prev.map(f =>
        f.id === id
          ? { ...f, confirmedData: data, savedToSection: CATEGORY_AR[cat], category: cat }
          : f
      ));
      showToast(`تم الحفظ بنجاح في قسم: ${CATEGORY_AR[cat]}`);
    } catch (e) {
      showToast("فشل الحفظ المحلي: " + (e as Error).message, "err");
    }
  }, [apiAvailable]);

  // ── Update data (auto-sync edits) ──────────────────────────────────────────────────
  const updateFileData = useCallback((id: string, data: ExtractedData, cat: FileCategory) => {
    setFiles(prev => prev.map(f =>
      f.id === id ? { ...f, confirmedData: data, category: cat } : f
    ));
  }, []);

  // ── Drag & Drop ─────────────────────────────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    uploadFiles(Array.from(e.dataTransfer.files));
  }, [uploadFiles]);

  // ── Filter & Search ──────────────────────────────────────────────────────────────
  const filtered = files.filter(f => {
    const matchSearch = !search || f.originalName.toLowerCase().includes(search.toLowerCase());
    const matchCat    = !filterCat || f.category === filterCat;
    const matchStatus = !filterStatus || f.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const stats = {
    total:   files.length,
    pending: files.filter(f => f.status === "pending").length,
    done:    files.filter(f => f.status === "done").length,
    error:   files.filter(f => f.status === "error").length,
    saved:   files.filter(f => f.savedToSection).length,
  };

  const allCategories = Object.keys(CATEGORY_AR) as FileCategory[];

  if (apiAvailable === null) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[200px]">
        <Loader2 size={24} className="animate-spin text-[#0A2342]" />
        <span className="mr-3 text-slate-500 text-sm">جاري التحقق من الخادم...</span>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto" dir="rtl">
      <PageHeader
        title="مدير الملفات والوثائق"
        subtitle="رفع وتحليل وتصنيف الوثائق تلقائياً بالذكاء الاصطناعي"
      />

      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg text-[12px] font-semibold text-white flex items-center gap-2 ${
          toast.type === "ok" ? "bg-emerald-600" : "bg-red-600"
        }`}>
          {toast.type === "ok" ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {toast.msg}
        </div>
      )}

      <div className={`mb-4 flex items-center gap-2 text-[11px] font-semibold px-3 py-2 rounded-lg border ${
        apiAvailable
          ? aiEnabled
            ? "bg-blue-50 text-blue-700 border-blue-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-50 text-slate-500 border-slate-200"
      }`}>
        {apiAvailable ? (
          aiEnabled
            ? <><Sparkles size={12} /> التحليل يعمل بـ OpenAI — دقة عالية</>
            : <><AlertCircle size={12} /> الخادم متصل — التحليل الذكي غير مفعّل (أضف OPENAI_API_KEY لتفعيله) — يعمل بالتطابق الذكي</>
        ) : (
          <><AlertCircle size={12} /> الوضع المحلي — الخادم غير متاح — التحليل تلقائي بسيط</>
        )}
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[
            { label: "الكل",     val: stats.total,   color: "text-[#0A2342]" },
            { label: "انتظار",   val: stats.pending,  color: "text-slate-500" },
            { label: "محللة",    val: stats.done,     color: "text-emerald-600" },
            { label: "خطأ",      val: stats.error,    color: "text-red-500" },
            { label: "محفوظة",   val: stats.saved,    color: "text-blue-600" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200/80 rounded-lg p-2 text-center">
              <p className={`text-[18px] font-black ${s.color}`}>{s.val}</p>
              <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div
        onDragEnter={e => { e.preventDefault(); setIsDragging(true); }}
        onDragOver={e => e.preventDefault()}
        onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 mb-4 ${
          isDragging
            ? "border-[#F9B264] bg-orange-50 scale-[1.01]"
            : "border-slate-200 hover:border-[#0A2342]/40 hover:bg-slate-50/50 bg-white"
        }`}
      >
        <div className="flex flex-col items-center justify-center py-8 gap-3 select-none">
          {uploading ? (
            <>
              <Loader2 size={32} className="animate-spin text-[#0A2342]" />
              <p className="text-sm font-semibold text-[#0A2342]">جاري رفع الملفات...</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[#0A2342]/5 flex items-center justify-center">
                <Upload size={24} className="text-[#0A2342]" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-[#0A2342]">
                  {isDragging ? "أفلت الملفات هنا" : "اسحب وأفلت الملفات هنا"}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  أو انقر للاختيار · PDF, Word, Excel, صور JPG/PNG · حتى 20 ملفاً · 20 ميجابايت/ملف
                </p>
              </div>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp,.txt"
          className="hidden"
          onChange={e => uploadFiles(Array.from(e.target.files ?? []))}
        />
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[160px]">
            <Search size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="بحث في الملفات..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-[12px] pr-8 pl-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2342]"
            />
          </div>

          <div className="relative">
            <Filter size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              value={filterCat}
              onChange={e => setFilterCat(e.target.value as FileCategory | "")}
              className="text-[11px] pr-7 pl-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2342] appearance-none"
            >
              <option value="">كل التصنيفات</option>
              {allCategories.map(c => <option key={c} value={c}>{CATEGORY_AR[c]}</option>)}
            </select>
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as FileStatus | "")}
            className="text-[11px] px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A2342]"
          >
            <option value="">كل الحالات</option>
            <option value="pending">في الانتظار</option>
            <option value="analyzing">جاري التحليل</option>
            <option value="done">تم التحليل</option>
            <option value="error">خطأ</option>
          </select>

          {stats.pending > 0 && (
            <button
              onClick={analyzeAll}
              disabled={analyzingAll}
              className="flex items-center gap-1.5 bg-[#F9B264] hover:bg-orange-400 text-[#0A2342] text-[11px] font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {analyzingAll ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              تحليل الكل ({stats.pending})
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 border border-[#0A2342] text-[#0A2342] text-[11px] font-bold px-4 py-2 rounded-lg hover:bg-[#0A2342] hover:text-white transition-colors"
          >
            <Upload size={12} />
            رفع ملفات
          </button>

          <button
            onClick={async () => { for (const f of files) await deleteFile(f.id); }}
            className="flex items-center gap-1.5 border border-red-200 text-red-500 text-[11px] font-bold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} />
            حذف الكل
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-slate-200/80 rounded-xl">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Download size={28} className="text-slate-300" />
          </div>
          <p className="text-sm font-bold text-slate-400">
            {files.length === 0 ? "لا توجد ملفات مرفوعة بعد" : "لا توجد نتائج للبحث"}
          </p>
          <p className="text-[11px] text-slate-300 mt-1">
            {files.length === 0 ? "ارفع ملفاتك لبدء التحليل التلقائي" : "جرب تغيير معايير الفلترة"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onAnalyze={analyzeFile}
              onDelete={deleteFile}
              onSave={saveToSystem}
              onUpdate={updateFileData}
            />
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="mt-4 text-[10px] text-slate-400 text-center">
          {filtered.length} من {files.length} ملف معروض
          {stats.saved > 0 && ` · ${stats.saved} محفوظ في النظام`}
        </div>
      )}
    </div>
  );
}

function guessCategory(name: string): FileCategory {
  const n = name.toLowerCase();
  if (n.includes("عقد") || n.includes("إيجار") || n.includes("rent"))  return "عقد_إيجار";
  if (n.includes("عامل") || n.includes("worker") || n.includes("إقامة")) return "معاملة_عامل";
  if (n.includes("كفيل") || n.includes("sponsor"))                       return "كفيل";
  if (n.includes("فاتورة") || n.includes("invoice") || n.includes("إيصال")) return "إيصال_مالي";
  if (n.includes("هوية") || n.includes("id") || n.includes("passport")) return "وثيقة_هوية";
  if (n.includes("وزارة") || n.includes("حكومي") || n.includes("ministry")) return "طلب_حكومي";
  return "أخرى";
}
