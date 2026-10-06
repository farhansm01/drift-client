"use server";

import type { CarInput } from "@/types/Car";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

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
    const db = await getDb();
    let objectId: ObjectId | null = null;
    try {
      objectId = new ObjectId(carId);
    } catch {
      objectId = null;
    }

    if (objectId) {
      const result = await db.collection("cars").deleteOne({
        _id: objectId,
        createdBy: userId,
      });

      if (result.deletedCount > 0) {
        return { success: true };
      }
    }

    // Fallback to API if not deleted directly
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
    const db = await getDb();
    
    let userObjectId: ObjectId | null = null;
    try {
      userObjectId = new ObjectId(payload.userId);
    } catch {
      userObjectId = null;
    }

    const userQuery = userObjectId
      ? { $or: [{ _id: userObjectId }, { _id: payload.userId as any }, { id: payload.userId }] }
      : { $or: [{ _id: payload.userId as any }, { id: payload.userId }] };

    const user = await db.collection("user").findOne(userQuery);
    if (user?.role === "admin") {
      return { success: false, error: "Administrators cannot list cars." };
    }

    const newCar = {
      title: payload.title,
      shortDescription: payload.shortDescription,
      fullDescription: payload.fullDescription,
      price: Number(payload.price),
      category: payload.category,
      seats: Number(payload.seats),
      transmission: payload.transmission,
      fuelType: payload.fuelType,
      location: payload.location,
      image: payload.image,
      images: payload.images || [],
      contactInfo: payload.contactInfo,
      createdBy: payload.userId,
      status: "available",
      isSold: false,
      approvalStatus: "pending",
      createdAt: new Date(),
    };

    const res = await db.collection("cars").insertOne(newCar);
    return {
      success: true,
      car: {
        _id: res.insertedId.toString(),
        ...newCar,
        createdAt: newCar.createdAt.toISOString(),
      } as any,
    };
  } catch (err) {
    console.error("createCar error:", err);
    return {
      success: false,
      error: "Failed to create car listing.",
    };
  }
}

export async function updateCar(
  carId: string,
  payload: Partial<CarInput>,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = await getDb();
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(carId);
    } catch {
      return { success: false, error: "Invalid car ID." };
    }

    const car = await db.collection("cars").findOne({ _id: objectId });
    if (!car) {
      return { success: false, error: "Car listing not found." };
    }

    if (car.createdBy !== userId) {
      const user = await db.collection("user").findOne({ _id: userId as any });
      if (user?.role !== "admin") {
        return { success: false, error: "You can only edit your own listings." };
      }
    }

    await db.collection("cars").updateOne(
      { _id: objectId },
      { $set: payload }
    );

    return { success: true };
  } catch (err) {
    console.error("updateCar error:", err);
    return { success: false, error: "Failed to update car listing." };
  }
}

export async function toggleCarSoldStatus(
  carId: string,
  userId: string
): Promise<{ success: boolean; isSold?: boolean; error?: string }> {
  try {
    const db = await getDb();
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(carId);
    } catch {
      return { success: false, error: "Invalid car ID." };
    }

    const car = await db.collection("cars").findOne({ _id: objectId });
    if (!car) {
      return { success: false, error: "Car listing not found." };
    }

    if (car.createdBy !== userId) {
      const user = await db.collection("user").findOne({ _id: userId as any });
      if (user?.role !== "admin") {
        return { success: false, error: "Unauthorized to change status of this car." };
      }
    }

    const newIsSold = !car.isSold;
    const newStatus = newIsSold ? "sold" : "available";

    await db.collection("cars").updateOne(
      { _id: objectId },
      { $set: { isSold: newIsSold, status: newStatus } }
    );

    return { success: true, isSold: newIsSold };
  } catch (err) {
    console.error("toggleCarSoldStatus error:", err);
    return { success: false, error: "Failed to update sold status." };
  }
}
