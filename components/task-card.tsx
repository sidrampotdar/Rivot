"use client";

import { TaskDocument } from "@/models/task";
import { format } from "date-fns";
import { Calendar, User, Flag, CircleDot, Bug, Bookmark, CheckSquare, GitPullRequest } from "lucide-react";

type TaskCardProps = {
  task: TaskDocument & { _id: string };
  assigneeInfo?: { name: string; avatar?: string } | null;
  onTaskClick: (taskId: string) => void;
};

const priorityConfig = {
  low: {
    bg: "bg-sky-50 dark:bg-sky-950/30",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-800",
  },
  medium: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-800",
  },
  high: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  },
};

export default function TaskCard({
  task,
  assigneeInfo,
  onTaskClick,
}: TaskCardProps) {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;

  const TypeIcon = {
    epic: <Bookmark className="h-3.5 w-3.5 text-purple-500" />,
    story: <Bookmark className="h-3.5 w-3.5 text-green-500" />,
    task: <CheckSquare className="h-3.5 w-3.5 text-blue-500" />,
    bug: <Bug className="h-3.5 w-3.5 text-red-500" />,
    subtask: <GitPullRequest className="h-3.5 w-3.5 text-slate-500" />
  }[task.type] || <CircleDot className="h-3.5 w-3.5 text-blue-500" />;

  return (
    <div
      onClick={() => onTaskClick(task._id.toString())}
      className="group cursor-pointer rounded-xl border border-border bg-card p-3.5 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground font-mono">
        {TypeIcon}
        <span className="font-medium">{task.key}</span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-medium text-card-foreground line-clamp-2 leading-snug">
        {task.title}
      </h4>

      {/* Meta info */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Priority badge */}
        <span
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${priority.bg} ${priority.text} ${priority.border}`}
        >
          <Flag className="h-3 w-3" />
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        {/* Story Points */}
        {task.storyPoints !== undefined && task.storyPoints !== null && (
          <span className="inline-flex items-center justify-center rounded-full bg-muted w-5 h-5 text-[10px] font-semibold text-muted-foreground">
            {task.storyPoints}
          </span>
        )}

        {/* Due date */}
        {task.dueDate && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {format(new Date(task.dueDate), "MMM d")}
          </span>
        )}
      </div>

      {/* Assignee */}
      {assigneeInfo && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-border/50 pt-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
            {assigneeInfo.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-muted-foreground">
            {assigneeInfo.name.split(" ")[0]}
          </span>
        </div>
      )}
    </div>
  );
}
