import Link from "next/link";
import type { Car } from "@/types/Car";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg overflow-hidden flex flex-col h-full">
      <div className="h-44 w-full overflow-hidden bg-neutral-800">
        {car.image ? (
          <img
            src={car.image}
            alt={car.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-neutral-600 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-white font-medium text-base line-clamp-1">{car.title}</h3>
        <p className="text-neutral-400 text-sm mt-1 line-clamp-2 flex-1">
          {car.shortDescription}
        </p>

        <div className="flex items-center justify-between text-xs text-neutral-500 mt-3">
          <span>{car.category}</span>
          <span>{car.transmission}</span>
          <span>{car.fuelType}</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-white font-semibold">৳{car.price.toLocaleString()}</span>
          <Link
            href={`/cars/${car._id}`}
            className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}