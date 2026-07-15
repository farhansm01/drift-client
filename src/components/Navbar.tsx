"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bars, Xmark, Car } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoggedIn = !isPending && !!session;

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  const loggedOutLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Explore" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const loggedInLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Explore" },
    { href: "/cars/add", label: "List a Car" },
    { href: "/cars/manage", label: "My Listings" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const links = isLoggedIn ? loggedInLinks : loggedOutLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/70 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg">
          <Car width={22} height={22} />
          Drift
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-300 hover:text-white transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isPending ? null : isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="rounded-lg border border-neutral-700 px-4 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800 transition"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-neutral-700 px-4 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-400 px-4 py-1.5 text-sm font-medium text-neutral-900 hover:opacity-90 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden text-neutral-200"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <Xmark width={24} height={24} /> : <Bars width={24} height={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950/95 px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-neutral-300 hover:text-white transition"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-neutral-800 flex flex-col gap-2">
            {isPending ? null : isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-800 transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-400 px-4 py-2 text-sm font-medium text-neutral-900 hover:opacity-90 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}