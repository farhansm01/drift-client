import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 h-[65vh] bg-neutral-950 overflow-hidden">
      {/* subtle gradient glow backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 via-neutral-950 to-neutral-950" />

      <div className="relative z-10 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
          Drift
        </h1>
        <p className="text-lg md:text-xl text-neutral-300 mb-8">
          Drive further, worry less. Buy and sell used cars directly —
          no middleman, no hidden fees.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cars"
            className="rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-400 px-6 py-3 text-sm font-medium text-neutral-900 hover:opacity-90 transition"
          >
            Explore Cars
          </Link>
          <Link
            href="/cars/add"
            className="rounded-lg border border-neutral-700 px-6 py-3 text-sm text-neutral-200 hover:bg-neutral-800 transition"
          >
            List Your Car
          </Link>
        </div>
      </div>
    </section>
  );
}