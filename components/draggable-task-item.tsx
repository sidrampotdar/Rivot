"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./task-card";

type DraggableTaskItemProps = {
  task: {
    _id: string;
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    assignedTo?: string;
  };
  assigneeInfo?: { name: string; avatar?: string } | null;
  onTaskClick: (taskId: string) => void;
};

export default function DraggableTaskItem({
  task,
  assigneeInfo,
  onTaskClick,
}: DraggableTaskItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isDragging ? "cursor-grabbing" : "cursor-grab"}
    >
      <TaskCard
        task={task as any}
        assigneeInfo={assigneeInfo}
        onTaskClick={onTaskClick}
      />
    </div>
  );
}
