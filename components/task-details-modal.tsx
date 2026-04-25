"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateTask, deleteTask } from "@/lib/task-actions";
import {
  getTaskDetails,
  addCommentToTask,
  deleteComment,
} from "@/lib/task-details-actions";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

type TaskDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  projectId: string;
  users: Array<{ _id: string; name: string }>;
  onTaskDeleted?: () => void;
};

type TaskDetailsType = {
  task: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    assignedTo?: { _id: string; name: string };
    createdBy?: { name: string };
    createdAt: string;
  };
  comments: Array<{
    _id: string;
    content: string;
    userName: string;
    createdAt: string;
  }>;
  activityLog: Array<{
    action: string;
    oldValue?: string;
    newValue?: string;
    userName: string;
    createdAt: string;
  }>;
};

export default function TaskDetailsModal({
  isOpen,
  onClose,
  taskId,
  projectId,
  users,
  onTaskDeleted,
}: TaskDetailsModalProps) {
  const router = useRouter();
  const [data, setData] = useState<TaskDetailsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editDescription, setEditDescription] = useState("");
  const [isEditingPriority, setIsEditingPriority] = useState(false);
  const [editPriority, setEditPriority] = useState<"low" | "medium" | "high">(
    "medium",
  );

  // Comment states
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);

  // Fetch task details
  useEffect(() => {
    if (isOpen && taskId) {
      loadTaskDetails();
    }
  }, [isOpen, taskId]);

  const loadTaskDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const taskData = await getTaskDetails(taskId);
      setData(taskData as any);
      setEditTitle(taskData.task.title);
      setEditDescription(taskData.task.description);
      setEditPriority(taskData.task.priority);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load task details",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTitle = async () => {
    if (!editTitle.trim() || editTitle === data?.task.title) {
      setIsEditingTitle(false);
      return;
    }

    try {
      await updateTask({
        taskId,
        updates: { title: editTitle },
        projectId,
      });
      await loadTaskDetails();
      setIsEditingTitle(false);
    } catch (err) {
      setError("Failed to update title");
    }
  };

  const handleSaveDescription = async () => {
    if (editDescription === data?.task.description) {
      setIsEditingDescription(false);
      return;
    }

    try {
      await updateTask({
        taskId,
        updates: { description: editDescription },
        projectId,
      });
      await loadTaskDetails();
      setIsEditingDescription(false);
    } catch (err) {
      setError("Failed to update description");
    }
  };

  const handleSavePriority = async () => {
    if (editPriority === data?.task.priority) {
      setIsEditingPriority(false);
      return;
    }

    try {
      await updateTask({
        taskId,
        updates: { priority: editPriority },
        projectId,
      });
      await loadTaskDetails();
      setIsEditingPriority(false);
    } catch (err) {
      setError("Failed to update priority");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsAddingComment(true);
    try {
      const currentUserId = localStorage.getItem("userId") || "";
      await addCommentToTask({
        taskId,
        content: newComment,
        userId: currentUserId,
      });
      setNewComment("");
      await loadTaskDetails();
    } catch (err) {
      setError("Failed to add comment");
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask({ taskId, projectId });
      router.refresh();
      onTaskDeleted?.();
      onClose();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleClose = () => {
    setError(null);
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setIsEditingPriority(false);
    onClose();
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <p className="text-slate-600">Loading task details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle>Task Details</DialogTitle>
            <Button
              onClick={handleDeleteTask}
              variant="destructive"
              size="sm"
              className="h-8"
            >
              Delete
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-slate-700">Title</label>
            {isEditingTitle ? (
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 rounded-md border border-slate-300 p-2 text-sm"
                  autoFocus
                />
                <Button
                  onClick={handleSaveTitle}
                  size="sm"
                  className="bg-black text-white"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditingTitle(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="mt-1 p-2 rounded-md bg-slate-50 cursor-pointer hover:bg-slate-100 text-slate-900"
              >
                {data.task.title}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            {isEditingDescription ? (
              <div className="flex flex-col gap-2 mt-1">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="rounded-md border border-slate-300 p-2 text-sm"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveDescription}
                    size="sm"
                    className="bg-black text-white"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditingDescription(false)}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingDescription(true)}
                className="mt-1 p-2 rounded-md bg-slate-50 cursor-pointer hover:bg-slate-100 text-slate-900 min-h-12"
              >
                {data.task.description || "No description"}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Priority
              </label>
              {isEditingPriority ? (
                <div className="flex gap-2 mt-1">
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as any)}
                    className="flex-1 rounded-md border border-slate-300 p-2 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <Button
                    onClick={handleSavePriority}
                    size="sm"
                    className="bg-black text-white"
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingPriority(true)}
                  className={`mt-1 p-2 rounded-md cursor-pointer text-xs px-2 py-1 ${
                    priorityColors[data.task.priority]
                  }`}
                >
                  {data.task.priority.charAt(0).toUpperCase() +
                    data.task.priority.slice(1)}
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="text-sm font-medium text-slate-700">
                Due Date
              </label>
              <div className="mt-1 p-2 rounded-md bg-slate-50 text-slate-900 text-sm">
                {data.task.dueDate
                  ? format(new Date(data.task.dueDate), "MMM dd, yyyy")
                  : "No due date"}
              </div>
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="text-sm font-medium text-slate-700">
              Assigned To
            </label>
            <div className="mt-1 p-2 rounded-md bg-slate-50 text-slate-900 text-sm">
              {data.task.assignedTo?.name || "Unassigned"}
            </div>
          </div>

          {/* Comments */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-slate-900 mb-3">Comments</h3>

            {/* Add comment */}
            <div className="flex gap-2 mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={2}
                className="flex-1 rounded-md border border-slate-300 p-2 text-sm"
              />
              <Button
                onClick={handleAddComment}
                disabled={isAddingComment || !newComment.trim()}
                className="self-end bg-black text-white"
              >
                {isAddingComment ? "..." : "Comment"}
              </Button>
            </div>

            {/* Comments list */}
            <div className="space-y-3">
              {data.comments.length === 0 ? (
                <p className="text-sm text-slate-500">No comments yet</p>
              ) : (
                data.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="p-3 bg-slate-50 rounded-md text-sm"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-900">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-slate-500">
                        {format(new Date(comment.createdAt), "MMM dd, HH:mm")}
                      </span>
                    </div>
                    <p className="text-slate-700">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Activity Log */}
          <div className="border-t pt-4">
            <h3 className="font-medium text-slate-900 mb-3">Activity</h3>
            <div className="space-y-2 text-sm">
              {data.activityLog.length === 0 ? (
                <p className="text-slate-500">No activity yet</p>
              ) : (
                data.activityLog.map((log, idx) => (
                  <div key={idx} className="text-slate-600">
                    <span className="font-medium">{log.userName}</span>{" "}
                    {log.action}
                    {log.oldValue && log.newValue && (
                      <>
                        {" "}
                        from <span className="font-mono">
                          {log.oldValue}
                        </span>{" "}
                        to <span className="font-mono">{log.newValue}</span>
                      </>
                    )}
                    <span className="text-xs text-slate-500 ml-2">
                      {format(new Date(log.createdAt), "MMM dd, HH:mm")}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
