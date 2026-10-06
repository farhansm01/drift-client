import Link from "next/link";
import { getAllCars } from "@/lib/api/cars";
import CarCard from "@/components/CarCard";

export default async function FeaturedCars() {
  const cars = await getAllCars();
  const featured = cars.slice(0, 4);

  return (
    <section className="py-20 px-4 bg-[#e9e3e6] border-t border-[#b2b2b2]/40 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#9a8f97] font-bold block mb-1">
              Handpicked Deals
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#232c33]">
              Featured <span className="text-[#9a8f97]">Vehicles</span>
            </h2>
            <p className="text-[#232c33]/70 text-sm mt-1 font-medium">
              Standout verified listings ready for instant handover in Dhaka.
            </p>
          </div>
          <Link
            href="/cars"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-bold text-[#232c33] hover:text-[#9a8f97] transition"
          >
            View all listings &rarr;
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