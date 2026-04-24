import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
export default function Home() {
  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/95 shadow-[0_30px_60px_-30px_rgba(15,23,42,0.4)]">
        <div className="grid gap-12 px-6 py-10 md:grid-cols-[1.25fr_0.9fr] md:px-10 md:py-14">
          <div className="space-y-8">
            <div className="inline-flex rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.24em] text-slate-600">
              Project management reimagined
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Discover a simpler way to plan work, ship faster, and keep your
                team aligned.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600">
                Rivet gives product teams a clean workspace for roadmaps, tasks,
                and collaboration—all in one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild>
                <Link href="/dashboard">Start free</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">View demo</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-700 shadow-sm">
                <p className="font-semibold text-slate-950">
                  Built for clarity
                </p>
                <p className="mt-2 text-slate-600">
                  Keep your plans, tasks, and team updates easy to scan.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5 text-sm leading-6 text-slate-700 shadow-sm">
                <p className="font-semibold text-slate-950">
                  Speed up execution
                </p>
                <p className="mt-2 text-slate-600">
                  Move from idea to done with fewer tools and less context
                  switching.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-xl sm:p-8">
            <div className="rounded-[1.75rem] border border-slate-800 bg-slate-900/95 p-6 sm:p-8">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.24em] text-slate-500">
                <span>Live sprint</span>
                <span>4 updates</span>
              </div>
              <div className="mt-6 space-y-5">
                <div>
                  <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                    <span>Team progress</span>
                    <span>72%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-[72%] rounded-full bg-cyan-400" />
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-800 pt-5">
                  <div className="flex items-center justify-between text-sm text-slate-100">
                    <span>Design review</span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
                      On track
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-100">
                    <span>Release prep</span>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
                      In review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        {" "}
        <Footer />
      </section>
    </main>
  );
}
