"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Project, Board, Column } from "@/models";

const defaultColumns = ["To Do", "In Progress", "Done"];

export async function createProject({
  name,
  key,
  description,
  userId,
  workspaceId,
}: {
  name: string;
  key: string;
  description: string;
  userId: string;
  workspaceId: string;
}): Promise<{
  projectId: string;
  boardId: string;
  columnIds: string[];
}> {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);

    // 1. Project
    const [project] = await Project.create(
      [
        {
          name,
          key: key.toUpperCase(),
          description,
          workspaceId: workspaceObjectId,
          ownerId: userObjectId,
          createdBy: userObjectId,
        },
      ],
      { session },
    );

    // 2. Board
    const [board] = await Board.create(
      [
        {
          name: "Main Board",
          projectId: project._id,
        },
      ],
      { session },
    );

    // 3. Columns
    const defaultColumnData = [
      { name: "To Do", category: "todo" },
      { name: "In Progress", category: "in-progress" },
      { name: "Done", category: "done" }
    ];

    const columns = await Column.insertMany(
      defaultColumnData.map((col, index) => ({
        name: col.name,
        category: col.category,
        boardId: board._id,
        order: index,
      })),
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      projectId: project._id.toString(),
      boardId: board._id.toString(),
      columnIds: columns.map((column) => column._id.toString()),
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}
