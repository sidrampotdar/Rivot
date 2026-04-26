import Link from "next/link";
import { Button } from "@/components/ui/button";
import Footer from "@/components/footer";
import {
  ArrowRight,
  LayoutDashboard,
  Users,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-white to-sky-50/50 dark:from-sky-950/20 dark:via-background dark:to-sky-950/10" />
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-sky-100/40 blur-3xl dark:bg-sky-900/10" />
        <div className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-800/10" />

        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-28 lg:px-10">
          <div className="animate-fade-in space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-300">
              <Zap className="h-3.5 w-3.5" />
              Project Management Reimagined
            </div>

            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Plan work, ship faster, keep your team{" "}
              <span className="text-primary">aligned.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-8 text-muted-foreground">
              Rivot gives product teams a clean workspace for roadmaps, tasks,
              and collaboration—all in one place. No clutter, no confusion.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard">
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard">View demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="animate-slide-up mb-14 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Everything you need, nothing you don't
            </h2>
            <p className="mt-3 text-muted-foreground">
              Built for clarity. Designed for execution.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: LayoutDashboard,
                title: "Kanban boards",
                desc: "Drag-and-drop tasks across columns. See your sprint at a glance.",
              },
              {
                icon: Users,
                title: "Team workspaces",
                desc: "Invite teammates, assign tasks, and collaborate without friction.",
              },
              {
                icon: Zap,
                title: "Speed up execution",
                desc: "Move from idea to done with fewer tools and less context switching.",
              },
              {
                icon: CheckCircle2,
                title: "Task management",
                desc: "Create, prioritize, and track tasks with due dates and comments.",
              },
              {
                icon: LayoutDashboard,
                title: "Activity tracking",
                desc: "See who did what and when, with a full audit trail on every task.",
              },
              {
                icon: Users,
                title: "Role-based access",
                desc: "Workspace owners manage members. Everyone else just ships.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Sprint Preview */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Real-time sprint visibility
              </h2>
              <p className="text-muted-foreground leading-7">
                Keep your plans, tasks, and team updates easy to scan. Rivot
                shows you exactly where your sprint stands—no spreadsheets
                required.
              </p>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/dashboard">
                  Try it now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="rounded-xl bg-muted/50 p-6">
                <div className="flex items-center justify-between text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  <span>Live sprint</span>
                  <span className="text-primary">4 updates</span>
                </div>
                <div className="mt-6 space-y-5">
                  <div>
                    <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      <span>Team progress</span>
                      <span className="text-foreground">72%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full w-[72%] rounded-full bg-primary transition-all duration-1000" />
                    </div>
                  </div>

                  <div className="space-y-3 border-t border-border pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-card-foreground">
                        Design review
                      </span>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                        On track
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-card-foreground">Release prep</span>
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                        In review
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-card-foreground">API update</span>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-400">
                        In progress
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
