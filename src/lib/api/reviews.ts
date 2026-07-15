import type { Review } from "@/types/Review";

const SERVER_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getReviewsByCarId(carId: string): Promise<Review[]> {
  try {
    const response = await fetch(`${SERVER_URL}/api/reviews?carId=${carId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data: Review[] = await response.json();
    return data;
  } catch (err) {
    console.error("getReviewsByCarId error:", err);
    return [];
  }
}