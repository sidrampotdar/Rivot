"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableTaskItem from "./draggable-task-item";
import { Button } from "@/components/ui/button";
import { Plus, Inbox } from "lucide-react";

type DroppableColumnProps = {
  columnId: string;
  columnName: string;
  taskCount: number;
  tasks: Array<{
    _id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    assignedTo?: string;
  }>;
  getUserInfo: (userId?: string) => { _id: string; name: string } | null;
  onAddTaskClick: (columnId: string) => void;
  onTaskClick: (taskId: string) => void;
};

const columnColors: Record<string, string> = {
  "To Do": "bg-muted-foreground/60",
  "In Progress": "bg-primary",
  Done: "bg-emerald-500",
};

export default function DroppableColumn({
  columnId,
  columnName,
  taskCount,
  tasks,
  getUserInfo,
  onAddTaskClick,
  onTaskClick,
}: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
  });

  const taskIds = tasks.map((task) => task._id);
  const dotColor = columnColors[columnName] || "bg-muted-foreground/40";

  return (
    <div
      ref={setNodeRef}
      className={`w-80 shrink-0 rounded-xl border bg-muted/30 p-4 transition-all duration-200 ${
        isOver ? "border-primary/40 bg-primary/5" : "border-border"
      }`}
    >
      {/* Column header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          {columnName}
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {taskCount}
          </span>
        </h2>
        <Button
          onClick={() => onAddTaskClick(columnId)}
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Tasks - SortableContext handles the drag-drop logic */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-2.5 min-h-[60px]">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 text-center">
              <Inbox className="mb-2 h-5 w-5 text-muted-foreground/50" />
              <p className="text-xs text-muted-foreground">No tasks yet</p>
            </div>
          ) : (
            tasks.map((task) => (
              <DraggableTaskItem
                key={task._id}
                task={task}
                assigneeInfo={getUserInfo(task.assignedTo)}
                onTaskClick={onTaskClick}
              />
            ))
          )}
        </div>
      </SortableContext>

      {/* Add task button */}
      <Button
        onClick={() => onAddTaskClick(columnId)}
        className="mt-4 w-full gap-1"
        variant="outline"
        size="sm"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Task
      </Button>
    </div>
  );
}
