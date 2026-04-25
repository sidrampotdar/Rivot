"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import DialogProject from "./dialog-project";

const CreateProject = ({ user, projects }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Welcome back, {user.name} 👋
          </h1>
          <p className="mt-1 text-slate-600">
            Here’s what’s happening with your projects today.
          </p>
        </div>

        <Button onClick={() => setIsDialogOpen(true)}>+ Create Project</Button>
      </div>
      <DialogProject
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {/* Projects Section */}
      <section>
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          Your Projects
        </h2>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
            No projects yet. Create your first project 🚀
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {project.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {project.description || "No description provided."}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default CreateProject;
