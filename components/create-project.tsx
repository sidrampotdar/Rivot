"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import DialogProject from "./dialog-project";
import { useRouter } from "next/navigation";
import { FolderOpen, Plus, ArrowRight } from "lucide-react";

type ProjectCard = {
  _id: string;
  name: string;
  description: string;
};

type CreateProjectProps = {
  user: {
    _id: string;
    name: string;
  };
  projects: ProjectCard[];
  workspaceId: string;
};

const CreateProject = ({ user, projects, workspaceId }: CreateProjectProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/project/${id}`);
  };

  return (
    <>
      {/* Header */}
      <div className="animate-fade-in mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening with your projects today.
          </p>
        </div>

        <Button
          onClick={() => setIsDialogOpen(true)}
          className="gap-2"
          size="lg"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <DialogProject
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        userId={user._id}
        workspaceId={workspaceId}
      />

      {/* Projects Section */}
      <section className="animate-slide-up">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          Your Projects
        </h2>

        {projects.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <FolderOpen className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground">No projects yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first project to get started 🚀
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              className="mt-4 gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => handleClick(project._id)}
                className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <FolderOpen className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-card-foreground">
                  {project.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                  {project.description || "No description provided."}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  Open project
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default CreateProject;
