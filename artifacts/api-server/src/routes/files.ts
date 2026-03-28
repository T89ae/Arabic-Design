/**
 * ── File Upload & AI Analysis Route ──────────────────────────────────────────
 * POST /api/files/upload     → upload one or many files
 * POST /api/files/analyze/:id → run AI analysis on a specific file
 * GET  /api/files             → list all uploaded files
 * GET  /api/files/:id         → get single file record
 * PUT  /api/files/:id         → update extracted data (user edits)
 * DELETE /api/files/:id       → delete file record
 */

import { Router } from "express";
import multer from "multer";
import { randomUUID } from "crypto";
import OpenAI from "openai";

const router = Router();

// ── In-memory store (swap with MongoDB/MySQL/Postgres later) ──────────────────
export type FileStatus = "pending" | "analyzing" | "done" | "error";
export type FileCategory =
  | "عقد_إيجار"
  | "معاملة_عامل"
  | "كفيل"
  | "طلب_حكومي"
  | "إيصال_مالي"
  | "وثيقة_هوية"
  | "أخرى";

export interface ExtractedData {
  name?: string;
  idNumber?: string;
  phone?: string;
  transactionType?: string;
  dates?: string[];
  amounts?: string[];
  details?: string;
  raw?: string;
}

export interface FileRecord {
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
  buffer: Buffer;      // dropped before sending to client
}

const fileStore = new Map<string, FileRecord>();

// ── OpenAI client (optional — graceful fallback if key missing) ───────────────
let openai: OpenAI | null = null;
if (process.env["OPENAI_API_KEY"]) {
  openai = new OpenAI({ apiKey: process.env["OPENAI_API_KEY"] });
}

// ── Multer (in-memory, max 20 MB per file, up to 20 files) ───────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, files: 20 },
  fileFilter(_req, file, cb) {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "image/jpeg",
      "image/png",
      "image/webp",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`نوع الملف غير مدعوم: ${file.mimetype}`));
    }
  },
});

// helper — strip buffer before sending
function toPublic(r: FileRecord): Omit<FileRecord, "buffer"> {
  const { buffer: _b, ...rest } = r;
  return rest;
}

// ── AI analysis ───────────────────────────────────────────────────────────────
async function analyzeWithAI(record: FileRecord): Promise<{
  category: FileCategory;
  extractedData: ExtractedData;
}> {
  const prompt = `أنت محلل وثائق متخصص في مكاتب الخدمات العامة السعودية.
  
اسم الملف: "${record.originalName}"
نوع الملف: "${record.mimeType}"

محتوى الملف (نص مستخرج):
"""
{{TEXT}}
"""

قم بتحليل هذا المستند وأجب بـ JSON فقط بالشكل التالي:
{
  "category": "عقد_إيجار" | "معاملة_عامل" | "كفيل" | "طلب_حكومي" | "إيصال_مالي" | "وثيقة_هوية" | "أخرى",
  "name": "الاسم الكامل إن وُجد أو null",
  "idNumber": "رقم الهوية أو الإقامة إن وُجد أو null",
  "phone": "رقم الجوال إن وُجد أو null",
  "transactionType": "نوع المعاملة أو null",
  "dates": ["التواريخ المستخرجة"],
  "amounts": ["المبالغ المالية المستخرجة"],
  "details": "ملخص مختصر لا يتجاوز 3 جمل"
}
أجب بـ JSON فقط بلا أي نص إضافي.`;

  // Try to extract text from buffer for context
  let text = "";
  try {
    if (record.mimeType.startsWith("text/")) {
      text = record.buffer.toString("utf8").slice(0, 4000);
    } else if (record.mimeType.includes("image")) {
      // Images sent as base64 to vision model
      text = "[صورة — يتم تحليلها بشكل مرئي]";
    } else {
      // For PDFs/Word: send first 4KB as binary text heuristic
      text = record.buffer.toString("utf8", 0, Math.min(4000, record.buffer.length))
        .replace(/[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF\w\s\d.,:-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  } catch {
    text = "[تعذر استخراج النص]";
  }

  if (openai) {
    // Use vision for images, text model for others
    if (record.mimeType.startsWith("image/")) {
      const b64 = record.buffer.toString("base64");
      const dataUrl = `data:${record.mimeType};base64,${b64}`;
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt.replace("{{TEXT}}", "[صورة مرفقة]") },
              { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            ],
          },
        ],
        max_tokens: 800,
        temperature: 0.1,
        response_format: { type: "json_object" },
      });
      const content = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      return buildResult(parsed, text);
    } else {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt.replace("{{TEXT}}", text) }],
        max_tokens: 600,
        temperature: 0.1,
        response_format: { type: "json_object" },
      });
      const content = response.choices[0]?.message?.content || "{}";
      const parsed = JSON.parse(content);
      return buildResult(parsed, text);
    }
  }

  // ── Fallback: smart pattern matching ────────────────────────────────────────
  return smartPatternMatch(record.originalName, text);
}

function buildResult(
  parsed: Record<string, unknown>,
  raw: string,
): { category: FileCategory; extractedData: ExtractedData } {
  return {
    category: (parsed["category"] as FileCategory) || "أخرى",
    extractedData: {
      name:            (parsed["name"] as string)            || undefined,
      idNumber:        (parsed["idNumber"] as string)        || undefined,
      phone:           (parsed["phone"] as string)           || undefined,
      transactionType: (parsed["transactionType"] as string) || undefined,
      dates:           (parsed["dates"] as string[])         || [],
      amounts:         (parsed["amounts"] as string[])       || [],
      details:         (parsed["details"] as string)         || undefined,
      raw: raw.slice(0, 500),
    },
  };
}

