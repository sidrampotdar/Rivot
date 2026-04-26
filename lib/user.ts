import { currentUser } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/user";

export default async function syncClerkUserToDb() {
  await connectDB();

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ||
    clerkUser.emailAddresses?.[0]?.emailAddress ||
    "";
  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.fullName ||
    "Clerk User";

  const user = await User.findOneAndUpdate(
    { clerkId: clerkUser.id },
    {
      clerkId: clerkUser.id,
      name,
      email,
      avatar: clerkUser.imageUrl || null,
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    },
  );
  const safeUser = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    role: user.role || null,
  };

  return safeUser;
}
