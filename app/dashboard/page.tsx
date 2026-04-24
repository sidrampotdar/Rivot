import syncClerkUserToDb from "@/lib/user";
import TasksCalender from "@/components/tasks-calender";
export default async function DashboardPage() {
  const user = await syncClerkUserToDb();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 py-10 text-center sm:px-6 lg:px-8">
      {user ? (
        <>
          <TasksCalender />
        </>
      ) : (
        <div className="text-lg text-slate-700">
          Please sign in to continue.
        </div>
      )}
    </main>
  );
}
