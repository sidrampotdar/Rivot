"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DialogProject = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            placeholder="Project Name"
            className="w-full rounded-md border p-2"
          />
          <textarea
            placeholder="Description"
            className="w-full rounded-md border p-2"
          />

          <button
            className="w-full rounded-md bg-black py-2 text-white"
            onClick={onClose}
          >
            Create
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogProject;
