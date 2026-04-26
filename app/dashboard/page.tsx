import syncClerkUserToDb from "@/lib/user";
import { getUserProjects } from "@/lib/projects";
import CreateProject from "@/components/create-project";
import { Workspace } from "@/models";
import connectDB from "@/lib/db";

export default async function DashboardPage() {
  await connectDB();
  const user = await syncClerkUserToDb();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-10 text-center">
        <div className="animate-fade-in space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Sign in to continue
          </h2>
          <p className="text-muted-foreground">
            Please sign in to access your dashboard and projects.
          </p>
        </div>
      </main>
    );
  }

  const projects = await getUserProjects(user._id);
  const workspace = await Workspace.findOne({ members: user._id })
    .select("_id")
    .lean();
  const workspaceId = workspace?._id?.toString() ?? "";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <CreateProject
        user={user}
        projects={projects}
        workspaceId={workspaceId}
      />
    </main>
  );
}
