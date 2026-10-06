"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Magnifier } from "@gravity-ui/icons";

const CAR_SLIDES = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?fm=jpg&q=80&w=3000&auto=format&fit=crop",
    tagline: "Dhaka's Direct Car Marketplace",
    headline: "Drive further, worry less.",
    description: "Buy and sell used cars directly in Dhaka — zero middleman fees, 100% verified.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?fm=jpg&q=80&w=3000&auto=format&fit=crop",
    tagline: "Zero Dealer Commission",
    headline: "Keep 100% of your car's resale value.",
    description: "Connect directly with real local buyers and negotiate your best price.",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?fm=jpg&q=80&w=3000&auto=format&fit=crop",
    tagline: "100% Verified Ownership",
    headline: "Transparent details, zero guesswork.",
    description: "Browse cars with verified BRTA documents, clear specs, and direct seller chat.",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?fm=jpg&q=80&w=3000&auto=format&fit=crop",
    tagline: "Future of Clean Mobility",
    headline: "Explore Electric & Hybrid rides.",
    description: "Discover high-efficiency hybrid & electric vehicles ready for instant handover.",
  },
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAR_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = query.trim() ? `?search=${encodeURIComponent(query.trim())}` : "";
    router.push(`/cars${params}`);
  }

  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4 h-[76vh] min-h-[540px] overflow-hidden group">
      {/* Background Images */}
      {CAR_SLIDES.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out transform scale-105 ${
            index === currentSlide ? "opacity-100 z-0 scale-100" : "opacity-0 -z-10"
          }`}
          style={{
            backgroundImage: `url('${slide.image}')`,
            transitionProperty: "opacity, transform",
            transitionDuration: "1000ms",
          }}
        />
      ))}

      {/* Hero Overlay Gradient - Jet Black to Alabaster Theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#232c33]/90 via-[#232c33]/70 to-[#e9e3e6] z-1" />

      {/* Hero Main Content */}
      <div className="relative z-10 max-w-3xl mx-auto transition-all duration-500">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-[#e9e3e6] bg-[#232c33]/90 border border-[#9a8f97]/50 backdrop-blur-xl shadow-md mb-5">
          <span className="w-2 h-2 rounded-full bg-[#9a8f97]" />
          {CAR_SLIDES[currentSlide].tagline}
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight drop-shadow-md">
          {CAR_SLIDES[currentSlide].headline}
        </h1>

        <p className="text-base sm:text-lg text-[#e9e3e6]/90 mb-8 max-w-xl mx-auto font-medium leading-relaxed">
          {CAR_SLIDES[currentSlide].description}
        </p>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-lg mx-auto mb-8 bg-[#e9e3e6]/95 rounded-2xl p-2 shadow-xl border border-[#b2b2b2]"
        >
          <Magnifier width={20} height={20} className="text-[#232c33] ml-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by make, model..."
            className="flex-1 bg-transparent text-[#232c33] text-sm placeholder:text-[#9a8f97] focus:outline-none py-2.5 px-1 font-medium"
          />
          <button
            type="submit"
            className="btn-primary px-6 py-2.5 text-sm font-semibold cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        {/* Action Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <Link
            href="/cars/add"
            className="btn-primary w-full sm:w-auto px-6 py-3 text-sm font-bold shadow-lg text-center flex items-center justify-center gap-2"
          >
            List Your Car Free
          </Link>

          <Link
            href="/cars"
            className="btn-secondary w-full sm:w-auto px-6 py-3 text-sm font-semibold text-center flex items-center justify-center gap-2"
          >
            Browse All Vehicles
          </Link>
        </div>
      </div>

      {/* Clean Bottom Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#e9e3e6]/90 px-4 py-2.5 rounded-full border border-[#b2b2b2] shadow-md backdrop-blur-md">
        {CAR_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentSlide
                ? "w-8 h-2.5 bg-[#232c33]"
                : "w-2.5 h-2.5 bg-[#c3baba] border border-[#9a8f97] hover:bg-[#9a8f97]"
            }`}
          />
        ))}
      </div>
    </section>
  );
}