import syncClerkUserToDb from "@/lib/user";
import { getUserProjects } from "@/lib/projects";
import CreateProject from "@/components/create-project";
import { Workspace } from "@/models";
// Server Component (DashboardPage)
//         ↓ (props)
// Client (CreateProject)
//         ↓
// Client (DialogProject → form)
//         ↓
// Server Action (createProject)
//         ↓
// DB
//         ↓
// router.refresh()

export default async function DashboardPage() {
  const user = await syncClerkUserToDb();

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-10 text-center">
        <div className="text-lg text-slate-700">
          Please sign in to continue.
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
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <CreateProject
        user={user}
        projects={projects}
        workspaceId={workspaceId}
      />
    </main>
  );
}
