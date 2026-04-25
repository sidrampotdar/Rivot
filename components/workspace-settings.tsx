"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
};

export default function WorkspaceSettings({
  workspaceId,
  workspaceName,
  members,
  ownerId,
  currentUserId,
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
    } catch (err) {
      setError("Failed to load users");
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
        name: newName,
      });
      router.refresh();
      setIsEditing(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update workspace",
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
      setError(err instanceof Error ? err.message : "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove this member from the workspace?")) return;

    setLoading(true);
    try {
      await removeMemberFromWorkspace({
        workspaceId,
        userId: memberId,
      });

      setLocalMembers(localMembers.filter((m) => m._id !== memberId));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = currentUserId === ownerId;

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Workspace Name */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-slate-900">Workspace</h2>
          {isOwner && (
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              size="sm"
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 rounded-md border border-slate-300 p-2"
              disabled={loading}
            />
            <Button
              onClick={handleSaveName}
              disabled={loading}
              className="bg-black text-white"
            >
              Save
            </Button>
          </div>
        ) : (
          <p className="text-slate-700">{newName}</p>
        )}
      </div>

      {/* Members */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Members</h3>
          {isOwner && (
            <Button
              onClick={() => setIsAddMemberOpen(true)}
              className="bg-black text-white"
              size="sm"
            >
              + Add Member
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {localMembers.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-slate-900">{member.name}</p>
                <p className="text-sm text-slate-600">{member.email}</p>
                {member._id === ownerId && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded mt-1 inline-block">
                    Owner
                  </span>
                )}
              </div>

              {isOwner && member._id !== ownerId && (
                <Button
                  onClick={() => handleRemoveMember(member._id)}
                  disabled={loading}
                  variant="destructive"
                  size="sm"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Select User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded-md border border-slate-300 p-2 text-sm mt-1"
              >
                <option value="">Choose a user...</option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleAddMember}
                disabled={loading || !selectedUserId}
                className="flex-1 bg-black text-white"
              >
                {loading ? "Adding..." : "Add"}
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
