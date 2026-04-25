"use client";

import { useState } from "react";
import { createTask } from "@/lib/task-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  columnId: string;
  boardId: string;
  projectId: string;
  users: Array<{ _id: string; name: string }>;
};

export default function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
  columnId,
  boardId,
  projectId,
  users,
}: CreateTaskModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current user ID from localStorage or sessionStorage (for now)
  // In production, this should come from auth context
  const getCurrentUserId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId") || "";
    }
    return "";
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const createdBy = getCurrentUserId();

      await createTask({
        title: title.trim(),
        description,
        columnId,
        boardId,
        assignedTo: assignedTo || undefined,
        priority,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        createdBy,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setPriority("medium");
      setDueDate("");

      // Refresh page data
      router.refresh();
      onTaskCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setPriority("medium");
    setDueDate("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full rounded-md border border-slate-300 p-2 text-sm mt-1"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description (optional)"
              rows={3}
              className="w-full rounded-md border border-slate-300 p-2 text-sm mt-1"
              disabled={loading}
            />
          </div>

          {/* Priority */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full rounded-md border border-slate-300 p-2 text-sm mt-1"
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Assign To */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Assign To
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full rounded-md border border-slate-300 p-2 text-sm mt-1"
              disabled={loading}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-md border border-slate-300 p-2 text-sm mt-1"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCreate}
              disabled={loading || !title.trim()}
              className="flex-1 bg-black text-white hover:bg-slate-900"
            >
              {loading ? "Creating..." : "Create Task"}
            </Button>
            <Button
              onClick={handleClose}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
