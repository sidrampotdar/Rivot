"use client";

import { TaskDocument } from "@/models/task";
import { format } from "date-fns";

type TaskCardProps = {
  task: TaskDocument & { _id: string };
  assigneeInfo?: { name: string; avatar?: string } | null;
  onTaskClick: (taskId: string) => void;
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export default function TaskCard({
  task,
  assigneeInfo,
  onTaskClick,
}: TaskCardProps) {
  return (
    <div
      onClick={() => onTaskClick(task._id.toString())}
      className="rounded-lg bg-white p-3 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md transition"
    >
      {/* Title */}
      <h4 className="font-medium text-sm text-slate-900 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Meta info */}
      <div className="space-y-2">
        {/* Priority badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2 py-1 rounded ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </span>
        </div>

        {/* Due date and assignee */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              📅 {format(new Date(task.dueDate), "MMM d")}
            </span>
          )}
          {assigneeInfo && (
            <span className="flex items-center gap-1">
              👤 {assigneeInfo.name.split(" ")[0]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
