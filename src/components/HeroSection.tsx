"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Magnifier } from "@gravity-ui/icons";

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : "";
    router.push(`/cars${params}`);
  }

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-4 h-[68vh] overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyJTIwYmFja2dyb3VuZHxlbnwwfHwwfHx8MA%3D%3D')",
      }}
    >
      <div className="absolute inset-0 bg-neutral-950/80" />
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/40 via-transparent to-neutral-950" />

      <div className="relative z-10 max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-accent-blue font-medium mb-4">
          Dhaka&apos;s direct car marketplace
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4 leading-tight">
          Drive further,
          <br /> worry less.
        </h1>
        <p className="text-lg text-neutral-300 mb-8 max-w-md mx-auto">
          Buy and sell used cars directly — no middleman, no hidden fees.
        </p>

        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-md mx-auto mb-6 glass-panel rounded-xl p-1.5"
        >
          <Magnifier width={18} height={18} className="text-neutral-500 ml-2 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by make, model..."
            className="flex-1 bg-transparent text-white text-sm placeholder:text-neutral-500 focus:outline-none py-2"
          />
          <button
            type="submit"
            className="metallic-button rounded-lg px-4 py-2 text-sm font-medium text-neutral-900 hover:opacity-90 transition shrink-0"
          >
            Search
          </button>
        </form>

        <Link
          href="/cars/add"
          className="text-sm text-neutral-400 hover:text-white transition underline underline-offset-4"
        >
          Or list your own car →
        </Link>
      </div>
    </section>
  );
}