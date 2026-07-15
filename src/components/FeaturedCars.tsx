import Link from "next/link";
import { getAllCars } from "@/lib/api/cars";
import CarCard from "@/components/CarCard";

export default async function FeaturedCars() {
  const cars = await getAllCars();
  const featured = cars.slice(0, 4); // show first 4 as "featured"

  return (
    <section className="py-20 px-4 bg-neutral-900/40">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-white mb-2">
              Featured Cars
            </h2>
            <p className="text-neutral-400">
              A few standout listings currently available.
            </p>
          </div>
          <Link
            href="/cars"
            className="hidden sm:block text-sm text-neutral-300 hover:text-white transition"
          >
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((car) => (
            <CarCard key={car._id?.toString()} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}