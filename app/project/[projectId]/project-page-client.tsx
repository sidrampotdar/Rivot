"use client";

import { useState } from "react";
import BoardView from "@/components/board-view";
import ListView from "@/components/list-view";
import TaskDetailsModal from "@/components/task-details-modal";
import { ArrowLeft, LayoutDashboard, List } from "lucide-react";
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
        key: string;
        title: string;
        description: string;
        type: "epic" | "story" | "task" | "bug" | "subtask";
        storyPoints?: number;
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
  const [view, setView] = useState<"board" | "list">("board");

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
              {/* View Switcher */}
              <div className="flex items-center rounded-lg bg-muted p-1">
                <button
                  onClick={() => setView("board")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    view === "board"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Board
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    view === "list"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
              </div>

              <span className="rounded-lg bg-muted px-3 py-1.5 font-medium ml-2">
                {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
              </span>
            </div>
          </div>
        </div>

        {/* Board / List */}
        <div className="animate-slide-up">
          {view === "board" ? (
            <BoardView
              columns={data.columns}
              boardId={data.board._id}
              projectId={data.project._id}
              users={data.users}
              onTaskClick={handleTaskClick}
            />
          ) : (
            <ListView
              columns={data.columns}
              users={data.users}
              onTaskClick={handleTaskClick}
            />
          )}
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
