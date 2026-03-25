import { v4 as uuidv4 } from 'uuid';

// ── Types ──────────────────────────────────────────────────
export type Worker = {
  id: string; name: string; nationality: string; sponsor: string;
  profession: string; phone: string; status: 'active' | 'inactive';
  iqamaExpiry: string; passportExpiry: string; notes: string; createdAt: string;
};

export type Transfer = {
  id: string; workerId: string; workerName: string; amount: number;
  currency: string; status: 'pending' | 'sent' | 'cancelled';
  date: string; notes: string;
};

export type Task = {
  id: string; title: string; description: string;
  status: 'new' | 'progress' | 'done'; priority: 'normal' | 'urgent';
  dueDate: string; assignee: string;
};

export type Transaction = {
  id: string; type: 'income' | 'expense'; category: string;
  amount: number; date: string; description: string;
  method: 'cash' | 'bank' | 'pos'; vendor: string;
};

export type Expense = {
  id: string; item: string; category: string; amount: number;
  method: 'cash' | 'bank'; vendor: string; date: string; notes: string;
};

export type Sale = {
  id: string; item: string; category: string; qty: number;
  price: number; cost: number; customer: string; date: string; notes: string;
};

export type InventoryItem = {
  id: string; name: string; category: string; qty: number;
  minQty: number; unit: string; price: number; updatedAt: string;
};

export type Contact = {
  id: string; name: string; phone: string; type: string; notes: string; createdAt: string;
};

export type Broker = {
  id: string; name: string; phone: string; specialty: string;
  totalDue: number; paid: number; dueDate: string; notes: string; createdAt: string;
};

export type AttendanceRecord = {
  id: string; workerId: string; workerName: string; date: string;
  status: 'present' | 'absent' | 'late'; notes: string;
};

export type SaudiWorker = {
  id: string; name: string; id_number: string; profession: string;
  phone: string; salary: number; status: 'active' | 'inactive'; notes: string; createdAt: string;
};

export type ActivityLog = {
  id: string; action: string; section: string; details: string; timestamp: string;
};

// ── Seeds ──────────────────────────────────────────────────
const W: Worker[] = [
  { id: uuidv4(), name: 'أحمد محمد',    nationality: 'مصري',    sponsor: 'محمد الغامدي', profession: 'مهندس',   phone: '0501234567', status: 'active',   iqamaExpiry: '2025-12-01', passportExpiry: '2026-05-20', notes: '',              createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'محمد علي',     nationality: 'سوداني',  sponsor: 'سعد القحطاني', profession: 'محاسب',   phone: '0509876543', status: 'active',   iqamaExpiry: '2025-11-15', passportExpiry: '2027-02-10', notes: 'متميز',         createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'عبدالله سعيد', nationality: 'يمني',    sponsor: 'فهد العتيبي',  profession: 'سائق',    phone: '0555555555', status: 'inactive', iqamaExpiry: '2023-01-10', passportExpiry: '2024-09-01', notes: 'منتهية الإقامة', createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'كريم حسن',     nationality: 'باكستاني',sponsor: 'محمد الغامدي', profession: 'حارس أمن',phone: '0566123456', status: 'active',   iqamaExpiry: '2026-03-15', passportExpiry: '2028-01-01', notes: '',              createdAt: new Date().toISOString() },
];

const TR: Transfer[] = [
  { id: uuidv4(), workerId: W[0].id, workerName: W[0].name, amount: 1500, currency: 'SAR', status: 'sent',      date: new Date().toISOString(), notes: 'راتب شهر مايو' },
  { id: uuidv4(), workerId: W[1].id, workerName: W[1].name, amount: 2000, currency: 'SAR', status: 'pending',   date: new Date().toISOString(), notes: 'سلفة' },
  { id: uuidv4(), workerId: W[2].id, workerName: W[2].name, amount: 800,  currency: 'SAR', status: 'cancelled', date: new Date().toISOString(), notes: 'ملغاة' },
];

