import Link from "next/link";
import type { Car } from "@/types/Car";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const isSold = Boolean(car.isSold || car.status === "sold");

  return (
    <div className={`rounded-2xl border border-[#b2b2b2] bg-white/90 backdrop-blur-xl overflow-hidden flex flex-col h-full hover:border-[#232c33] hover:shadow-xl transition duration-300 group ${isSold ? "opacity-90" : ""}`}>
      <div className="h-48 w-full overflow-hidden bg-[#c3baba]/30 relative">
        {car.image ? (
          <img
            src={car.image}
            alt={car.title}
            className={`h-full w-full object-cover group-hover:scale-105 transition duration-500 ${isSold ? "grayscale-[40%]" : ""}`}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[#9a8f97] text-xs font-semibold">
            No image available
          </div>
        )}

        {isSold && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white shadow-lg border border-red-500">
            SOLD OUT
          </div>
        )}

        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#232c33] text-white backdrop-blur-md shadow-md">
          {car.category}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 bg-white/80">
        <h3 className="text-[#232c33] font-bold text-base line-clamp-1 group-hover:text-[#9a8f97] transition">
          {car.title}
        </h3>
        <p className="text-[#9a8f97] text-xs mt-1.5 line-clamp-2 flex-1 leading-relaxed font-medium">
          {car.shortDescription}
        </p>

        <div className="flex items-center justify-between text-[11px] text-[#232c33] mt-4 py-2 border-y border-[#c3baba]/60">
          <span className="font-semibold px-2.5 py-0.5 rounded-md bg-[#e9e3e6] border border-[#b2b2b2]/50">{car.transmission}</span>
          <span className="font-semibold px-2.5 py-0.5 rounded-md bg-[#e9e3e6] border border-[#b2b2b2]/50">{car.fuelType}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-[#c3baba]/60 flex flex-col gap-3">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="text-[10px] text-[#9a8f97] uppercase tracking-wider block font-bold">Price</span>
              <span className={`text-lg font-black tracking-tight ${isSold ? "text-neutral-500 line-through text-sm" : "text-[#232c33]"}`}>
                ৳{car.price.toLocaleString()}
              </span>
            </div>
            {isSold && (
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-600 border border-red-200 uppercase">
                SOLD OUT
              </span>
            )}
          </div>

          <Link
            href={`/cars/${car._id}`}
            className="btn-primary w-full text-center rounded-xl py-2.5 text-xs font-bold text-white shadow-md transition hover:shadow-lg"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}