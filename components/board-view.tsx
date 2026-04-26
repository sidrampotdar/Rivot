"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import DroppableColumn from "./droppable-column";
import CreateTaskModal from "./create-task-modal";
import { moveTask } from "@/lib/task-actions";
import TaskCard from "./task-card";

type ColumnWithTasks = {
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
};

type BoardViewProps = {
  columns: ColumnWithTasks[];
  boardId: string;
  projectId: string;
  users: Array<{ _id: string; name: string }>;
  onTaskClick: (taskId: string) => void;
};

export default function BoardView({
  columns,
  boardId,
  projectId,
  users,
  onTaskClick,
}: BoardViewProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [localColumns, setLocalColumns] = useState(columns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleCreateTaskClick = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsCreateModalOpen(true);
  };

  const handleTaskCreated = () => {
    setIsCreateModalOpen(false);
    setSelectedColumnId(null);
  };

  const getUserInfo = (userId?: string): { _id: string; name: string } | null => {
    if (!userId) return null;
    return users.find((u) => u._id === userId) ?? null;
  };

  const getTaskById = (taskId: string) => {
    for (const column of localColumns) {
      const task = column.tasks.find((t) => t._id === taskId);
      if (task) return task;
    }
    return null;
  };

  const getColumnAndTaskIndex = (taskId: string) => {
    for (let colIdx = 0; colIdx < localColumns.length; colIdx++) {
      const taskIdx = localColumns[colIdx].tasks.findIndex(
        (t) => t._id === taskId
      );
      if (taskIdx !== -1) {
        return { columnIndex: colIdx, taskIndex: taskIdx };
      }
    }
    return null;
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    setIsDragging(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const draggedTaskId = active.id as string;
    const dropTargetId = over.id as string;

    // Find current position
    const currentPos = getColumnAndTaskIndex(draggedTaskId);
    if (!currentPos) {
      setActiveId(null);
      return;
    }

    // Check if dropped on a column or task
    let targetColumnId = dropTargetId;
    let targetColumnIndex = localColumns.findIndex((c) => c._id === dropTargetId);

    // If dropped on a task, find its column
    if (targetColumnIndex === -1) {
      for (let i = 0; i < localColumns.length; i++) {
        if (localColumns[i].tasks.some((t) => t._id === dropTargetId)) {
          targetColumnId = localColumns[i]._id;
          targetColumnIndex = i;
          break;
        }
      }
    }

    if (targetColumnIndex === -1) {
      setActiveId(null);
      return;
    }

    // Find position in target column
    let targetTaskIndex = localColumns[targetColumnIndex].tasks.findIndex(
      (t) => t._id === dropTargetId
    );
    if (targetTaskIndex === -1) {
      targetTaskIndex = localColumns[targetColumnIndex].tasks.length;
    }

    // Update local state optimistically
    const newColumns = [...localColumns];
    const [draggedTask] = newColumns[currentPos.columnIndex].tasks.splice(
      currentPos.taskIndex,
      1
    );

    newColumns[targetColumnIndex].tasks.splice(targetTaskIndex, 0, draggedTask);
    setLocalColumns(newColumns);

    // Call server action
    try {
      await moveTask({
        taskId: draggedTaskId,
        newColumnId: targetColumnId,
        newOrder: targetTaskIndex,
        projectId,
      });
    } catch (err) {
      console.error("Failed to move task:", err);
      // Revert local state on error
      setLocalColumns(columns);
    }

    setActiveId(null);
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {localColumns.map((column) => (
            <DroppableColumn
              key={column._id}
              columnId={column._id}
              columnName={column.name}
              taskCount={column.tasks.length}
              tasks={column.tasks}
              getUserInfo={getUserInfo}
              onAddTaskClick={handleCreateTaskClick}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>

        {/* Drag overlay - shows what's being dragged */}
        <DragOverlay>
          {activeId ? (
            <div className="opacity-50">
              <TaskCard
                task={getTaskById(activeId) as any}
                assigneeInfo={
                  getUserInfo(getTaskById(activeId)?.assignedTo) || undefined
                }
                onTaskClick={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Create task modal */}
      {selectedColumnId && (
        <CreateTaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreated={handleTaskCreated}
          columnId={selectedColumnId}
          boardId={boardId}
          projectId={projectId}
          users={users}
        />
      )}
    </>
  );
}
