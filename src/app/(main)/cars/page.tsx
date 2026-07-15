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
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Explore Cars</h1>
        <p className="text-neutral-400 text-sm mt-1">
          Browse cars listed by sellers across Dhaka.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by car title..."
          className="flex-1 rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CarCategory | "")}
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={transmission}
          onChange={(e) => setTransmission(e.target.value as Transmission | "")}
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
        >
          <option value="">All transmissions</option>
          {TRANSMISSIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
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
              className="h-72 rounded-2xl border border-neutral-800 bg-neutral-900/40 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10 text-center">
          <p className="text-neutral-400">No cars match your search/filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedCars.map((car) => (
              <CarCard key={car._id?.toString()} car={car} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 rounded-lg text-sm transition ${
                      currentPage === page
                        ? "bg-neutral-200 text-neutral-900"
                        : "border border-neutral-700 text-neutral-200 hover:bg-neutral-800"
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
                className="rounded-lg border border-neutral-700 px-3 py-1.5 text-sm text-neutral-200 hover:bg-neutral-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
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