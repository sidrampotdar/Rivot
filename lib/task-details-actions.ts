"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Task, Comment, ActivityLog } from "@/models";

export async function getTaskDetails(taskId: string): Promise<{
  task: any;
  comments: any[];
  activityLog: any[];
}> {
  await connectDB();

  const taskObjectId = new mongoose.Types.ObjectId(taskId);

  // Fetch task
  const task = await Task.findById(taskObjectId)
    .populate("assignedTo", "name avatar email")
    .populate("createdBy", "name avatar email")
    .lean();

  if (!task) throw new Error("Task not found");

  // Fetch comments
  const comments = await Comment.find({ taskId: taskObjectId })
    .populate("userId", "name avatar email")
    .sort({ createdAt: -1 })
    .lean();

  // Fetch activity log
  const activityLog = await ActivityLog.find({ taskId: taskObjectId })
    .populate("userId", "name avatar email")
    .sort({ createdAt: -1 })
    .lean();

  const assignedTo = task.assignedTo as any;
  const createdBy = task.createdBy as any;

  return {
    task: {
      ...task,
      _id: task._id.toString(),
      columnId: task.columnId.toString(),
      boardId: task.boardId.toString(),
      assignedTo: assignedTo
        ? {
            _id: assignedTo._id.toString(),
            name: assignedTo.name,
          }
        : null,
      createdBy: createdBy
        ? {
            _id: createdBy._id.toString(),
            name: createdBy.name,
          }
        : null,
    },
    comments: comments.map((c: any) => ({
      _id: c._id.toString(),
      content: c.content,
      createdAt: c.createdAt,
      userId: c.userId._id.toString(),
      userName: c.userId.name,
    })),
    activityLog: activityLog.map((log: any) => ({
      _id: log._id.toString(),
      action: log.action,
      oldValue: log.oldValue,
      newValue: log.newValue,
      createdAt: log.createdAt,
      userId: log.userId._id.toString(),
      userName: log.userId.name,
    })),
  };
}

export async function addCommentToTask({
  taskId,
  content,
  userId,
}: {
  taskId: string;
  content: string;
  userId: string;
}): Promise<{ commentId: string }> {
  await connectDB();

  if (!content.trim()) throw new Error("Comment cannot be empty");

  const taskObjectId = new mongoose.Types.ObjectId(taskId);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const comment = await Comment.create({
    taskId: taskObjectId,
    userId: userObjectId,
    content: content.trim(),
  });

  return { commentId: comment._id.toString() };
}

export async function deleteComment({
  commentId,
}: {
  commentId: string;
}): Promise<{ success: boolean }> {
  await connectDB();

  const commentObjectId = new mongoose.Types.ObjectId(commentId);

  await Comment.deleteOne({ _id: commentObjectId });

  return { success: true };
}
