"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableTaskItem from "./draggable-task-item";
import { Button } from "@/components/ui/button";

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
  getUserInfo: (userId?: string) => { name: string } | null;
  onAddTaskClick: (columnId: string) => void;
  onTaskClick: (taskId: string) => void;
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
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  const taskIds = tasks.map((task) => task._id);

  return (
    <div
      ref={setNodeRef}
      className="w-80 shrink-0 rounded-xl bg-slate-50 p-4 border border-slate-200"
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
          {columnName}
          <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded">
            {taskCount}
          </span>
        </h2>
      </div>

      {/* Tasks - SortableContext handles the drag-drop logic */}
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-slate-300 p-6 text-center">
              <p className="text-sm text-slate-400">No tasks</p>
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
        className="w-full mt-4 bg-slate-200 text-slate-900 hover:bg-slate-300"
        variant="outline"
      >
        + Add Task
      </Button>
    </div>
  );
}
