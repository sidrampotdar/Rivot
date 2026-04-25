"use server";

import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Project, Board, Column } from "@/models";

const defaultColumns = ["To Do", "In Progress", "Done"];

export async function createProject(data: {
  name: string;
  description: string;
  userId: string;
  workspaceId: string;
}) {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userObjectId = new mongoose.Types.ObjectId(data.userId);
    const workspaceObjectId = new mongoose.Types.ObjectId(data.workspaceId);

    // ✅ 1. Create Project
    const [project] = await Project.create(
      [
        {
          name: data.name,
          description: data.description,
          ownerId: userObjectId,
          createdBy: userObjectId, // 🔥 FIX
          workspaceId: workspaceObjectId,
        },
      ],
      { session },
    );

    // ✅ 2. Create Board
    const [board] = await Board.create(
      [
        {
          name: "Main Board",
          project: project._id,
        },
      ],
      { session },
    );

    // ✅ 3. Create Columns
    const columns = await Column.insertMany(
      defaultColumns.map((col, index) => ({
        name: col,
        board: board._id,
        order: index,
      })),
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return { project, board, columns };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
}
