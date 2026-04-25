"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createProject } from "@/lib/actions";

const DialogProject = ({
  isOpen,
  onClose,
  userId,
  workspaceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  workspaceId: string;
}) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !userId || !workspaceId) return;

    try {
      setLoading(true);

      const res = await createProject({
        name,
        description,
        userId,
        workspaceId,
      });

      router.push(`/project/${res.projectId}`);

      setName("");
      setDescription("");
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Project Name"
            className="w-full rounded-md border p-2"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Description"
            className="w-full rounded-md border p-2"
          />

          <button
            className="w-full rounded-md bg-black py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleCreate}
            disabled={loading || !name || !workspaceId}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogProject;
