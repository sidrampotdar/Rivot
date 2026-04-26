"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addMemberToWorkspace,
  removeMemberFromWorkspace,
  getAllUsers,
  updateWorkspace,
} from "@/lib/workspace-actions";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Pencil,
  Check,
  X,
  UserPlus,
  UserMinus,
  Crown,
} from "lucide-react";

type WorkspaceSettingsProps = {
  workspaceId: string;
  workspaceName: string;
  members: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  ownerId: string;
  currentUserId: string;
  userRole?: "admin" | "employee";
};

export default function WorkspaceSettings({
  workspaceId,
  workspaceName,
  members,
  ownerId,
  currentUserId,
  userRole,
}: WorkspaceSettingsProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(workspaceName);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<
    Array<{ _id: string; name: string; email: string }>
  >([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localMembers, setLocalMembers] = useState(members);

  useEffect(() => {
    if (isAddMemberOpen) {
      loadAvailableUsers();
    }
  }, [isAddMemberOpen]);

  const loadAvailableUsers = async () => {
    try {
      const { users } = await getAllUsers();
      // Filter out existing members
      const memberIds = new Set(localMembers.map((m) => m._id));
      const available = users.filter((u: any) => !memberIds.has(u._id));
      setAvailableUsers(available);
    } catch {
      setError("Failed to load users.");
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim() || newName === workspaceName) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      await updateWorkspace({
        workspaceId,
        name: newName.trim(),
      });
      router.refresh();
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update workspace.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return;

    setLoading(true);
    try {
      await addMemberToWorkspace({
        workspaceId,
        userId: selectedUserId,
      });

      // Update local members
      const user = availableUsers.find((u) => u._id === selectedUserId);
      if (user) {
        setLocalMembers([...localMembers, user]);
      }

      setSelectedUserId("");
      setIsAddMemberOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add member.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (
      !confirm(
        "Remove this member from the workspace? They will lose access to all projects.",
      )
    )
      return;

    setLoading(true);
    try {
      await removeMemberFromWorkspace({
        workspaceId,
        userId: memberId,
      });

      setLocalMembers(localMembers.filter((m) => m._id !== memberId));
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove member.",
      );
    } finally {
      setLoading(false);
    }
  };

  const canManage = currentUserId === ownerId || userRole === "admin";

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 font-medium underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Workspace Name */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Workspace Name
          </h2>
          {canManage && !isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <Input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
              disabled={loading}
              autoFocus
            />
            <Button
              onClick={handleSaveName}
              disabled={loading}
              size="icon"
              className="h-9 w-9"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setNewName(workspaceName);
              }}
              size="icon"
              variant="ghost"
              className="h-9 w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <p className="text-lg font-medium text-foreground">{newName}</p>
        )}
      </div>

      {/* Members */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Members ({localMembers.length})
          </h2>
          {canManage && (
            <Button
              onClick={() => setIsAddMemberOpen(true)}
              size="sm"
              className="gap-1"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Add Member
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {localMembers.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{member.name}</p>
                    {member._id === ownerId && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
                        <Crown className="h-3 w-3" />
                        Owner
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>

              {canManage && member._id !== ownerId && (
                <Button
                  onClick={() => handleRemoveMember(member._id)}
                  disabled={loading}
                  variant="ghost"
                  size="sm"
                  className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <UserMinus className="h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Select User
              </label>
              {availableUsers.length === 0 ? (
                <p className="rounded-lg bg-muted/50 p-3 text-center text-sm text-muted-foreground">
                  No available users to add.
                </p>
              ) : (
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Choose a user…</option>
                  {availableUsers.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddMember}
                disabled={loading || !selectedUserId}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding…
                  </>
                ) : (
                  "Add Member"
                )}
              </Button>
              <Button
                onClick={() => setIsAddMemberOpen(false)}
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
    </div>
  );
}
