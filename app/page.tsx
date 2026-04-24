import connectDB from "@/lib/db";

export default async function Home() {
  await connectDB();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
        Welcome to Rivet
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
        Sign in or sign up using the navbar to access your project workspace.
      </p>
    </main>
  );
}
