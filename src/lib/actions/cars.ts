import type { CarInput } from "@/types/Car";

const SERVER_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface CreateCarPayload extends CarInput {
  userId: string;
}

interface CreateCarResponse {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  seats: number;
  transmission: string;
  fuelType: string;
  location: string;
  image: string;
  contactInfo: string;
  createdBy: string;
  createdAt: string;
}

interface CreateCarResult {
  success: boolean;
  car?: CreateCarResponse;
  error?: string;
}

export async function deleteCar(carId: string, userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${SERVER_URL}/api/cars/${carId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to delete car." };
    }

    return { success: true };
  } catch (err) {
    console.error("deleteCar error:", err);
    return { success: false, error: "Network error — could not reach the server." };
  }
}

export async function createCar(payload: CreateCarPayload): Promise<CreateCarResult> {
  try {
    const response = await fetch(`${SERVER_URL}/api/cars`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to create car listing.",
      };
    }

    return {
      success: true,
      car: data,
    };
  } catch (err) {
    console.error("createCar error:", err);
    return {
      success: false,
      error: "Network error — could not reach the server.",
    };
  }
}

// updateCar and deleteCar will be added in later tasks (T18)