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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
  const [type, setType] = useState<"epic" | "story" | "task" | "bug" | "subtask">("task");
  const [assignedTo, setAssignedTo] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [storyPoints, setStoryPoints] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Use the first available user as createdBy since we don't have auth context here
      const createdBy = users.length > 0 ? users[0]._id : "";

      await createTask({
        title: title.trim(),
        description,
        type,
        columnId,
        boardId,
        assignedTo: assignedTo || undefined,
        priority,
        storyPoints: storyPoints ? parseInt(storyPoints) : undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        createdBy,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setType("task");
      setAssignedTo("");
      setPriority("medium");
      setStoryPoints("");
      setDueDate("");

      // Refresh page data
      router.refresh();
      onTaskCreated();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create task. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setType("task");
    setAssignedTo("");
    setPriority("medium");
    setStoryPoints("");
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
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Title</label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details…"
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Issue Type
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as any)
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              >
                <option value="epic">Epic</option>
                <option value="story">Story</option>
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="subtask">Sub-task</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as "low" | "medium" | "high")
                }
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                disabled={loading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            {/* Story Points */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Story Points
              </label>
              <Input
                type="number"
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
                placeholder="0"
                min="0"
                disabled={loading}
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Assign To */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Assign To
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
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

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleCreate}
              disabled={loading || !title.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating…
                </>
              ) : (
                "Create Task"
              )}
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
