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

const Navbar = () => {
  const { isSignedIn, isLoaded } = useUser();

  // Prevent flicker while loading auth state
  if (!isLoaded) return null;

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-sm">
      {" "}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <ChartNoAxesColumnIncreasing />
          <span>Rivet</span>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          {isSignedIn ? (
            <>
              <UserButton />
              <SignOutButton>
                <Button variant="outline" size="sm">
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
                <Button variant="secondary" size="sm">
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
