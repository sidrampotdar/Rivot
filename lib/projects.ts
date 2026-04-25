import connectDB from "@/lib/db";
import { Workspace, Project, Board, Column, Task } from "@/models";
import mongoose from "mongoose";

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

export async function getProjectBoardData(projectId: string) {
  await connectDB();

  const _projectId = new mongoose.Types.ObjectId(projectId);

  // 1. Project
  const project = await Project.findById(_projectId).lean();
  if (!project) throw new Error("Project not found");

  // 2. Board (your schema uses projectId)
  const board = await Board.findOne({ projectId: _projectId }).lean();
  if (!board) throw new Error("Board not found for project");

  // 3. Columns (ordered)
  const columns = await Column.find({ boardId: board._id })
    .sort({ order: 1 })
    .lean();

  // 4. Tasks (for this board)
  const tasks = await Task.find({ boardId: board._id })
    .sort({ order: 1 })
    .lean();

  // 5. Group tasks by columnId
  const byColumn = new Map<string, any[]>();
  for (const col of columns) byColumn.set(col._id.toString(), []);

  for (const t of tasks) {
    const key = t.columnId.toString();
    if (!byColumn.has(key)) byColumn.set(key, []);
    byColumn.get(key)!.push(t);
  }

  const columnsWithTasks = columns.map((col) => ({
    ...col,
    tasks: byColumn.get(col._id.toString()) || [],
  }));

  return {
    project,
    board,
    columns: columnsWithTasks,
  };
}
