// src/app/(main)/cars/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { getAllCars } from "@/lib/api/cars";
import CarCard from "@/components/CarCard";
import type { Car, CarCategory, Transmission } from "@/types/Car";

const CATEGORIES: CarCategory[] = ["Sedan", "SUV", "Hatchback", "Luxury", "Van"];
const TRANSMISSIONS: Transmission[] = ["Automatic", "Manual"];
const CARS_PER_PAGE = 8;

type SortOption = "newest" | "price-low" | "price-high";

export default function ExploreCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CarCategory | "">("");
  const [transmission, setTransmission] = useState<Transmission | "">("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadCars() {
      setLoading(true);
      const data = await getAllCars();
      setCars(data);
      setLoading(false);
    }

    loadCars();
  }, []);

  const filteredCars = useMemo(() => {
    let result = [...cars];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      result = result.filter((car) => car.title.toLowerCase().includes(query));
    }

    if (category) {
      result = result.filter((car) => car.category === category);
    }

    if (transmission) {
      result = result.filter((car) => car.transmission === transmission);
    }

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [cars, search, category, transmission, sort]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, transmission, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredCars.length / CARS_PER_PAGE));
  const paginatedCars = filteredCars.slice(
    (currentPage - 1) * CARS_PER_PAGE,
    currentPage * CARS_PER_PAGE
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 bg-[#e9e3e6]">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-[#232c33] tracking-tight">
          Explore Vehicles
        </h1>
        <p className="text-[#9a8f97] text-sm sm:text-base mt-1 font-semibold">
          Browse verified cars listed by direct owners across Dhaka.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by car title..."
          className="flex-1 rounded-xl bg-white border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] text-sm placeholder:text-[#9a8f97] font-medium focus:outline-none focus:border-[#232c33] focus:ring-2 focus:ring-[#232c33]/20 shadow-sm transition"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CarCategory | "")}
          className="rounded-xl bg-white border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] text-sm font-semibold focus:outline-none focus:border-[#232c33] shadow-sm cursor-pointer"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={transmission}
          onChange={(e) => setTransmission(e.target.value as Transmission | "")}
          className="rounded-xl bg-white border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] text-sm font-semibold focus:outline-none focus:border-[#232c33] shadow-sm cursor-pointer"
        >
          <option value="">All transmissions</option>
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-xl bg-white border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] text-sm font-semibold focus:outline-none focus:border-[#232c33] shadow-sm cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-72 rounded-2xl border border-[#b2b2b2] bg-white/70 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="rounded-2xl border border-[#b2b2b2] bg-white p-12 text-center shadow-sm">
          <p className="text-[#232c33] font-bold text-base">No cars match your search criteria.</p>
          <p className="text-[#9a8f97] text-xs mt-1">Try clearing filters or changing search keywords.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedCars.map((car) => (
              <CarCard key={car._id?.toString()} car={car} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="btn-secondary px-4 py-2 text-xs font-bold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                const isActive = currentPage === page;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer ${
                      isActive
                        ? "bg-[#232c33] text-white border border-[#232c33]"
                        : "bg-white text-[#232c33] border border-[#b2b2b2] hover:bg-[#e9e3e6]"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="btn-secondary px-4 py-2 text-xs font-bold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}