const TSK: Task[] = [
  { id: uuidv4(), title: 'تجديد إقامات العمال',       description: 'تجديد 3 إقامات قبل نهاية الشهر', status: 'new',      priority: 'urgent',  dueDate: '2026-04-30', assignee: 'المدير' },
  { id: uuidv4(), title: 'مراجعة حسابات الرواتب',     description: 'مراجعة كشف رواتب مايو',          status: 'progress', priority: 'normal',  dueDate: '2026-04-15', assignee: 'المحاسب' },
  { id: uuidv4(), title: 'دفع فاتورة الكهرباء',       description: 'دفع فاتورة المكتب الرئيسي',      status: 'done',     priority: 'normal',  dueDate: '2026-04-01', assignee: 'المدير' },
];

const TXN: Transaction[] = [
  { id: uuidv4(), type: 'income',  category: 'مبيعات خدمات', amount: 5000, date: new Date().toISOString(), description: 'دفعة عقد خدمات', method: 'bank',  vendor: 'شركة الريادة' },
  { id: uuidv4(), type: 'expense', category: 'رواتب',         amount: 3500, date: new Date().toISOString(), description: 'رواتب عمال',      method: 'bank',  vendor: '' },
  { id: uuidv4(), type: 'expense', category: 'نثريات',        amount: 250,  date: new Date().toISOString(), description: 'ضيافة مكتب',     method: 'cash',  vendor: '' },
  { id: uuidv4(), type: 'income',  category: 'استشارات',      amount: 1800, date: new Date().toISOString(), description: 'استشارة هندسية',  method: 'cash',  vendor: '' },
];

const EXP: Expense[] = [
  { id: uuidv4(), item: 'قرطاسية مكتب',   category: 'نثريات',  amount: 180,  method: 'cash', vendor: 'محل الأمل',    date: '2026-03-10', notes: '' },
  { id: uuidv4(), item: 'صيانة سيارة',    category: 'صيانة',   amount: 650,  method: 'cash', vendor: 'ورشة الخليج',  date: '2026-03-14', notes: '' },
  { id: uuidv4(), item: 'فاتورة الإنترنت',category: 'خدمات',   amount: 380,  method: 'bank', vendor: 'STC',          date: '2026-03-18', notes: '' },
  { id: uuidv4(), item: 'وقود',           category: 'نقل',     amount: 220,  method: 'cash', vendor: 'أرامكو',        date: '2026-03-20', notes: '' },
];

const SAL: Sale[] = [
  { id: uuidv4(), item: 'خدمة تنظيف',   category: 'خدمات',   qty: 3, price: 1200, cost: 700, customer: 'شركة النور',   date: '2026-03-10', notes: '' },
  { id: uuidv4(), item: 'عقد حراسة',    category: 'أمن',     qty: 1, price: 5000, cost: 3500,customer: 'مجمع البوابة', date: '2026-03-15', notes: '' },
  { id: uuidv4(), item: 'نقل أثاث',     category: 'نقل',     qty: 2, price: 800,  cost: 400, customer: 'أحمد الدوسري', date: '2026-03-22', notes: '' },
];

const INV: InventoryItem[] = [
  { id: uuidv4(), name: 'معدات تنظيف',   category: 'معدات',    qty: 25, minQty: 5,  unit: 'قطعة',  price: 85,  updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'مواد تنظيف',    category: 'مستهلكات', qty: 8,  minQty: 10, unit: 'كرتون', price: 220, updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'ملابس العمل',   category: 'ملابس',    qty: 30, minQty: 10, unit: 'قطعة',  price: 60,  updatedAt: new Date().toISOString() },
  { id: uuidv4(), name: 'أجهزة لاسلكي', category: 'أجهزة',    qty: 6,  minQty: 3,  unit: 'جهاز',  price: 350, updatedAt: new Date().toISOString() },
];

const CON: Contact[] = [
  { id: uuidv4(), name: 'سعد الزهراني', phone: '0500112233', type: 'عميل',   notes: 'عميل VIP',        createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'نورة الحربي',  phone: '0551239876', type: 'مورد',   notes: 'مورد معدات',      createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'فهد العتيبي',  phone: '0566889900', type: 'شريك',   notes: 'شريك استراتيجي',  createdAt: new Date().toISOString() },
];

