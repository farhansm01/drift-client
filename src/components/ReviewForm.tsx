"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { submitReview } from "@/lib/actions/reviews";
import { useUserRole } from "@/hooks/useUserRole";

interface ReviewFormProps {
  carId: string;
  carOwnerId?: string;
}

export default function ReviewForm({ carId, carOwnerId }: ReviewFormProps) {
  const router = useRouter();
  const { session, isAdmin, isLoggedIn, isPending } = useUserRole();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const sessionRole = (session?.user as { role?: string })?.role;
  const isUserAdmin = isAdmin || sessionRole === "admin";

  if (isPending || isUserAdmin) {
    return null;
  }

  if (!isLoggedIn || !session?.user) {
    return (
      <div className="rounded-xl border border-[#c3baba] bg-[#e9e3e6]/60 p-4 mt-6 text-center">
        <p className="text-xs text-[#232c33] font-semibold">
          Log in to leave a review for this vehicle.
        </p>
      </div>
    );
  }

  const isOwner = carOwnerId && session.user.id === carOwnerId;

  if (isOwner) {
    return (
      <div className="rounded-xl border border-[#b2b2b2] bg-[#e9e3e6]/60 p-4 mt-6 text-center">
        <p className="text-xs text-[#232c33] font-bold">
          You cannot submit a review for your own vehicle listing.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await submitReview({
      carId,
      userId: session!.user.id,
      userName: session!.user.name || "Anonymous",
      rating,
      comment: comment.trim(),
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Something went wrong.");
      return;
    }

    setSubmitted(true);
    setComment("");
    setRating(5);
    router.refresh();
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 mt-6 text-center shadow-sm">
        <p className="text-xs font-extrabold text-emerald-800">
          ✓ Review Submitted!
        </p>
        <p className="text-[11px] text-emerald-700 font-medium mt-1">
          Thank you! Your product review has been submitted for admin approval and will appear on this vehicle page once verified.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[#b2b2b2] bg-[#e9e3e6]/50 p-5 mt-6">
      <p className="text-sm text-[#232c33] font-bold mb-3">Leave a Vehicle Review</p>

      {error && <p className="text-xs text-red-600 font-semibold mb-2">{error}</p>}

      <div className="flex items-center gap-1.5 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl cursor-pointer transition hover:scale-110 ${star <= rating ? "text-amber-500" : "text-[#c3baba]"}`}
          >
            ★
          </button>
        ))}
        <span className="text-xs font-bold text-[#232c33] ml-2">{rating}.0 / 5.0</span>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share your experience inspecting or driving this car..."
        className="w-full rounded-xl bg-white border border-[#b2b2b2] px-3.5 py-2.5 text-[#232c33] text-xs placeholder:text-[#9a8f97] font-medium focus:outline-none focus:border-[#232c33] resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 btn-primary px-5 py-2.5 text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}