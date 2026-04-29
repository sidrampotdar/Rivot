"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Task, Column, Board, Project } from "@/models";
import { revalidatePath } from "next/cache";

export async function createTask({
  title,
  description = "",
  type = "task",
  columnId,
  boardId,
  assignedTo,
  priority = "medium",
  dueDate,
  storyPoints,
  labels = [],
  createdBy,
}: {
  title: string;
  description?: string;
  type?: "epic" | "story" | "task" | "bug" | "subtask";
  columnId: string;
  boardId: string;
  assignedTo?: string;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  storyPoints?: number;
  labels?: string[];
  createdBy: string;
}): Promise<{ taskId: string }> {
  await connectDB();

  if (!title.trim()) throw new Error("Task title is required");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const columnObjectId = new mongoose.Types.ObjectId(columnId);
    const boardObjectId = new mongoose.Types.ObjectId(boardId);
    const createdByObjectId = new mongoose.Types.ObjectId(createdBy);
    const assignedToObjectId = assignedTo
      ? new mongoose.Types.ObjectId(assignedTo)
      : undefined;

    // Get board to find project
    const board = await Board.findById(boardObjectId).session(session);
    if (!board) throw new Error("Board not found");

    // Get project and increment task count
    const project = await Project.findByIdAndUpdate(
      board.projectId,
      { $inc: { taskCount: 1 } },
      { new: true, session }
    );
    if (!project) throw new Error("Project not found");

    const taskKey = `${project.key}-${project.taskCount}`;

    // Get max order for tasks in this column
    const maxOrderTask = await Task.findOne({ columnId: columnObjectId })
      .sort({ order: -1 })
      .select("order")
      .session(session)
      .lean();

    const nextOrder = (maxOrderTask?.order ?? -1) + 1;

    const [task] = await Task.create(
      [
        {
          key: taskKey,
          title: title.trim(),
          description,
          type,
          columnId: columnObjectId,
          boardId: boardObjectId,
          assignedTo: assignedToObjectId,
          reporterId: createdByObjectId,
          priority,
          labels,
          storyPoints,
          dueDate,
          order: nextOrder,
          createdBy: createdByObjectId,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return { taskId: task._id.toString() };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

export async function updateTask({
  taskId,
  updates,
  projectId,
}: {
  taskId: string;
  updates: {
    title?: string;
    description?: string;
    type?: "epic" | "story" | "task" | "bug" | "subtask";
    priority?: "low" | "medium" | "high";
    dueDate?: Date | null;
    storyPoints?: number | null;
    assignedTo?: string | null;
  };
  projectId: string;
}): Promise<{ success: boolean }> {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const taskObjectId = new mongoose.Types.ObjectId(taskId);
    const updateData: Record<string, any> = {};

    if (updates.title !== undefined) {
      if (!updates.title.trim()) throw new Error("Task title cannot be empty");
      updateData.title = updates.title.trim();
    }

    if (updates.description !== undefined) {
      updateData.description = updates.description;
    }

    if (updates.priority !== undefined) {
      updateData.priority = updates.priority;
    }

    if (updates.type !== undefined) {
      updateData.type = updates.type;
    }

    if (updates.storyPoints !== undefined) {
      updateData.storyPoints = updates.storyPoints;
    }

    if (updates.dueDate !== undefined) {
      updateData.dueDate = updates.dueDate;
    }

    if (updates.assignedTo !== undefined) {
      updateData.assignedTo = updates.assignedTo
        ? new mongoose.Types.ObjectId(updates.assignedTo)
        : null;
    }

    await Task.updateOne({ _id: taskObjectId }, updateData, { session });

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/project/${projectId}`);
    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

export async function deleteTask({
  taskId,
  projectId,
}: {
  taskId: string;
  projectId: string;
}): Promise<{ success: boolean }> {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const taskObjectId = new mongoose.Types.ObjectId(taskId);

    // Get the task to find its column and order
    const task = await Task.findById(taskObjectId).select("columnId order");

    if (!task) throw new Error("Task not found");

    // Delete the task
    await Task.deleteOne({ _id: taskObjectId }, { session });

    // Reorder remaining tasks in the same column
    await Task.updateMany(
      { columnId: task.columnId, order: { $gt: task.order } },
      { $inc: { order: -1 } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/project/${projectId}`);
    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

export async function moveTask({
  taskId,
  newColumnId,
  newOrder,
  projectId,
}: {
  taskId: string;
  newColumnId: string;
  newOrder: number;
  projectId: string;
}): Promise<{ success: boolean }> {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const taskObjectId = new mongoose.Types.ObjectId(taskId);
    const newColumnObjectId = new mongoose.Types.ObjectId(newColumnId);

    // Get current task
    const currentTask =
      await Task.findById(taskObjectId).select("columnId order");

    if (!currentTask) throw new Error("Task not found");

    // If moving within same column, just reorder
    if (currentTask.columnId.toString() === newColumnObjectId.toString()) {
      const oldOrder = currentTask.order;

      if (oldOrder < newOrder) {
        // Moving down
        await Task.updateMany(
          {
            columnId: currentTask.columnId,
            order: { $gt: oldOrder, $lte: newOrder },
          },
          { $inc: { order: -1 } },
          { session },
        );
      } else if (oldOrder > newOrder) {
        // Moving up
        await Task.updateMany(
          {
            columnId: currentTask.columnId,
            order: { $gte: newOrder, $lt: oldOrder },
          },
          { $inc: { order: 1 } },
          { session },
        );
      }

      await Task.updateOne(
        { _id: taskObjectId },
        { order: newOrder },
        { session },
      );
    } else {
      // Moving to different column
      // 1. Shift tasks down in old column
      await Task.updateMany(
        { columnId: currentTask.columnId, order: { $gt: currentTask.order } },
        { $inc: { order: -1 } },
        { session },
      );

      // 2. Shift tasks down in new column to make space
      await Task.updateMany(
        { columnId: newColumnObjectId, order: { $gte: newOrder } },
        { $inc: { order: 1 } },
        { session },
      );

      // 3. Move task to new column with new order
      await Task.updateOne(
        { _id: taskObjectId },
        { columnId: newColumnObjectId, order: newOrder },
        { session },
      );
    }

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/project/${projectId}`);
    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}

export async function reorderTasksInColumn({
  columnId,
  taskIds,
  projectId,
}: {
  columnId: string;
  taskIds: string[];
  projectId: string;
}): Promise<{ success: boolean }> {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const columnObjectId = new mongoose.Types.ObjectId(columnId);

    // Update order for each task
    for (let i = 0; i < taskIds.length; i++) {
      const taskObjectId = new mongoose.Types.ObjectId(taskIds[i]);
      await Task.updateOne({ _id: taskObjectId }, { order: i }, { session });
    }

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/project/${projectId}`);
    return { success: true };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}
