"use client";

import { ChartNoAxesColumnIncreasing } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
  SignOutButton,
} from "@clerk/nextjs";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

const Navbar = () => {
  const { isSignedIn, isLoaded } = useUser();

  // Prevent flicker while loading auth state
  if (!isLoaded) return null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ChartNoAxesColumnIncreasing className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Rivot</span>
        </Link>

        {/* Nav links (signed in) */}
        {isSignedIn && (
          <div className="ml-6 hidden items-center gap-1 sm:flex">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          </div>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {isSignedIn ? (
            <>
              <UserButton />
              <SignOutButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign out
                </Button>
              </SignOutButton>
            </>
          ) : (
            <>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <Button size="sm">Sign in</Button>
              </SignInButton>

              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <Button variant="outline" size="sm">
                  Sign up
                </Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
