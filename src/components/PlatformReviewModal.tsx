"use client";

import { useState } from "react";
import { Xmark, StarFill } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { submitReview } from "@/lib/actions/reviews";
import { useUserRole } from "@/hooks/useUserRole";

interface PlatformReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export default function PlatformReviewModal({
  isOpen,
  onClose,
  title = "Review Drift Platform",
  subtitle = "How was your experience using Drift? Your review will be published after admin verification.",
}: PlatformReviewModalProps) {
  const { session, isAdmin } = useUserRole();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || isAdmin) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user) {
      setError("Please log in to submit a platform review.");
      return;
    }

    if ((session.user as { role?: string })?.role === "admin") {
      setError("Administrators are not permitted to submit platform reviews.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write your feedback.");
      return;
    }

    setError(null);
    setLoading(true);

    const result = await submitReview({
      carId: "platform",
      type: "platform",
      userId: session.user.id,
      userName: session.user.name || "Anonymous User",
      userAvatar: session.user.image || undefined,
      userRole: "Verified Platform User",
      rating,
      comment: comment.trim(),
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Failed to submit review. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#b2b2b2] bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#232c33]/70 hover:bg-[#e9e3e6] transition"
        >
          <Xmark width={20} height={20} />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#232c33] text-white flex items-center justify-center mx-auto mb-4 text-2xl shadow-md">
              ✓
            </div>
            <h3 className="text-xl font-bold text-[#232c33]">Review Submitted!</h3>
            <p className="text-xs text-[#232c33]/70 mt-2 max-w-xs mx-auto leading-relaxed">
              Thank you for reviewing Drift. Your platform feedback has been submitted for admin approval and will appear on the homepage once verified.
            </p>
            <button
              onClick={onClose}
              className="mt-6 btn-primary px-6 py-2.5 text-xs font-bold"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-black text-[#232c33]">{title}</h3>
            <p className="text-xs text-[#232c33]/70 mt-1 mb-5 leading-relaxed font-medium">
              {subtitle}
            </p>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg mb-4 font-semibold">
                {error}
              </p>
            )}

            {!session?.user ? (
              <div className="text-center py-4 bg-[#e9e3e6]/60 rounded-xl border border-[#c3baba] p-4">
                <p className="text-xs text-[#232c33]/80 mb-3 font-semibold">
                  You need to be logged in to leave a platform review.
                </p>
                <a
                  href="/login"
                  className="btn-primary inline-block px-5 py-2 text-xs font-bold"
                >
                  Log In Now
                </a>
              </div>
            ) : (session?.user as { role?: string })?.role === "admin" ? (
              <div className="text-center py-6 bg-amber-50 rounded-xl border border-amber-200 p-4">
                <p className="text-sm text-amber-800 font-bold mb-1">
                  Admin Action Restricted
                </p>
                <p className="text-xs text-amber-700 font-medium">
                  Administrators cannot submit platform reviews.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#232c33] mb-1.5 uppercase tracking-wider">
                    Rating
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer transition hover:scale-110"
                      >
                        <StarFill
                          width={24}
                          height={24}
                          className={
                            star <= rating ? "text-amber-500" : "text-[#c3baba]"
                          }
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#232c33] ml-2">
                      {rating}.0 / 5.0
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#232c33] mb-1.5 uppercase tracking-wider">
                    Your Platform Feedback
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Share your experience buying or listing on Drift..."
                    className="w-full rounded-xl bg-[#e9e3e6]/50 border border-[#b2b2b2] p-3 text-xs text-[#232c33] placeholder:text-[#9a8f97] focus:outline-none focus:border-[#232c33] font-medium"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary px-4 py-2 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-6 py-2 text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
