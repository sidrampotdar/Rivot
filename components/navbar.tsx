import React from "react";
import { ChartNoAxesColumnIncreasing } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <ChartNoAxesColumnIncreasing />
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span>Rivet</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
