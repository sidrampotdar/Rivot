import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white">
      {" "}
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">Rivet</h2>
            <p className="text-sm leading-6 text-slate-600">
              A simpler way to manage projects, collaborate with your team, and
              ship faster—without the chaos.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Product
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <Link href="/dashboard" className="hover:text-slate-900">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-900">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-slate-900">
                  Boards
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Resources
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Company
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <Link href="#" className="hover:text-slate-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-slate-900">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 pt-6 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Rivet. All rights reserved.</p>
          <p className="text-slate-400">
            Built for clarity. Designed for execution.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
