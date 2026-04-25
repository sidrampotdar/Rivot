import { getWorkspace } from "@/lib/workspace-actions";
import WorkspaceSettings from "@/components/workspace-settings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const { workspace } = await getWorkspace(workspaceId);

  const membersArray = Array.isArray(workspace.members)
    ? workspace.members.map((m: any) => ({
        _id: m._id.toString(),
        name: m.name,
        email: m.email,
      }))
    : [];

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Workspace Settings
        </h1>
        <p className="text-slate-600 mt-1">Manage your workspace and members</p>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <WorkspaceSettings
          workspaceId={workspaceId}
          workspaceName={workspace.name}
          members={membersArray}
          ownerId={workspace.owner._id.toString()}
          currentUserId={clerkUser.id}
        />
      </div>
    </main>
  );
}