const BRK: Broker[] = [
  { id: uuidv4(), name: 'خالد المنصور', phone: '0500123456', specialty: 'تجنيد', totalDue: 3000, paid: 1500, dueDate: '2026-04-30', notes: '',            createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'سلمى العصيمي', phone: '0556789012', specialty: 'عقارات',totalDue: 5000, paid: 5000, dueDate: '2026-03-15', notes: 'مدفوع كاملاً', createdAt: new Date().toISOString() },
];

const SAW: SaudiWorker[] = [
  { id: uuidv4(), name: 'تركي العمري',  id_number: '1012345678', profession: 'مشرف ميداني', phone: '0501112222', salary: 5000, status: 'active',   notes: '',       createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'نواف الحارثي', id_number: '1098765432', profession: 'أمن',         phone: '0556543210', salary: 4200, status: 'active',   notes: 'بدوام جزئي', createdAt: new Date().toISOString() },
];

const LOGS: ActivityLog[] = [
  { id: uuidv4(), action: 'إضافة',  section: 'العمال',     details: 'تمت إضافة عامل جديد: أحمد محمد',         timestamp: new Date().toISOString() },
  { id: uuidv4(), action: 'تعديل', section: 'الحوالات',   details: 'تم تحديث حالة الحوالة إلى مُرسَلة',       timestamp: new Date().toISOString() },
  { id: uuidv4(), action: 'حذف',   section: 'المصروفات',  details: 'تم حذف بند مصروف: قرطاسية قديمة',         timestamp: new Date().toISOString() },
];

// ── Init ───────────────────────────────────────────────────
const initDb = () => {
  if (localStorage.getItem('hulul_init_v2')) return;
  localStorage.setItem('hulul_workers',    JSON.stringify(W));
  localStorage.setItem('hulul_transfers',  JSON.stringify(TR));
  localStorage.setItem('hulul_tasks',      JSON.stringify(TSK));
  localStorage.setItem('hulul_transactions',JSON.stringify(TXN));
  localStorage.setItem('hulul_expenses',   JSON.stringify(EXP));
  localStorage.setItem('hulul_sales',      JSON.stringify(SAL));
  localStorage.setItem('hulul_inventory',  JSON.stringify(INV));
  localStorage.setItem('hulul_contacts',   JSON.stringify(CON));
  localStorage.setItem('hulul_brokers',    JSON.stringify(BRK));
  localStorage.setItem('hulul_saudi',      JSON.stringify(SAW));
  localStorage.setItem('hulul_attendance', JSON.stringify([]));
  localStorage.setItem('hulul_logs',       JSON.stringify(LOGS));
  localStorage.setItem('hulul_init_v2', '1');
};
initDb();

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function makeLog(action: string, section: string, details: string) {
  const items: ActivityLog[] = JSON.parse(localStorage.getItem('hulul_logs') || '[]');
  items.unshift({ id: uuidv4(), action, section, details, timestamp: new Date().toISOString() });
  if (items.length > 100) items.pop();
  localStorage.setItem('hulul_logs', JSON.stringify(items));
}

// ── CRUD helpers ───────────────────────────────────────────
function listKey<T>(key: string) {
  return async (): Promise<T[]> => { await delay(200); return JSON.parse(localStorage.getItem(key) || '[]'); };
}

function addKey<T extends { id: string }>(key: string, section: string, label: (v: T) => string) {
  return async (item: Omit<T, 'id'>): Promise<T> => {
    await delay(300);
    const items: T[] = JSON.parse(localStorage.getItem(key) || '[]');
    const newItem = { ...item, id: uuidv4() } as T;
    localStorage.setItem(key, JSON.stringify([newItem, ...items]));
    makeLog('إضافة', section, `تمت إضافة: ${label(newItem)}`);
    return newItem;
  };
}

function deleteKey<T extends { id: string }>(key: string, section: string) {
  return async (id: string) => {
    await delay(200);
    const items: T[] = JSON.parse(localStorage.getItem(key) || '[]');
    localStorage.setItem(key, JSON.stringify(items.filter(i => i.id !== id)));
    makeLog('حذف', section, `تم حذف عنصر`);
  };
}

function updateKey<T extends { id: string }>(key: string, section: string) {
  return async (id: string, patch: Partial<T>) => {
    await delay(300);
    const items: T[] = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = items.map(i => i.id === id ? { ...i, ...patch } : i);
    localStorage.setItem(key, JSON.stringify(updated));
    makeLog('تعديل', section, `تم تعديل عنصر`);
  };
}

