import syncClerkUserToDb from "@/lib/user";

export default async function DashboardPage() {
  const user = await syncClerkUserToDb();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 lg:px-8">
      {user ? (
        <>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Welcome back, {user.name}
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            Your Clerk ID is {user.clerkId}
          </p>
        </>
      ) : (
        <div className="text-lg text-slate-700">
          Please sign in to continue.
        </div>
      )}
    </main>
  );
}
