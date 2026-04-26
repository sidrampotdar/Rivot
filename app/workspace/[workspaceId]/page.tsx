import { getWorkspace } from "@/lib/workspace-actions";
import WorkspaceSettings from "@/components/workspace-settings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/user";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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

  await connectDB();

  // Get the actual MongoDB user ID and role from Clerk ID
  const dbUser = await User.findOne({ clerkId: clerkUser.id })
    .select("_id role")
    .lean();

  const { workspace } = await getWorkspace(workspaceId);

  const membersArray = Array.isArray(workspace.members)
    ? workspace.members.map((m: any) => ({
        _id: m._id.toString(),
        name: m.name,
        email: m.email,
      }))
    : [];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="mb-6 gap-1 text-muted-foreground hover:text-foreground"
      >
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="animate-fade-in mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Workspace Settings
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your workspace and team members.
        </p>
      </div>

      <div className="animate-slide-up rounded-xl border border-border bg-card p-6">
        <WorkspaceSettings
          workspaceId={workspaceId}
          workspaceName={workspace.name}
          members={membersArray}
          ownerId={workspace.owner._id.toString()}
          currentUserId={dbUser?._id?.toString() ?? ""}
          userRole={dbUser?.role as "admin" | "employee" | undefined}
        />
      </div>
    </main>
  );
}
