"use client";

import { useState } from "react";
import BoardView from "@/components/board-view";
import TaskDetailsModal from "@/components/task-details-modal";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ProjectPageClientProps = {
  data: {
    project: {
      _id: string;
      name: string;
      description: string;
    };
    board: {
      _id: string;
    };
    columns: Array<{
      _id: string;
      name: string;
      order: number;
      tasks: Array<{
        _id: string;
        title: string;
        description: string;
        priority: "low" | "medium" | "high";
        dueDate?: string;
        assignedTo?: string;
      }>;
    }>;
    users: Array<{ _id: string; name: string }>;
  };
};

export default function ProjectPageClient({ data }: ProjectPageClientProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  const handleTaskModalClose = () => {
    setSelectedTaskId(null);
  };

  const handleTaskDeleted = () => {
    setSelectedTaskId(null);
    // Page will refresh via router.refresh() in the modal
  };

  const totalTasks = data.columns.reduce(
    (sum, col) => sum + col.tasks.length,
    0,
  );

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="animate-fade-in mb-8">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="mb-4 gap-1 text-muted-foreground hover:text-foreground"
          >
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {data.project.name}
              </h1>
              {data.project.description && (
                <p className="mt-1 text-muted-foreground">
                  {data.project.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-lg bg-muted px-3 py-1.5 font-medium">
                {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
              </span>
              <span className="rounded-lg bg-muted px-3 py-1.5 font-medium">
                {data.columns.length} columns
              </span>
            </div>
          </div>
        </div>

        {/* Board */}
        <div className="animate-slide-up">
          <BoardView
            columns={data.columns}
            boardId={data.board._id}
            projectId={data.project._id}
            users={data.users}
            onTaskClick={handleTaskClick}
          />
        </div>
      </main>

      {/* Task Details Modal */}
      {selectedTaskId && (
        <TaskDetailsModal
          isOpen={Boolean(selectedTaskId)}
          onClose={handleTaskModalClose}
          taskId={selectedTaskId}
          projectId={data.project._id}
          users={data.users}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </>
  );
}
