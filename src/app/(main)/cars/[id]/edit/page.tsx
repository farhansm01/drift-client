"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { getCarById } from "@/lib/api/cars";
import { updateCar, toggleCarSoldStatus } from "@/lib/actions/cars";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import type { CarCategory, Transmission, FuelType, Car } from "@/types/Car";

interface FormState {
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  category: CarCategory | "";
  seats: string;
  transmission: Transmission | "";
  fuelType: FuelType | "";
  location: string;
  contactInfo: string;
  image: string;
  isSold: boolean;
}

interface FieldErrors {
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  price?: string;
  category?: string;
  seats?: string;
  transmission?: string;
  fuelType?: string;
  location?: string;
  contactInfo?: string;
  general?: string;
}

const CATEGORIES: CarCategory[] = ["Sedan", "SUV", "Hatchback", "Luxury", "Van"];
const TRANSMISSIONS: Transmission[] = ["Automatic", "Manual"];
const FUEL_TYPES: FuelType[] = ["Petrol", "Diesel", "Electric", "Hybrid"];

export default function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const [loadingCar, setLoadingCar] = useState(true);
  const [car, setCar] = useState<Car | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    category: "",
    seats: "",
    transmission: "",
    fuelType: "",
    location: "",
    contactInfo: "",
    image: "",
    isSold: false,
  });
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getCarById(id);
      if (!data) {
        setErrors({ general: "Car listing not found." });
        setLoadingCar(false);
        return;
      }

      setCar(data);
      setForm({
        title: data.title || "",
        shortDescription: data.shortDescription || "",
        fullDescription: data.fullDescription || "",
        price: data.price ? String(data.price) : "",
        category: data.category || "",
        seats: data.seats ? String(data.seats) : "",
        transmission: data.transmission || "",
        fuelType: data.fuelType || "",
        location: data.location || "",
        contactInfo: data.contactInfo || "",
        image: data.image || "",
        isSold: Boolean(data.isSold || data.status === "sold"),
      });
      setExtraImages(data.images || []);
      setLoadingCar(false);
    }
    load();
  }, [id]);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): FieldErrors {
    const newErrors: FieldErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required.";
    if (!form.shortDescription.trim()) newErrors.shortDescription = "Short description is required.";
    if (!form.fullDescription.trim()) newErrors.fullDescription = "Full description is required.";

    const priceNum = Number(form.price);
    if (!form.price.trim() || Number.isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Enter a valid price greater than 0.";
    }

    if (!form.category) newErrors.category = "Select a category.";

    const seatsNum = Number(form.seats);
    if (!form.seats.trim() || Number.isNaN(seatsNum) || seatsNum < 1 || seatsNum > 20) {
      newErrors.seats = "Enter a valid seat count (1–20).";
    }

    if (!form.transmission) newErrors.transmission = "Select a transmission type.";
    if (!form.fuelType) newErrors.fuelType = "Select a fuel type.";
    if (!form.location.trim()) newErrors.location = "Location is required.";
    if (!form.contactInfo.trim()) newErrors.contactInfo = "Contact info is required.";

    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!session?.user?.id) {
      setErrors({ general: "You must be logged in." });
      return;
    }

    setErrors({});
    setSaving(true);

    const result = await updateCar(
      id,
      {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        price: Number(form.price),
        category: form.category as CarCategory,
        seats: Number(form.seats),
        transmission: form.transmission as Transmission,
        fuelType: form.fuelType as FuelType,
        location: form.location.trim(),
        contactInfo: form.contactInfo.trim(),
        image: form.image,
        images: extraImages,
        isSold: form.isSold,
        status: form.isSold ? "sold" : "available",
      },
      session.user.id
    );

    setSaving(false);

    if (!result.success) {
      setErrors({ general: result.error || "Failed to update listing." });
      return;
    }

    router.push(`/cars/${id}`);
  }

  async function handleToggleSold() {
    if (!session?.user?.id) return;
    const res = await toggleCarSoldStatus(id, session.user.id);
    if (res.success && res.isSold !== undefined) {
      setForm((prev) => ({ ...prev, isSold: res.isSold! }));
    }
  }

  if (sessionLoading || loadingCar) {
    return <div className="mx-auto max-w-2xl px-4 py-12 text-[#232c33] font-bold">Loading listing editor...</div>;
  }

  const isOwner = session?.user?.id === car?.createdBy;
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  if (!isOwner && !isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 font-bold">
          Access Denied — You can only edit your own vehicle listings.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-[#b2b2b2] bg-white p-8 shadow-xl">
        <div className="border-b border-[#e9e3e6] pb-5 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#232c33] tracking-tight">Edit Vehicle Listing</h1>
            <p className="text-[#9a8f97] text-sm mt-1">
              Update details or mark your listing as sold.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleSold}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-sm ${
              form.isSold
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-emerald-700 text-white hover:bg-emerald-800"
            }`}
          >
            {form.isSold ? "★ Marked SOLD OUT (Click to Available)" : "Mark as SOLD OUT"}
          </button>
        </div>

        {errors.general && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 font-medium">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Vehicle Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
            />
            {errors.title && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Short Description</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
            />
            {errors.shortDescription && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.shortDescription}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Full Description</label>
            <textarea
              value={form.fullDescription}
              onChange={(e) => updateField("fullDescription", e.target.value)}
              rows={4}
              className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] resize-none transition"
            />
            {errors.fullDescription && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.fullDescription}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Price (৳)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
              />
              {errors.price && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Seats Count</label>
              <input
                type="number"
                value={form.seats}
                onChange={(e) => updateField("seats", e.target.value)}
                className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
              />
              {errors.seats && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.seats}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value as CarCategory)}
                className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Transmission</label>
              <select
                value={form.transmission}
                onChange={(e) => updateField("transmission", e.target.value as Transmission)}
                className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
              >
                <option value="">Select transmission</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.transmission && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.transmission}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Fuel Type</label>
              <select
                value={form.fuelType}
                onChange={(e) => updateField("fuelType", e.target.value as FuelType)}
                className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
              >
                <option value="">Select fuel type</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              {errors.fuelType && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.fuelType}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
              />
              {errors.location && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Contact Info</label>
            <input
              type="text"
              value={form.contactInfo}
              onChange={(e) => updateField("contactInfo", e.target.value)}
              className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
            />
            {errors.contactInfo && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.contactInfo}</p>}
          </div>

          <ImageUpload
            value={form.image}
            onChange={(url) => updateField("image", url)}
          />

          <MultiImageUpload
            values={extraImages}
            onChange={setExtraImages}
          />

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary flex-1 rounded-xl px-6 py-3.5 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 rounded-xl px-6 py-3.5 text-sm font-bold text-white transition disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-xl"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
