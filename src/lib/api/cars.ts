import type { Car } from "@/types/Car";

const SERVER_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getAllCars(): Promise<Car[]> {
  try {
    const response = await fetch(`${SERVER_URL}/api/cars`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cars.");
    }

    const data: Car[] = await response.json();
    return data;
  } catch (err) {
    console.error("getAllCars error:", err);
    return [];
  }
}

export async function getCarsByUser(userId: string): Promise<Car[]> {
  try {
    const response = await fetch(`${SERVER_URL}/api/cars?userId=${userId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cars.");
    }

    const data: Car[] = await response.json();
    return data;
  } catch (err) {
    console.error("getCarsByUser error:", err);
    return [];
  }
}

// getAllCars (T21) will be added here later