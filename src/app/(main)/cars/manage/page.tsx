"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getCarsByUser } from "@/lib/api/cars";
import type { Car } from "@/types/Car";
import { deleteCar } from "@/lib/actions/cars";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ManageCarsPage() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    async function loadCars() {
      if (!session?.user?.id) return;

      setLoading(true);
      const data = await getCarsByUser(session.user.id);
      setCars(data);
      setLoading(false);
    }

    if (!sessionPending) {
      loadCars();
    }
  }, [session?.user?.id, sessionPending]);

  function requestDelete(carId: string) {
    setPendingDeleteId(carId);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    if (!pendingDeleteId) return;

    const result = await deleteCar(pendingDeleteId, session?.user?.id ?? "");

    setConfirmOpen(false);

    if (!result.success) {
      alert(result.error || "Something went wrong.");
      setPendingDeleteId(null);
      return;
    }

    setCars((prev) => prev.filter((car) => car._id?.toString() !== pendingDeleteId));
    setPendingDeleteId(null);
  }

  if (sessionPending || loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="text-2xl font-semibold text-white mb-6">My Listings</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-lg border border-neutral-800 bg-neutral-900/40 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">My Listings</h1>
        <Link
          href="/cars/add"
          className="metallic-button rounded-lg px-4 py-2 text-sm font-medium text-neutral-900 hover:opacity-90 transition"
        >
          List a Car
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10 text-center">
          <p className="text-neutral-400">You haven&apos;t listed any cars yet.</p>
          <Link
            href="/cars/add"
            className="mt-3 inline-block text-sm text-neutral-200 underline"
          >
            List your first car
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg overflow-hidden">
          {/* Desktop table */}
          <table className="w-full hidden md:table">
            <thead>
              <tr className="border-b border-neutral-800 text-left text-sm text-neutral-400">
                <th className="px-4 py-3 font-medium">Car</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car._id?.toString()} className="border-b border-neutral-800 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {car.image ? (
                        <img
                          src={car.image}
                          alt={car.title}
                          className="h-12 w-16 rounded-md object-cover"
                        />
                      ) : (
                        <div className="h-12 w-16 rounded-md bg-neutral-800" />
                      )}
                      <span className="text-white text-sm">{car.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-neutral-400">{car.category}</td>
                  <td className="px-4 py-3 text-sm text-neutral-400">৳{car.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-neutral-400">{car.location}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/cars/${car._id}`}
                        className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800 transition"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => requestDelete(car._id!.toString())}
                        className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-neutral-800">
            {cars.map((car) => (
              <div key={car._id?.toString()} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  {car.image ? (
                    <img
                      src={car.image}
                      alt={car.title}
                      className="h-14 w-20 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-14 w-20 rounded-md bg-neutral-800" />
                  )}
                  <div>
                    <p className="text-white text-sm font-medium">{car.title}</p>
                    <p className="text-neutral-400 text-xs">
                      {car.category} · ৳{car.price.toLocaleString()} · {car.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/cars/${car._id}`}
                    className="flex-1 text-center rounded-lg border border-neutral-700 px-3 py-2 text-xs text-neutral-200 hover:bg-neutral-800 transition"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    onClick={() => requestDelete(car._id!.toString())}
                    className="flex-1 rounded-lg border border-red-500/30 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this listing?"
        message="This action cannot be undone. The listing will be permanently removed."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}