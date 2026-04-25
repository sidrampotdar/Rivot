"use client";

import { useState } from "react";
import BoardView from "@/components/board-view";
import TaskDetailsModal from "@/components/task-details-modal";

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

  // Mock users - in production, fetch from server
  const mockUsers = [
    { _id: "user1", name: "Sidramappa Potdar" },
    { _id: "user2", name: "S potdar" },
    { _id: "user3", name: "Sidram Potdar" },
  ];

  return (
    <>
      <main className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {data.project.name}
          </h1>
          <p className="text-slate-600">{data.project.description}</p>
        </div>

        {/* Board */}
        <BoardView
          columns={data.columns}
          boardId={data.board._id}
          projectId={data.project._id}
          users={mockUsers}
          onTaskClick={handleTaskClick}
        />
      </main>

      {/* Task Details Modal */}
      {selectedTaskId && (
        <TaskDetailsModal
          isOpen={Boolean(selectedTaskId)}
          onClose={handleTaskModalClose}
          taskId={selectedTaskId}
          projectId={data.project._id}
          users={mockUsers}
          onTaskDeleted={handleTaskDeleted}
        />
      )}
    </>
  );
}
