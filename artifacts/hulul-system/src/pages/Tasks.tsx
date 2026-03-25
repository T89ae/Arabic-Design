import { AppLayout } from "@/components/layout/AppLayout";
import { useTasks, useUpdateTaskStatus } from "@/hooks/use-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, AlertCircle } from "lucide-react";

export default function Tasks() {
  const { data: tasks = [], isLoading } = useTasks();

  const columns = [
    { id: 'new', title: 'جديدة', bgColor: 'bg-slate-50' },
    { id: 'progress', title: 'قيد التنفيذ', bgColor: 'bg-blue-50' },
    { id: 'done', title: 'مكتملة', bgColor: 'bg-emerald-50' },
  ];

  return (
    <AppLayout title="إدارة المهام">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {columns.map(col => (
          <div key={col.id} className={`rounded-2xl p-4 border border-border/50 h-[calc(100vh-140px)] overflow-y-auto ${col.bgColor}`}>
            <h3 className="font-black text-lg text-primary mb-4 flex items-center justify-between">
              {col.title}
              <Badge variant="outline" className="bg-white">{tasks.filter(t => t.status === col.id).length}</Badge>
            </h3>
            
            <div className="space-y-4">
              {tasks.filter(t => t.status === col.id).map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
              {tasks.filter(t => t.status === col.id).length === 0 && !isLoading && (
                <p className="text-center text-muted-foreground py-8 text-sm">لا توجد مهام</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

function TaskCard({ task }: { task: any }) {
  const updateMutation = useUpdateTaskStatus();

  return (
    <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow cursor-grab">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-bold text-foreground text-sm">{task.title}</h4>
          {task.priority === 'urgent' && <AlertCircle className="w-4 h-4 text-rose-500" />}
        </div>
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/30 px-2 py-1 rounded-md">
            <CalendarDays className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString('ar-SA')}
          </div>
          
          <select 
            className="text-[10px] bg-transparent border-none outline-none text-primary font-bold cursor-pointer"
            value={task.status}
            onChange={(e) => updateMutation.mutate({id: task.id, status: e.target.value as any})}
          >
            <option value="new">جديدة</option>
            <option value="progress">قيد التنفيذ</option>
            <option value="done">مكتملة</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