function smartPatternMatch(
  fileName: string,
  text: string,
): { category: FileCategory; extractedData: ExtractedData } {
  const combined = `${fileName} ${text}`.toLowerCase();

  let category: FileCategory = "أخرى";
  if (combined.includes("إيجار") || combined.includes("عقد") || combined.includes("rent") || combined.includes("lease"))
    category = "عقد_إيجار";
  else if (combined.includes("عامل") || combined.includes("worker") || combined.includes("إقامة"))
    category = "معاملة_عامل";
  else if (combined.includes("كفيل") || combined.includes("sponsor"))
    category = "كفيل";
  else if (combined.includes("حكومي") || combined.includes("وزارة") || combined.includes("ministry"))
    category = "طلب_حكومي";
  else if (combined.includes("فاتورة") || combined.includes("إيصال") || combined.includes("دفع") || combined.includes("invoice"))
    category = "إيصال_مالي";
  else if (combined.includes("هوية") || combined.includes("جواز") || combined.includes("passport") || combined.includes("id"))
    category = "وثيقة_هوية";

  // Pattern extractions
  const idMatch   = text.match(/\b[12]\d{9}\b/);
  const phoneMatch= text.match(/\b05\d{8}\b/);
  const dateMatch = text.match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}/g);
  const amountMatch = text.match(/[\d,]+\s*(?:ريال|SAR|﷼)/g);
  const nameMatch = text.match(/(?:الاسم|اسم|name)[:\s]+([^\n،,]{3,30})/i);

  return {
    category,
    extractedData: {
      name:    nameMatch?.[1]?.trim() || undefined,
      idNumber: idMatch?.[0] || undefined,
      phone:   phoneMatch?.[0] || undefined,
      dates:   dateMatch || [],
      amounts: amountMatch || [],
      details: `تم الكشف التلقائي: ${category.replace("_", " ")} — اسم الملف: ${fileName}`,
      raw:     text.slice(0, 300),
    },
  };
}

// ── ROUTES ────────────────────────────────────────────────────────────────────

// POST /api/files/upload
router.post("/files/upload", upload.array("files", 20), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  if (!files || files.length === 0) {
    res.status(400).json({ error: "لم يتم إرسال أي ملفات" });
    return;
  }

  const records: Omit<FileRecord, "buffer">[] = [];
  for (const f of files) {
    const id = randomUUID();
    const record: FileRecord = {
      id,
      originalName: f.originalname,
      mimeType: f.mimetype,
      sizeBytes: f.size,
      uploadedAt: new Date().toISOString(),
      status: "pending",
      category: null,
      extractedData: null,
      confirmedData: null,
      savedToSection: null,
      errorMessage: null,
      buffer: f.buffer,
    };
    fileStore.set(id, record);
    records.push(toPublic(record));
  }

  res.status(201).json({ uploaded: records.length, files: records });
});

// POST /api/files/analyze/:id
router.post("/files/analyze/:id", async (req, res) => {
  const record = fileStore.get(req.params["id"]!);
  if (!record) {
    res.status(404).json({ error: "الملف غير موجود" });
    return;
  }

  record.status = "analyzing";
  fileStore.set(record.id, record);

  try {
    const { category, extractedData } = await analyzeWithAI(record);
    record.status = "done";
    record.category = category;
    record.extractedData = extractedData;
    fileStore.set(record.id, record);
    res.json({ file: toPublic(record), aiEnabled: !!openai });
  } catch (err: unknown) {
    record.status = "error";
    record.errorMessage = err instanceof Error ? err.message : "خطأ غير معروف";
    fileStore.set(record.id, record);
    res.status(500).json({ error: record.errorMessage, file: toPublic(record) });
  }
});

// POST /api/files/analyze-all  — batch analyze all pending
router.post("/files/analyze-all", async (_req, res) => {
  const pending = [...fileStore.values()].filter(f => f.status === "pending");
  const results: Omit<FileRecord, "buffer">[] = [];

  await Promise.allSettled(
    pending.map(async (record) => {
      record.status = "analyzing";
      fileStore.set(record.id, record);
      try {
        const { category, extractedData } = await analyzeWithAI(record);
        record.status = "done";
        record.category = category;
        record.extractedData = extractedData;
      } catch (err: unknown) {
        record.status = "error";
        record.errorMessage = err instanceof Error ? err.message : "خطأ";
      }
      fileStore.set(record.id, record);
      results.push(toPublic(record));
    }),
  );

  res.json({ analyzed: results.length, files: results });
});

// GET /api/files
router.get("/files", (_req, res) => {
  const list = [...fileStore.values()]
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
    .map(toPublic);
  res.json({ total: list.length, files: list });
});

// GET /api/files/:id
router.get("/files/:id", (req, res) => {
  const record = fileStore.get(req.params["id"]!);
  if (!record) { res.status(404).json({ error: "غير موجود" }); return; }
  res.json(toPublic(record));
});

// PUT /api/files/:id  — confirm/update extracted data
router.put("/files/:id", (req, res) => {
  const record = fileStore.get(req.params["id"]!);
  if (!record) { res.status(404).json({ error: "غير موجود" }); return; }

  const { confirmedData, savedToSection, category } = req.body as {
    confirmedData?: ExtractedData;
    savedToSection?: string;
    category?: FileCategory;
  };

  if (confirmedData) record.confirmedData = confirmedData;
  if (savedToSection) record.savedToSection = savedToSection;
  if (category) record.category = category;

  fileStore.set(record.id, record);
  res.json(toPublic(record));
});

// DELETE /api/files/:id
router.delete("/files/:id", (req, res) => {
  const existed = fileStore.delete(req.params["id"]!);
  if (!existed) { res.status(404).json({ error: "غير موجود" }); return; }
  res.json({ deleted: true });
});

export default router;
