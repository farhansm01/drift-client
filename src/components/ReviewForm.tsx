"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { submitReview } from "@/lib/actions/reviews";

interface ReviewFormProps {
  carId: string;
}

export default function ReviewForm({ carId }: ReviewFormProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!session?.user) {
    return (
      <p className="text-sm text-neutral-500">
        Log in to leave a review.
      </p>
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

    setComment("");
    setRating(5);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4 mt-4">
      <p className="text-sm text-white font-medium mb-2">Leave a review</p>

      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}

      <div className="flex items-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-xl ${star <= rating ? "text-yellow-400" : "text-neutral-600"}`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Share your thoughts about this car..."
        className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 resize-none"
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-3 metallic-button rounded-lg px-4 py-2 text-sm font-medium text-neutral-900 hover:opacity-90 transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}