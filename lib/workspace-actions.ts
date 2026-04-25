"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Workspace, User } from "@/models";
import { revalidatePath } from "next/cache";

export async function getWorkspace(workspaceId: string) {
  await connectDB();

  const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

  const workspace = await Workspace.findById(workspaceObjectId)
    .populate("ownerId", "name email avatar")
    .populate("members", "name email avatar")
    .lean();

  if (!workspace) throw new Error("Workspace not found");

  return {
    workspace: {
      _id: workspace._id.toString(),
      name: workspace.name,
      owner: workspace.ownerId,
      members: workspace.members,
    },
  };
}

export async function updateWorkspace({
  workspaceId,
  name,
  description,
}: {
  workspaceId: string;
  name?: string;
  description?: string;
}): Promise<{ success: boolean }> {
  await connectDB();

  if (name && !name.trim()) {
    throw new Error("Workspace name cannot be empty");
  }

  const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
  const updateData: Record<string, any> = {};

  if (name) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description;

  await Workspace.updateOne({ _id: workspaceObjectId }, updateData);

  revalidatePath(`/workspace/${workspaceId}`);
  return { success: true };
}

export async function addMemberToWorkspace({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}): Promise<{ success: boolean }> {
  await connectDB();

  const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Add member to workspace
  await Workspace.updateOne(
    { _id: workspaceObjectId },
    { $addToSet: { members: userObjectId } },
  );

  // Add workspace to user
  await User.updateOne(
    { _id: userObjectId },
    { $addToSet: { workspaces: workspaceObjectId } },
  );

  revalidatePath(`/workspace/${workspaceId}`);
  return { success: true };
}

export async function removeMemberFromWorkspace({
  workspaceId,
  userId,
}: {
  workspaceId: string;
  userId: string;
}): Promise<{ success: boolean }> {
  await connectDB();

  const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Check if user is owner
  const workspace = await Workspace.findById(workspaceObjectId);
  if (workspace.ownerId.toString() === userObjectId.toString()) {
    throw new Error("Cannot remove workspace owner");
  }

  // Remove member from workspace
  await Workspace.updateOne(
    { _id: workspaceObjectId },
    { $pull: { members: userObjectId } },
  );

  // Remove workspace from user
  await User.updateOne(
    { _id: userObjectId },
    { $pull: { workspaces: workspaceObjectId } },
  );

  revalidatePath(`/workspace/${workspaceId}`);
  return { success: true };
}

export async function getAllUsers() {
  await connectDB();

  const users = await User.find({}).select("name email avatar").lean();

  return {
    users: users.map((u: any) => ({
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
    })),
  };
}
