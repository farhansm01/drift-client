"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bars, Xmark, Car } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { useUserRole } from "@/hooks/useUserRole";

export default function Navbar() {
  const router = useRouter();
  const { session, isLoggedIn, isAdmin, isPending } = useUserRole();
  const [mobileOpen, setMobileOpen] = useState(false);

  const firstName = session?.user?.name?.split(" ")[0];

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

  const adminLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Explore" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/admin/dashboard", label: "Dashboard" },
  ];

  const userLinks = [
    { href: "/", label: "Home" },
    { href: "/cars", label: "Explore" },
    { href: "/cars/add", label: "List a Car" },
    { href: "/cars/manage", label: "My Listings" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const sessionRole = (session?.user as { role?: string })?.role;
  const isUserAdmin = isAdmin || sessionRole === "admin";
  const links = isLoggedIn ? (isUserAdmin ? adminLinks : userLinks) : loggedOutLinks;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#c3baba] bg-[#e9e3e6]/90 backdrop-blur-xl shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 md:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-[#232c33] font-black text-xl tracking-tight group">
          <div className="p-2 rounded-xl bg-[#232c33] text-white transition shadow-md">
            <Car width={22} height={22} />
          </div>
          <span className="font-black tracking-widest text-2xl text-[#232c33]">
            DRIFT
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[#232c33]/80 hover:text-[#9a8f97] transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isPending ? null : isLoggedIn ? (
            <>
              <span className="text-sm text-[#232c33]/80">
                Welcome, <span className="text-[#232c33] font-bold">{firstName}</span>
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary px-4 py-1.5 text-sm cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="btn-secondary px-4.5 py-2 text-sm font-semibold"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary px-5 py-2 text-sm font-bold shadow-md"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden text-[#232c33] p-2 rounded-xl bg-[#c3baba]/50 border border-[#9a8f97]/40"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <Xmark width={22} height={22} /> : <Bars width={22} height={22} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#c3baba] bg-[#e9e3e6]/95 px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-semibold text-[#232c33]/80 hover:text-[#9a8f97] transition py-1"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-[#c3baba] flex flex-col gap-2.5">
            {isPending ? null : isLoggedIn ? (
              <>
                <p className="text-sm text-[#232c33]/80 px-1">
                  Welcome, <span className="text-[#232c33] font-bold">{firstName}</span>
                </p>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="btn-secondary w-full text-center px-4 py-2 text-sm font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary w-full text-center px-4 py-2 text-sm font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full text-center px-4 py-2 text-sm font-bold shadow-md"
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