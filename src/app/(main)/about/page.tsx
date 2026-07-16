import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-20">
      <div className="text-center mb-16">
        <p className="text-xs uppercase tracking-widest text-accent-blue font-medium mb-3">
          About Drift
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold text-white leading-tight">
          Buy and sell cars,
          <br className="hidden md:block" /> directly.
        </h1>
        <p className="text-neutral-400 mt-4 max-w-lg mx-auto">
          No middleman, no commission, no waiting on approvals — just people
          in Dhaka connecting over real cars.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-widest text-accent-blue font-medium mb-3">
            The idea
          </p>
          <p className="text-neutral-300 leading-relaxed text-sm">
            Drift is a used car marketplace built for Dhaka. Sellers list
            their car in minutes; buyers browse real listings from real
            people — nothing sits behind an approval queue.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-widest text-accent-blue font-medium mb-3">
            The process
          </p>
          <p className="text-neutral-300 leading-relaxed text-sm">
            List with photos, pricing, and contact details. Buyers filter by
            category, price, or transmission, then reach out directly to
            arrange a viewing. Drift's job ends at the introduction.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-6">
          <p className="text-xs uppercase tracking-widest text-accent-blue font-medium mb-3">
            The reason
          </p>
          <p className="text-neutral-300 leading-relaxed text-sm">
            Buying or selling locally usually means cluttered classifieds or
            a cut paid to a middleman. Drift keeps it to two things: clean
            listings, and a straight line between buyer and seller.
          </p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-10 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">
          Ready to get started?
        </h2>
        <p className="text-neutral-400 text-sm mb-6">
          Browse what&apos;s available, or list your own car in minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/cars"
            className="metallic-button rounded-lg px-6 py-2.5 text-sm font-medium text-neutral-900 hover:opacity-90 transition"
          >
            Browse Cars
          </Link>
          <Link
            href="/cars/add"
            className="rounded-lg border border-neutral-700 px-6 py-2.5 text-sm text-neutral-200 hover:bg-neutral-800 transition"
          >
            List Your Car
          </Link>
        </div>
      </div>
    </div>
  );
}