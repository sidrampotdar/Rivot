import connectDB from "@/lib/db";
import { currentUser, auth } from "@clerk/nextjs/server";

export default async function Home() {
  await connectDB();

  // Get full user data
  const user = await currentUser();

  // Get only ID
  const { userId } = await auth();

  const email = user?.primaryEmailAddress?.emailAddress || "No email found";
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
        Welcome to Rivet
      </h1>
      <p className="mt-4 text-lg text-slate-700">{user?.firstName}</p>
      <div>Email: {email}</div>
    </main>
  );
}
