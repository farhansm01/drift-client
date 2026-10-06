import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center mb-16">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#232c33] text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
          About Drift
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#232c33] leading-tight tracking-tight">
          Buy and sell cars,
          <br className="hidden md:block" /> directly in Dhaka.
        </h1>
        <p className="text-[#9a8f97] mt-4 text-base md:text-lg max-w-xl mx-auto font-medium">
          No middleman, no heavy commissions, no waiting on queues — connecting automotive enthusiasts over authentic vehicle listings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="rounded-2xl border border-[#b2b2b2] bg-white p-8 shadow-xl hover:shadow-2xl transition duration-300">
          <div className="w-10 h-10 rounded-xl bg-[#e9e3e6] flex items-center justify-center text-[#232c33] font-bold text-lg mb-4">
            01
          </div>
          <h3 className="text-xl font-bold text-[#232c33] mb-2">The Idea</h3>
          <p className="text-[#9a8f97] leading-relaxed text-sm">
            Drift is a modern used-car platform engineered specifically for Dhaka. Sellers publish listings in minutes; buyers explore authentic specs directly from genuine vehicle owners.
          </p>
        </div>

        <div className="rounded-2xl border border-[#b2b2b2] bg-white p-8 shadow-xl hover:shadow-2xl transition duration-300">
          <div className="w-10 h-10 rounded-xl bg-[#e9e3e6] flex items-center justify-center text-[#232c33] font-bold text-lg mb-4">
            02
          </div>
          <h3 className="text-xl font-bold text-[#232c33] mb-2">The Process</h3>
          <p className="text-[#9a8f97] leading-relaxed text-sm">
            List with high-res photos, pricing, and direct contact info. Filter by category, transmission, or fuel type, then contact sellers directly to arrange viewing.
          </p>
        </div>

        <div className="rounded-2xl border border-[#b2b2b2] bg-white p-8 shadow-xl hover:shadow-2xl transition duration-300">
          <div className="w-10 h-10 rounded-xl bg-[#e9e3e6] flex items-center justify-center text-[#232c33] font-bold text-lg mb-4">
            03
          </div>
          <h3 className="text-xl font-bold text-[#232c33] mb-2">The Reason</h3>
          <p className="text-[#9a8f97] leading-relaxed text-sm">
            Traditional local listings are cluttered with spam and hidden fees. Drift provides clean, beautiful listings with a direct line between buyer and seller.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#b2b2b2] bg-white p-10 md:p-12 text-center shadow-xl">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#232c33] mb-3">
          Ready to get started?
        </h2>
        <p className="text-[#9a8f97] text-base mb-8 max-w-md mx-auto font-medium">
          Explore what&apos;s available on our marketplace, or list your own car today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/cars"
            className="btn-primary rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-md hover:shadow-lg transition"
          >
            Browse Cars
          </Link>
          <Link
            href="/cars/add"
            className="btn-secondary rounded-xl border border-[#b2b2b2] bg-[#e9e3e6] px-8 py-3.5 text-sm font-bold text-[#232c33] hover:bg-[#b2b2b2]/40 transition shadow-sm"
          >
            List Your Car
          </Link>
        </div>
      </div>
    </div>
  );
}