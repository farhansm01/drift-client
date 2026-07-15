const SERVER_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface SubmitReviewPayload {
  carId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
}

interface SubmitReviewResult {
  success: boolean;
  error?: string;
}

export async function submitReview(payload: SubmitReviewPayload): Promise<SubmitReviewResult> {
  try {
    const response = await fetch(`${SERVER_URL}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to submit review." };
    }

    return { success: true };
  } catch (err) {
    console.error("submitReview error:", err);
    return { success: false, error: "Network error — could not reach the server." };
  }
}