export const db = {
  workers: {
    list:   listKey<Worker>('hulul_workers'),
    add:    addKey<Worker>('hulul_workers', 'العمال', v => v.name),
    delete: deleteKey<Worker>('hulul_workers', 'العمال'),
    update: updateKey<Worker>('hulul_workers', 'العمال'),
  },
  transfers: {
    list:         listKey<Transfer>('hulul_transfers'),
    add:          addKey<Transfer>('hulul_transfers', 'الحوالات', v => `${v.workerName} - ${v.amount}`),
    delete:       deleteKey<Transfer>('hulul_transfers', 'الحوالات'),
    updateStatus: async (id: string, status: Transfer['status']) => {
      await delay(200);
      const items: Transfer[] = JSON.parse(localStorage.getItem('hulul_transfers') || '[]');
      localStorage.setItem('hulul_transfers', JSON.stringify(items.map(i => i.id === id ? { ...i, status } : i)));
      makeLog('تعديل', 'الحوالات', `تم تحديث حالة الحوالة إلى ${status}`);
    }
  },
  tasks: {
    list:         listKey<Task>('hulul_tasks'),
    add:          addKey<Task>('hulul_tasks', 'المهام', v => v.title),
    delete:       deleteKey<Task>('hulul_tasks', 'المهام'),
    updateStatus: async (id: string, status: Task['status']) => {
      await delay(200);
      const items: Task[] = JSON.parse(localStorage.getItem('hulul_tasks') || '[]');
      localStorage.setItem('hulul_tasks', JSON.stringify(items.map(i => i.id === id ? { ...i, status } : i)));
      makeLog('تعديل', 'المهام', `تم تحديث حالة المهمة`);
    }
  },
  transactions: {
    list:   listKey<Transaction>('hulul_transactions'),
    add:    addKey<Transaction>('hulul_transactions', 'المحاسبة', v => v.description),
    delete: deleteKey<Transaction>('hulul_transactions', 'المحاسبة'),
  },
  expenses: {
    list:   listKey<Expense>('hulul_expenses'),
    add:    addKey<Expense>('hulul_expenses', 'المصروفات', v => v.item),
    delete: deleteKey<Expense>('hulul_expenses', 'المصروفات'),
  },
  sales: {
    list:   listKey<Sale>('hulul_sales'),
    add:    addKey<Sale>('hulul_sales', 'المبيعات', v => v.item),
    delete: deleteKey<Sale>('hulul_sales', 'المبيعات'),
  },
  inventory: {
    list:   listKey<InventoryItem>('hulul_inventory'),
    add:    addKey<InventoryItem>('hulul_inventory', 'الجرد', v => v.name),
    delete: deleteKey<InventoryItem>('hulul_inventory', 'الجرد'),
    update: updateKey<InventoryItem>('hulul_inventory', 'الجرد'),
  },
  contacts: {
    list:   listKey<Contact>('hulul_contacts'),
    add:    addKey<Contact>('hulul_contacts', 'جهات الاتصال', v => v.name),
    delete: deleteKey<Contact>('hulul_contacts', 'جهات الاتصال'),
  },
  brokers: {
    list:   listKey<Broker>('hulul_brokers'),
    add:    addKey<Broker>('hulul_brokers', 'الوسطاء', v => v.name),
    delete: deleteKey<Broker>('hulul_brokers', 'الوسطاء'),
    update: updateKey<Broker>('hulul_brokers', 'الوسطاء'),
  },
  attendance: {
    list:   listKey<AttendanceRecord>('hulul_attendance'),
    add:    addKey<AttendanceRecord>('hulul_attendance', 'الحضور', v => v.workerName),
    delete: deleteKey<AttendanceRecord>('hulul_attendance', 'الحضور'),
  },
  saudi: {
    list:   listKey<SaudiWorker>('hulul_saudi'),
    add:    addKey<SaudiWorker>('hulul_saudi', 'العمال السعوديين', v => v.name),
    delete: deleteKey<SaudiWorker>('hulul_saudi', 'العمال السعوديين'),
  },
  logs: {
    list: listKey<ActivityLog>('hulul_logs'),
  },
};
