import { v4 as uuidv4 } from 'uuid';

// Types
export type Worker = {
  id: string;
  name: string;
  nationality: string;
  profession: string;
  phone: string;
  status: 'active' | 'inactive';
  iqamaExpiry: string;
  createdAt: string;
};

export type Transfer = {
  id: string;
  workerId: string;
  workerName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'sent' | 'cancelled';
  date: string;
  notes: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'progress' | 'done';
  priority: 'normal' | 'urgent';
  dueDate: string;
};

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  method: 'cash' | 'bank';
};

// Seed Data
const SEED_WORKERS: Worker[] = [
  { id: uuidv4(), name: 'أحمد محمد', nationality: 'مصري', profession: 'مهندس', phone: '0501234567', status: 'active', iqamaExpiry: '2025-12-01', createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'محمد علي', nationality: 'سوداني', profession: 'محاسب', phone: '0509876543', status: 'active', iqamaExpiry: '2024-11-15', createdAt: new Date().toISOString() },
  { id: uuidv4(), name: 'عبدالله سعيد', nationality: 'يمني', profession: 'سائق', phone: '0555555555', status: 'inactive', iqamaExpiry: '2023-01-10', createdAt: new Date().toISOString() },
];

const SEED_TRANSFERS: Transfer[] = [
  { id: uuidv4(), workerId: SEED_WORKERS[0].id, workerName: SEED_WORKERS[0].name, amount: 1500, currency: 'SAR', status: 'sent', date: new Date().toISOString(), notes: 'راتب شهر مايو' },
  { id: uuidv4(), workerId: SEED_WORKERS[1].id, workerName: SEED_WORKERS[1].name, amount: 2000, currency: 'SAR', status: 'pending', date: new Date().toISOString(), notes: 'سلفة' },
];

const SEED_TASKS: Task[] = [
  { id: uuidv4(), title: 'تجديد إقامات العمال', description: 'يجب تجديد إقامات 3 عمال قبل نهاية الشهر', status: 'new', priority: 'urgent', dueDate: '2024-06-30' },
  { id: uuidv4(), title: 'مراجعة حسابات الرواتب', description: 'مراجعة كشف الرواتب لشهر مايو', status: 'progress', priority: 'normal', dueDate: '2024-06-15' },
  { id: uuidv4(), title: 'دفع فاتورة الكهرباء', description: 'دفع فاتورة المكتب الرئيسي', status: 'done', priority: 'normal', dueDate: '2024-06-01' },
];

const SEED_TRANSACTIONS: Transaction[] = [
  { id: uuidv4(), type: 'income', category: 'مبيعات خدمات', amount: 5000, date: new Date().toISOString(), description: 'دفعة عقد خدمات', method: 'bank' },
  { id: uuidv4(), type: 'expense', category: 'رواتب', amount: 3500, date: new Date().toISOString(), description: 'رواتب عمال', method: 'bank' },
  { id: uuidv4(), type: 'expense', category: 'نثريات', amount: 250, date: new Date().toISOString(), description: 'ضيافة مكتب', method: 'cash' },
];

// DB Operations
const initDb = () => {
  if (!localStorage.getItem('hulul_workers')) {
    localStorage.setItem('hulul_workers', JSON.stringify(SEED_WORKERS));
    localStorage.setItem('hulul_transfers', JSON.stringify(SEED_TRANSFERS));
    localStorage.setItem('hulul_tasks', JSON.stringify(SEED_TASKS));
    localStorage.setItem('hulul_transactions', JSON.stringify(SEED_TRANSACTIONS));
  }
};

// Initialize immediately
initDb();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  workers: {
    list: async (): Promise<Worker[]> => {
      await delay(300);
      return JSON.parse(localStorage.getItem('hulul_workers') || '[]');
    },
    add: async (worker: Omit<Worker, 'id' | 'createdAt'>) => {
      await delay(400);
      const items = JSON.parse(localStorage.getItem('hulul_workers') || '[]');
      const newItem = { ...worker, id: uuidv4(), createdAt: new Date().toISOString() };
      localStorage.setItem('hulul_workers', JSON.stringify([newItem, ...items]));
      return newItem;
    },
    delete: async (id: string) => {
      await delay(300);
      const items = JSON.parse(localStorage.getItem('hulul_workers') || '[]');
      localStorage.setItem('hulul_workers', JSON.stringify(items.filter((i: Worker) => i.id !== id)));
    }
  },
  transfers: {
    list: async (): Promise<Transfer[]> => {
      await delay(300);
      return JSON.parse(localStorage.getItem('hulul_transfers') || '[]');
    },
    add: async (transfer: Omit<Transfer, 'id'>) => {
      await delay(400);
      const items = JSON.parse(localStorage.getItem('hulul_transfers') || '[]');
      const newItem = { ...transfer, id: uuidv4() };
      localStorage.setItem('hulul_transfers', JSON.stringify([newItem, ...items]));
      return newItem;
    },
    updateStatus: async (id: string, status: Transfer['status']) => {
      await delay(300);
      const items = JSON.parse(localStorage.getItem('hulul_transfers') || '[]');
      const updated = items.map((i: Transfer) => i.id === id ? { ...i, status } : i);
      localStorage.setItem('hulul_transfers', JSON.stringify(updated));
    }
  },
  tasks: {
    list: async (): Promise<Task[]> => {
      await delay(300);
      return JSON.parse(localStorage.getItem('hulul_tasks') || '[]');
    },
    add: async (task: Omit<Task, 'id'>) => {
      await delay(400);
      const items = JSON.parse(localStorage.getItem('hulul_tasks') || '[]');
      const newItem = { ...task, id: uuidv4() };
      localStorage.setItem('hulul_tasks', JSON.stringify([newItem, ...items]));
      return newItem;
    },
    updateStatus: async (id: string, status: Task['status']) => {
      await delay(300);
      const items = JSON.parse(localStorage.getItem('hulul_tasks') || '[]');
      const updated = items.map((i: Task) => i.id === id ? { ...i, status } : i);
      localStorage.setItem('hulul_tasks', JSON.stringify(updated));
    }
  },
  transactions: {
    list: async (): Promise<Transaction[]> => {
      await delay(300);
      return JSON.parse(localStorage.getItem('hulul_transactions') || '[]');
    },
    add: async (tx: Omit<Transaction, 'id' | 'date'>) => {
      await delay(400);
      const items = JSON.parse(localStorage.getItem('hulul_transactions') || '[]');
      const newItem = { ...tx, id: uuidv4(), date: new Date().toISOString() };
      localStorage.setItem('hulul_transactions', JSON.stringify([newItem, ...items]));
      return newItem;
    }
  }
};
