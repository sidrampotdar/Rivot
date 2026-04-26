"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateTask, deleteTask } from "@/lib/task-actions";
import {
  getTaskDetails,
  addCommentToTask,
} from "@/lib/task-details-actions";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Trash2,
  Loader2,
  MessageSquare,
  Activity,
  Flag,
  Calendar,
  User,
  Pencil,
  Check,
  X,
} from "lucide-react";

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

  // Active tab
  const [activeTab, setActiveTab] = useState<"comments" | "activity">(
    "comments",
  );

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
        err instanceof Error ? err.message : "Failed to load task details.",
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
        updates: { title: editTitle.trim() },
        projectId,
      });
      await loadTaskDetails();
      setIsEditingTitle(false);
    } catch {
      setError("Failed to update title.");
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
    } catch {
      setError("Failed to update description.");
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
    } catch {
      setError("Failed to update priority.");
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsAddingComment(true);
    try {
      // Use first user as fallback for comment author
      const currentUserId = users.length > 0 ? users[0]._id : "";
      await addCommentToTask({
        taskId,
        content: newComment.trim(),
        userId: currentUserId,
      });
      setNewComment("");
      await loadTaskDetails();
    } catch {
      setError("Failed to add comment.");
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm("Are you sure you want to delete this task? This cannot be undone.")) return;

    try {
      await deleteTask({ taskId, projectId });
      router.refresh();
      onTaskDeleted?.();
      onClose();
    } catch {
      setError("Failed to delete task.");
    }
  };

  const handleClose = () => {
    setError(null);
    setIsEditingTitle(false);
    setIsEditingDescription(false);
    setIsEditingPriority(false);
    setActiveTab("comments");
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <div className="flex flex-col items-center justify-center gap-3 p-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading task details…
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) {
    return null;
  }

  const currentPriority =
    priorityConfig[data.task.priority] || priorityConfig.medium;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-base">Task Details</DialogTitle>
            <Button
              onClick={handleDeleteTask}
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-5">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Title
            </label>
            {isEditingTitle ? (
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button onClick={handleSaveTitle} size="icon" variant="ghost" className="h-9 w-9 text-primary">
                  <Check className="h-4 w-4" />
                </Button>
                <Button onClick={() => setIsEditingTitle(false)} size="icon" variant="ghost" className="h-9 w-9">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="group flex cursor-pointer items-center gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-foreground transition-colors hover:bg-muted"
              >
                <span className="flex-1 font-medium">{data.task.title}</span>
                <Pencil className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Description
            </label>
            {isEditingDescription ? (
              <div className="space-y-2">
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveDescription} size="sm">
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditingDescription(false)}
                    size="sm"
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingDescription(true)}
                className="group flex cursor-pointer items-start gap-2 rounded-lg bg-muted/50 px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted min-h-12"
              >
                <span className="flex-1">
                  {data.task.description || (
                    <span className="text-muted-foreground italic">
                      Click to add a description…
                    </span>
                  )}
                </span>
                <Pencil className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-3 gap-3">
            {/* Priority */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                <Flag className="h-3 w-3" />
                Priority
              </label>
              {isEditingPriority ? (
                <div className="flex gap-1">
                  <select
                    value={editPriority}
                    onChange={(e) =>
                      setEditPriority(
                        e.target.value as "low" | "medium" | "high",
                      )
                    }
                    className="flex-1 rounded-lg border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  <Button
                    onClick={handleSavePriority}
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-primary"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <div
                  onClick={() => setIsEditingPriority(true)}
                  className={`cursor-pointer rounded-lg border px-3 py-1.5 text-center text-xs font-medium transition-colors ${currentPriority.bg} ${currentPriority.text} ${currentPriority.border}`}
                >
                  {data.task.priority.charAt(0).toUpperCase() +
                    data.task.priority.slice(1)}
                </div>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Due Date
              </label>
              <div className="rounded-lg bg-muted/50 px-3 py-1.5 text-center text-sm text-foreground">
                {data.task.dueDate
                  ? format(new Date(data.task.dueDate), "MMM dd, yyyy")
                  : "—"}
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                <User className="h-3 w-3" />
                Assignee
              </label>
              <div className="flex items-center gap-1.5 rounded-lg bg-muted/50 px-3 py-1.5 text-sm">
                {data.task.assignedTo ? (
                  <>
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {data.task.assignedTo.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-foreground truncate">
                      {data.task.assignedTo.name.split(" ")[0]}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </div>
            </div>
          </div>

          {/* Tabs: Comments / Activity */}
          <div className="border-t border-border pt-4">
            <div className="mb-4 flex gap-1 rounded-lg bg-muted/50 p-1">
              <button
                onClick={() => setActiveTab("comments")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "comments"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Comments ({data.comments.length})
              </button>
              <button
                onClick={() => setActiveTab("activity")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === "activity"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                Activity ({data.activityLog.length})
              </button>
            </div>

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <div className="space-y-3">
                {/* Add comment */}
                <div className="flex gap-2">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment…"
                    rows={2}
                    className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={isAddingComment || !newComment.trim()}
                    className="self-end"
                    size="sm"
                  >
                    {isAddingComment ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Post"
                    )}
                  </Button>
                </div>

                {/* Comments list */}
                {data.comments.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No comments yet. Start the conversation.
                  </p>
                ) : (
                  data.comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="rounded-lg bg-muted/30 p-3 text-sm"
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                            {comment.userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-foreground">
                            {comment.userName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(
                            new Date(comment.createdAt),
                            "MMM dd, HH:mm",
                          )}
                        </span>
                      </div>
                      <p className="text-muted-foreground pl-6">
                        {comment.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-2">
                {data.activityLog.length === 0 ? (
                  <p className="py-4 text-center text-sm text-muted-foreground">
                    No activity recorded yet.
                  </p>
                ) : (
                  data.activityLog.map((log, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 rounded-lg p-2 text-sm"
                    >
                      <div className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                      <div className="flex-1">
                        <span className="font-medium text-foreground">
                          {log.userName}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {log.action}
                        </span>
                        {log.oldValue && log.newValue && (
                          <span className="text-muted-foreground">
                            {" "}
                            from{" "}
                            <span className="font-mono text-xs bg-muted rounded px-1">
                              {log.oldValue}
                            </span>{" "}
                            to{" "}
                            <span className="font-mono text-xs bg-muted rounded px-1">
                              {log.newValue}
                            </span>
                          </span>
                        )}
                        <span className="ml-2 text-xs text-muted-foreground/60">
                          {format(new Date(log.createdAt), "MMM dd, HH:mm")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
