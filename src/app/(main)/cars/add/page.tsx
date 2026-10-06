// src/app/(main)/cars/add/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createCar } from "@/lib/actions/cars";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import PlatformReviewModal from "@/components/PlatformReviewModal";
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

import { useUserRole } from "@/hooks/useUserRole";

const CONTACT_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[0-9+\-\s()]{7,}$/;

export default function AddItemPage() {
  const router = useRouter();
  const { session, isAdmin } = useUserRole();
  const [form, setForm] = useState<FormState>(initialState);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

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

    // Show platform review popup modal after successfully listing a car
    setShowReviewModal(true);
  }

  function handleModalClose() {
    setShowReviewModal(false);
    router.push("/cars/manage");
  }

  if (isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-amber-900 shadow-lg">
          <div className="w-14 h-14 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🛡️
          </div>
          <h2 className="text-2xl font-black mb-2 text-[#232c33]">Admin Action Restricted</h2>
          <p className="text-sm text-[#9a8f97] font-medium leading-relaxed">
            Administrators are not permitted to list vehicles or post reviews on the marketplace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-2xl border border-[#b2b2b2] bg-white p-8 shadow-xl">
        <div className="border-b border-[#e9e3e6] pb-5 mb-6">
          <h1 className="text-3xl font-extrabold text-[#232c33] tracking-tight">List your car</h1>
          <p className="text-[#9a8f97] text-sm mt-1">
            Fill in the details below to submit your vehicle for admin review & approval.
          </p>
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
              className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 transition ${
                errors.title ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
              }`}
              placeholder="e.g. 2019 Toyota Axio Hybrid"
            />
            {errors.title && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Short Description</label>
            <input
              type="text"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 transition ${
                errors.shortDescription ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
              }`}
              placeholder="e.g. Clean condition, fuel-efficient, daily driven"
            />
            {errors.shortDescription && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.shortDescription}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Full Description</label>
            <textarea
              value={form.fullDescription}
              onChange={(e) => updateField("fullDescription", e.target.value)}
              rows={4}
              className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 resize-none transition ${
                errors.fullDescription ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
              }`}
              placeholder="Describe vehicle condition, service history, features, and key specifications..."
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
                className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 transition ${
                  errors.price ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
                }`}
                placeholder="e.g. 1950000"
              />
              {errors.price && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Seats Count</label>
              <input
                type="number"
                value={form.seats}
                onChange={(e) => updateField("seats", e.target.value)}
                className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 transition ${
                  errors.seats ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
                }`}
                placeholder="5"
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
                className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] focus:outline-none focus:bg-white focus:ring-2 transition ${
                  errors.category ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
                }`}
              >
                <option value="" className="bg-white text-[#232c33]">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-white text-[#232c33]">{c}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Transmission</label>
              <select
                value={form.transmission}
                onChange={(e) => updateField("transmission", e.target.value as Transmission)}
                className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] focus:outline-none focus:bg-white focus:ring-2 transition ${
                  errors.transmission ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
                }`}
              >
                <option value="" className="bg-white text-[#232c33]">Select transmission</option>
                {TRANSMISSIONS.map((t) => (
                  <option key={t} value={t} className="bg-white text-[#232c33]">{t}</option>
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
                className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] focus:outline-none focus:bg-white focus:ring-2 transition ${
                  errors.fuelType ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
                }`}
              >
                <option value="" className="bg-white text-[#232c33]">Select fuel type</option>
                {FUEL_TYPES.map((f) => (
                  <option key={f} value={f} className="bg-white text-[#232c33]">{f}</option>
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
                className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 transition ${
                  errors.location ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
                }`}
                placeholder="e.g. Gulshan, Dhaka"
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
              className={`w-full rounded-xl bg-[#e9e3e6]/40 border px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:bg-white focus:ring-2 transition ${
                errors.contactInfo ? "border-red-500 focus:ring-red-500/20" : "border-[#b2b2b2] focus:border-[#232c33] focus:ring-[#232c33]/20"
              }`}
              placeholder="you@example.com or 017XXXXXXXX"
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

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full rounded-xl px-6 py-3.5 text-base font-bold text-white transition disabled:opacity-50 cursor-pointer shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting Listing..." : "Submit Listing"}
            </button>
          </div>
        </form>
      </div>

      {/* Post Car Creation Platform Review Popup Modal */}
      <PlatformReviewModal
        isOpen={showReviewModal}
        onClose={handleModalClose}
        title="Congratulations on listing your car! 🎉"
        subtitle="How was your experience listing on Drift? Leave a review for our platform. Your review will appear on the homepage after admin approval."
      />
    </div>
  );
}