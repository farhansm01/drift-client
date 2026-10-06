import type { Review, ReviewInput } from "@/types/Review";
import { fetchPlatformReviewsAction, fetchReviewsByCarIdAction } from "@/lib/actions/reviews";

const SERVER_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://drift-server-navy.vercel.app";

const FALLBACK_PLATFORM_REVIEWS: Review[] = [
  {
    _id: "plat_04",
    type: "platform",
    userId: "plat_user_04",
    userName: "Shakil Hossain",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fm=jpg&q=80&w=200&auto=format&fit=crop",
    userRole: "Verified Buyer",
    rating: 5,
    comment: "Clean, transparent, and direct. Inspecting the vehicle and negotiating price directly with the owner gave me total confidence.",
    approved: true,
    createdAt: "2026-10-05T09:40:00Z",
  },
  {
    _id: "plat_03",
    type: "platform",
    userId: "plat_user_03",
    userName: "Farhan Ahmed",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=80&w=200&auto=format&fit=crop",
    userRole: "Verified Seller",
    rating: 5,
    comment: "Posted my Vezel in under 2 minutes. Got genuine calls from local Dhaka buyers instantly. Best direct marketplace in Bangladesh.",
    approved: true,
    createdAt: "2026-10-04T18:15:00Z",
  },
  {
    _id: "plat_02",
    type: "platform",
    userId: "plat_user_02",
    userName: "Nusrat Chowdhury",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?fm=jpg&q=80&w=200&auto=format&fit=crop",
    userRole: "Verified Buyer",
    rating: 5,
    comment: "Super smooth UI and zero fake listings. Contacted the owner directly and finalized my purchase at Gulshan. No broker harassment!",
    approved: true,
    createdAt: "2026-10-03T14:30:00Z",
  },
  {
    _id: "plat_01",
    type: "platform",
    userId: "plat_user_01",
    userName: "Tanvir Rahman",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?fm=jpg&q=80&w=200&auto=format&fit=crop",
    userRole: "Verified Seller",
    rating: 5,
    comment: "Drift completely changed how I sell cars in Dhaka. Listed my Premio, spoke directly to the buyer with 0 middleman fees. 10/10 platform experience!",
    approved: true,
    createdAt: "2026-10-02T10:00:00Z",
  },
];

export async function getPlatformReviews(): Promise<Review[]> {
  try {
    const reviews = await fetchPlatformReviewsAction();
    const realIds = new Set(reviews.map((r) => r._id).filter(Boolean) as string[]);
    const remainingFallbacks = FALLBACK_PLATFORM_REVIEWS.filter((f) => f._id ? !realIds.has(f._id) : true);
    const combined = [...reviews, ...remainingFallbacks];
    
    // Sort strictly by createdAt descending (newest date first)
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return combined.slice(0, 4);
  } catch (err) {
    console.error("getPlatformReviews error:", err);
    const fallbacks = [...FALLBACK_PLATFORM_REVIEWS];
    fallbacks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return fallbacks.slice(0, 4);
  }
}

export async function getAllReviews(): Promise<Review[]> {
  return getPlatformReviews();
}

export async function getReviewsByCarId(carId: string): Promise<Review[]> {
  try {
    const reviews = await fetchReviewsByCarIdAction(carId);
    return reviews.slice(0, 4);
  } catch (err) {
    console.error("getReviewsByCarId error:", err);
    return [];
  }
}

export async function createReview(reviewData: ReviewInput): Promise<Review | null> {
  try {
    const payload = {
      carId: reviewData.carId || "platform",
      type: reviewData.type || "platform",
      ...reviewData,
    };

    const response = await fetch(`${SERVER_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to submit review.");
    }

    const newReview: Review = await response.json();
    return newReview;
  } catch (err) {
    console.error("createReview error:", err);
    return null;
  }
}