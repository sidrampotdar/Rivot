"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { setUserRole } from "./actions";
import { Briefcase, User as UserIcon, Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState<"admin" | "employee" | null>(null);

  const handleRoleSelection = async (role: "admin" | "employee") => {
    setLoading(role);
    try {
      await setUserRole(role);
    } catch (error) {
      console.error("Failed to set role", error);
      setLoading(null);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-4xl items-center justify-center px-4 py-10">
      <div className="animate-fade-in w-full max-w-2xl space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Welcome to Rivot
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            How will you be using Rivot? We'll tailor your experience accordingly.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Admin Role */}
          <button
            onClick={() => handleRoleSelection("admin")}
            disabled={loading !== null}
            className={`group relative flex flex-col items-center gap-4 rounded-2xl border p-8 text-center transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
              loading === "admin" ? "border-primary bg-primary/5" : "border-border bg-card"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              {loading === "admin" ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <Briefcase className="h-8 w-8" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                I'm a Manager
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                I want to create projects, manage workspaces, and invite my team members.
              </p>
            </div>
          </button>

          {/* Employee Role */}
          <button
            onClick={() => handleRoleSelection("employee")}
            disabled={loading !== null}
            className={`group relative flex flex-col items-center gap-4 rounded-2xl border p-8 text-center transition-all duration-200 hover:border-primary/50 hover:shadow-md ${
              loading === "employee" ? "border-primary bg-primary/5" : "border-border bg-card"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
              {loading === "employee" ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <UserIcon className="h-8 w-8" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">
                I'm an Employee
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                I want to view my assigned tasks and collaborate on existing projects.
              </p>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
