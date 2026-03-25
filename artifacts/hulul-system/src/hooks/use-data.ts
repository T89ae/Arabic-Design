import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db, type Worker, type Transfer, type Task, type Transaction } from "@/lib/db";
import { useToast } from "@/components/ui/use-toast";

// --- Workers ---
export function useWorkers() {
  return useQuery({ queryKey: ['workers'], queryFn: db.workers.list });
}

export function useCreateWorker() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: db.workers.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast({ title: "تم الإضافة بنجاح", description: "تمت إضافة العامل إلى النظام" });
    }
  });
}

export function useDeleteWorker() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: db.workers.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] });
      toast({ title: "تم الحذف", description: "تم إزالة العامل من النظام" });
    }
  });
}

// --- Transfers ---
export function useTransfers() {
  return useQuery({ queryKey: ['transfers'], queryFn: db.transfers.list });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: db.transfers.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
      toast({ title: "تم تسجيل الحوالة", description: "تم إضافة الحوالة بنجاح" });
    }
  });
}

export function useUpdateTransferStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: Transfer['status'] }) => db.transfers.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transfers'] }),
  });
}

// --- Tasks ---
export function useTasks() {
  return useQuery({ queryKey: ['tasks'], queryFn: db.tasks.list });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: db.tasks.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({ title: "تمت الإضافة", description: "تم إنشاء المهمة بنجاح" });
    }
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: Task['status'] }) => db.tasks.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });
}

// --- Transactions ---
export function useTransactions() {
  return useQuery({ queryKey: ['transactions'], queryFn: db.transactions.list });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: db.transactions.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({ title: "تم التسجيل", description: "تم حفظ العملية المالية بنجاح" });
    }
  });
}
