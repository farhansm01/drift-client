// src/app/(main)/cars/add/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createCar } from "@/lib/actions/cars";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import type { CarCategory, Transmission, FuelType } from "@/types/Car";

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

const initialState: FormState = {
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
};

const CONTACT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[0-9+\-\s()]{7,}$/;

export default function AddItemPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [form, setForm] = useState<FormState>(initialState);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate(): FieldErrors {
    const newErrors: FieldErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    } else if (form.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!form.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required.";
    } else if (form.shortDescription.trim().length > 120) {
      newErrors.shortDescription = "Keep it under 120 characters.";
    }

    if (!form.fullDescription.trim()) {
      newErrors.fullDescription = "Full description is required.";
    } else if (form.fullDescription.trim().length < 20) {
      newErrors.fullDescription = "Full description must be at least 20 characters.";
    }

    const priceNum = Number(form.price);
    if (!form.price.trim()) {
      newErrors.price = "Price is required.";
    } else if (Number.isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = "Enter a valid price greater than 0.";
    }

    if (!form.category) {
      newErrors.category = "Select a category.";
    }

    const seatsNum = Number(form.seats);
    if (!form.seats.trim()) {
      newErrors.seats = "Seats is required.";
    } else if (Number.isNaN(seatsNum) || seatsNum < 1 || seatsNum > 20) {
      newErrors.seats = "Enter a valid seat count (1–20).";
    }

    if (!form.transmission) {
      newErrors.transmission = "Select a transmission type.";
    }

    if (!form.fuelType) {
      newErrors.fuelType = "Select a fuel type.";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!form.contactInfo.trim()) {
      newErrors.contactInfo = "Contact info is required.";
    } else if (!CONTACT_REGEX.test(form.contactInfo.trim())) {
      newErrors.contactInfo = "Enter a valid email or phone number.";
    }

    return newErrors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    if (!session?.user?.id) {
      setErrors({ general: "You must be logged in to list a car." });
      setLoading(false);
      return;
    }

    const result = await createCar({
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
      userId: session.user.id,
    });

    setLoading(false);

    if (!result.success) {
      setErrors({ general: result.error || "Something went wrong. Please try again." });
      return;
    }

    router.push("/cars/manage");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-white mb-1">List your car</h1>
        <p className="text-neutral-400 text-sm mb-6">
          Fill in the details below. Buyers will see this listing on the Explore page.
        </p>

        {errors.general && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm text-neutral-300 mb-1">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                errors.title ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
              }`}
              placeholder="2019 Toyota Axio Hybrid"
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Short description</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                errors.shortDescription ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
              }`}
              placeholder="Clean, fuel-efficient, well-maintained"
            />
            {errors.shortDescription && <p className="mt-1 text-xs text-red-400">{errors.shortDescription}</p>}
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Full description</label>
            <textarea
              value={form.fullDescription}
              onChange={(e) => updateField("fullDescription", e.target.value)}
              rows={4}
              className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 resize-none ${
                errors.fullDescription ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
              }`}
              placeholder="Describe condition, service history, any notable details..."
            />
            {errors.fullDescription && <p className="mt-1 text-xs text-red-400">{errors.fullDescription}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Price (৳)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                  errors.price ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
                }`}
                placeholder="1800"
              />
              {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Seats</label>
              <input
                type="number"
                value={form.seats}
                onChange={(e) => updateField("seats", e.target.value)}
                className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                  errors.seats ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
                }`}
                placeholder="5"
              />
              {errors.seats && <p className="mt-1 text-xs text-red-400">{errors.seats}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField("category", e.target.value as CarCategory)}
                className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                  errors.category ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
                }`}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-400">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Transmission</label>
              <select
                value={form.transmission}
                onChange={(e) => updateField("transmission", e.target.value as Transmission)}
                className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                  errors.transmission ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
                }`}
              >
                <option value="">Select transmission</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.transmission && <p className="mt-1 text-xs text-red-400">{errors.transmission}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-neutral-300 mb-1">Fuel type</label>
              <select
                value={form.fuelType}
                onChange={(e) => updateField("fuelType", e.target.value as FuelType)}
                className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                  errors.fuelType ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
                }`}
              >
                <option value="">Select fuel type</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              {errors.fuelType && <p className="mt-1 text-xs text-red-400">{errors.fuelType}</p>}
            </div>

            <div>
              <label className="block text-sm text-neutral-300 mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                  errors.location ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
                }`}
                placeholder="Dhaka"
              />
              {errors.location && <p className="mt-1 text-xs text-red-400">{errors.location}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1">Contact info</label>
            <input
              type="text"
              value={form.contactInfo}
              onChange={(e) => updateField("contactInfo", e.target.value)}
              className={`w-full rounded-lg bg-neutral-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 ${
                errors.contactInfo ? "border-red-500 focus:ring-red-500" : "border-neutral-700 focus:ring-neutral-500"
              }`}
              placeholder="you@example.com or 01XXXXXXXXX"
            />
            {errors.contactInfo && <p className="mt-1 text-xs text-red-400">{errors.contactInfo}</p>}
          </div>

          <ImageUpload
            value={form.image}
            onChange={(url) => updateField("image", url)}
          />

          <MultiImageUpload
            values={extraImages}
            onChange={setExtraImages}
          />

          <button
            type="submit"
            disabled={loading}
            className="metallic-button w-full rounded-lg px-6 py-2.5 text-sm font-medium text-neutral-900 hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit listing"}
          </button>
        </form>
      </div>
    </div>
  );
}