"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { getCarsByUser } from "@/lib/api/cars";
import type { Car } from "@/types/Car";
import { deleteCar, toggleCarSoldStatus } from "@/lib/actions/cars";
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

  async function handleToggleSold(carId: string) {
    if (!session?.user?.id) return;

    const res = await toggleCarSoldStatus(carId, session.user.id);
    if (!res.success) {
      alert(res.error || "Failed to update sold status.");
      return;
    }

    setCars((prev) =>
      prev.map((c) =>
        c._id?.toString() === carId
          ? { ...c, isSold: res.isSold, status: res.isSold ? "sold" : "available" }
          : c
      )
    );
  }

  if (sessionPending || loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 bg-[#e9e3e6]">
        <h1 className="text-3xl font-black text-[#232c33] mb-6">My Listings</h1>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl border border-[#b2b2b2] bg-white/70 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 bg-[#e9e3e6]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#232c33] tracking-tight">My Listings</h1>
          <p className="text-[#9a8f97] text-sm mt-1 font-semibold">Manage, update, and toggle sold status for your car listings on Drift.</p>
        </div>
        <Link
          href="/cars/add"
          className="btn-primary rounded-xl px-5 py-2.5 text-xs font-bold shadow-md"
        >
          List a Car
        </Link>
      </div>

      {cars.length === 0 ? (
        <div className="rounded-2xl border border-[#b2b2b2] bg-white p-12 text-center shadow-md">
          <p className="text-[#232c33] font-bold text-base">You haven&apos;t listed any cars yet.</p>
          <Link
            href="/cars/add"
            className="mt-3 inline-block text-xs text-[#232c33] font-bold underline hover:text-[#9a8f97]"
          >
            List your first car free
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#b2b2b2] bg-white shadow-md overflow-hidden">
          {/* Desktop table */}
          <table className="w-full hidden md:table">
            <thead>
              <tr className="border-b border-[#c3baba] bg-[#e9e3e6]/60 text-left text-xs uppercase tracking-wider font-extrabold text-[#232c33]">
                <th className="px-5 py-3.5">Car</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Price</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3baba]/50">
              {cars.map((car) => {
                const isSold = Boolean(car.isSold || car.status === "sold");
                return (
                  <tr key={car._id?.toString()} className="hover:bg-[#e9e3e6]/30 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {car.image ? (
                          <img
                            src={car.image}
                            alt={car.title}
                            className={`h-12 w-16 rounded-lg object-cover border border-[#c3baba] ${isSold ? "grayscale" : ""}`}
                          />
                        ) : (
                          <div className="h-12 w-16 rounded-lg bg-[#c3baba]/40" />
                        )}
                        <div>
                          <span className="text-[#232c33] text-sm font-bold block">{car.title}</span>
                          <span className="text-xs text-[#9a8f97]">{car.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleSold(car._id!.toString())}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer transition shadow-sm ${
                          isSold
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {isSold ? "SOLD OUT" : "AVAILABLE"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-[#9a8f97]">{car.category}</td>
                    <td className="px-5 py-4 text-xs font-bold text-[#232c33]">৳{car.price.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/cars/${car._id}`}
                          className="btn-secondary rounded-lg px-3 py-1.5 text-xs font-semibold"
                        >
                          View
                        </Link>
                        <Link
                          href={`/cars/${car._id}/edit`}
                          className="rounded-lg border border-[#b2b2b2] bg-[#e9e3e6] px-3 py-1.5 text-xs font-bold text-[#232c33] hover:bg-[#b2b2b2]/40 transition"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => requestDelete(car._id!.toString())}
                          className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-[#c3baba]">
            {cars.map((car) => {
              const isSold = Boolean(car.isSold || car.status === "sold");
              return (
                <div key={car._id?.toString()} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSold(car._id!.toString())}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                        isSold ? "bg-red-600 text-white" : "bg-emerald-600 text-white"
                      }`}
                    >
                      {isSold ? "SOLD OUT" : "AVAILABLE"}
                    </button>
                    <span className="text-xs font-bold text-[#232c33]">৳{car.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.title}
                        className={`h-14 w-20 rounded-lg object-cover border border-[#c3baba] ${isSold ? "grayscale" : ""}`}
                      />
                    ) : (
                      <div className="h-14 w-20 rounded-lg bg-[#c3baba]" />
                    )}
                    <div>
                      <p className="text-[#232c33] text-sm font-bold">{car.title}</p>
                      <p className="text-[#9a8f97] text-xs font-semibold">
                        {car.category} · {car.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/cars/${car._id}`}
                      className="flex-1 text-center btn-secondary rounded-lg px-2 py-2 text-xs font-bold"
                    >
                      View
                    </Link>
                    <Link
                      href={`/cars/${car._id}/edit`}
                      className="flex-1 text-center rounded-lg border border-[#b2b2b2] bg-[#e9e3e6] px-2 py-2 text-xs font-bold text-[#232c33]"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => requestDelete(car._id!.toString())}
                      className="flex-1 rounded-lg border border-red-300 bg-red-50 px-2 py-2 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white transition cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
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