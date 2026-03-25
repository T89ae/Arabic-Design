import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db, type Worker, type Transfer, type Task, type Transaction, type Expense, type Sale, type InventoryItem, type Contact, type Broker, type AttendanceRecord, type SaudiWorker } from "@/lib/db";
import { useToast } from "@/components/ui/use-toast";

function makeHooks<T>(key: string, ops: any, label: string) {
  return {
    useList: () => useQuery({ queryKey: [key], queryFn: ops.list }),
    useAdd: () => {
      const qc = useQueryClient();
      const { toast } = useToast();
      return useMutation({
        mutationFn: ops.add,
        onSuccess: () => { qc.invalidateQueries({ queryKey: [key] }); toast({ title: `تمت الإضافة`, description: `تم حفظ ${label} بنجاح` }); }
      });
    },
    useDelete: () => {
      const qc = useQueryClient();
      const { toast } = useToast();
      return useMutation({
        mutationFn: ops.delete,
        onSuccess: () => { qc.invalidateQueries({ queryKey: [key] }); toast({ title: 'تم الحذف', description: `تم حذف ${label}` }); }
      });
    },
    useUpdate: ops.update ? () => {
      const qc = useQueryClient();
      return useMutation({
        mutationFn: ({ id, patch }: { id: string; patch: Partial<T> }) => ops.update(id, patch),
        onSuccess: () => qc.invalidateQueries({ queryKey: [key] })
      });
    } : undefined,
  };
}

// Workers
const workerHooks = makeHooks<Worker>('workers', db.workers, 'العامل');
export const useWorkers     = workerHooks.useList;
export const useCreateWorker = workerHooks.useAdd;
export const useDeleteWorker = workerHooks.useDelete;
export const useUpdateWorker = workerHooks.useUpdate!;

// Transfers
export function useTransfers() { return useQuery({ queryKey: ['transfers'], queryFn: db.transfers.list }); }
export function useCreateTransfer() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.transfers.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['transfers'] }); toast({ title: 'تم تسجيل الحوالة' }); } });
}
export function useDeleteTransfer() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.transfers.delete, onSuccess: () => { qc.invalidateQueries({ queryKey: ['transfers'] }); toast({ title: 'تم الحذف' }); } });
}
export function useUpdateTransferStatus() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, status }: { id: string; status: Transfer['status'] }) => db.transfers.updateStatus(id, status), onSuccess: () => qc.invalidateQueries({ queryKey: ['transfers'] }) });
}

// Tasks
export function useTasks() { return useQuery({ queryKey: ['tasks'], queryFn: db.tasks.list }); }
export function useCreateTask() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.tasks.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); toast({ title: 'تمت إضافة المهمة' }); } });
}
export function useDeleteTask() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.tasks.delete, onSuccess: () => { qc.invalidateQueries({ queryKey: ['tasks'] }); toast({ title: 'تم حذف المهمة' }); } });
}
export function useUpdateTaskStatus() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, status }: { id: string; status: Task['status'] }) => db.tasks.updateStatus(id, status), onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }) });
}

// Transactions
export function useTransactions() { return useQuery({ queryKey: ['transactions'], queryFn: db.transactions.list }); }
export function useCreateTransaction() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.transactions.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['transactions'] }); toast({ title: 'تم الحفظ' }); } });
}
export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: db.transactions.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }) });
}

// Expenses
export function useExpenses() { return useQuery({ queryKey: ['expenses'], queryFn: db.expenses.list }); }
export function useCreateExpense() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.expenses.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); toast({ title: 'تم تسجيل المصروف' }); } });
}
export function useDeleteExpense() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.expenses.delete, onSuccess: () => { qc.invalidateQueries({ queryKey: ['expenses'] }); toast({ title: 'تم الحذف' }); } });
}

// Sales
export function useSales() { return useQuery({ queryKey: ['sales'], queryFn: db.sales.list }); }
export function useCreateSale() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.sales.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); toast({ title: 'تم تسجيل البيع' }); } });
}
export function useDeleteSale() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.sales.delete, onSuccess: () => { qc.invalidateQueries({ queryKey: ['sales'] }); toast({ title: 'تم الحذف' }); } });
}

// Inventory
export function useInventory() { return useQuery({ queryKey: ['inventory'], queryFn: db.inventory.list }); }
export function useCreateInventoryItem() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.inventory.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); toast({ title: 'تمت الإضافة للمخزن' }); } });
}
export function useDeleteInventoryItem() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.inventory.delete, onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); toast({ title: 'تم الحذف' }); } });
}

// Contacts
export function useContacts() { return useQuery({ queryKey: ['contacts'], queryFn: db.contacts.list }); }
export function useCreateContact() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.contacts.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['contacts'] }); toast({ title: 'تمت إضافة جهة الاتصال' }); } });
}
export function useDeleteContact() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.contacts.delete, onSuccess: () => { qc.invalidateQueries({ queryKey: ['contacts'] }); toast({ title: 'تم الحذف' }); } });
}

// Brokers
export function useBrokers() { return useQuery({ queryKey: ['brokers'], queryFn: db.brokers.list }); }
export function useCreateBroker() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.brokers.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['brokers'] }); toast({ title: 'تمت إضافة الوسيط' }); } });
}
export function useDeleteBroker() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.brokers.delete, onSuccess: () => { qc.invalidateQueries({ queryKey: ['brokers'] }); toast({ title: 'تم الحذف' }); } });
}
export function useUpdateBroker() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ id, patch }: { id: string; patch: Partial<Broker> }) => db.brokers.update(id, patch), onSuccess: () => qc.invalidateQueries({ queryKey: ['brokers'] }) });
}

// Attendance
export function useAttendance() { return useQuery({ queryKey: ['attendance'], queryFn: db.attendance.list }); }
export function useCreateAttendance() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.attendance.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['attendance'] }); toast({ title: 'تم تسجيل الحضور' }); } });
}
export function useDeleteAttendance() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: db.attendance.delete, onSuccess: () => qc.invalidateQueries({ queryKey: ['attendance'] }) });
}

// Saudi Workers
export function useSaudiWorkers() { return useQuery({ queryKey: ['saudi'], queryFn: db.saudi.list }); }
export function useCreateSaudiWorker() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.saudi.add, onSuccess: () => { qc.invalidateQueries({ queryKey: ['saudi'] }); toast({ title: 'تمت الإضافة' }); } });
}
export function useDeleteSaudiWorker() {
  const qc = useQueryClient(); const { toast } = useToast();
  return useMutation({ mutationFn: db.saudi.delete, onSuccess: () => { qc.invalidateQueries({ queryKey: ['saudi'] }); toast({ title: 'تم الحذف' }); } });
}

// Activity Logs
export function useActivityLogs() { return useQuery({ queryKey: ['logs'], queryFn: db.logs.list, refetchInterval: 5000 }); }
