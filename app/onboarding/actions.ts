"use server";

import connectDB from "@/lib/db";
import User from "@/models/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function setUserRole(role: "admin" | "employee") {
  await connectDB();
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  await User.findOneAndUpdate(
    { clerkId: clerkUser.id },
    { role },
    { new: true }
  );

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
