import { Project, Workspace } from "@/models";

export async function getUserProjects(userId: string) {
  // 1. Find workspaces where user is a member
  const workspaces = await Workspace.find({
    members: userId,
  }).select("_id");

  const workspaceIds = workspaces.map((w) => w._id);

  // 2. Find projects inside those workspaces
  const projects = await Project.find({
    workspaceId: { $in: workspaceIds },
  }).lean();

  // 🔥 3. Convert to plain objects
  const safeProjects = projects.map((project) => ({
    _id: project._id.toString(),
    name: project.name,
    description: project.description || "",
    workspaceId: project.workspaceId.toString(),
    createdBy: project.createdBy.toString(),
    createdAt: project.createdAt,
  }));

  return safeProjects;
}
