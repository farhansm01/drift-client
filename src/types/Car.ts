import { ObjectId } from "mongodb";

/**
 * Drift — Car type definition (client-side copy)
 *
 * Duplicated from drift-server/src/types/Car.ts since the two repos
 * don't share a package. Keep both files in sync manually if the
 * schema changes.
 */

export type Transmission = "Automatic" | "Manual";
export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";
export type CarCategory = "Sedan" | "SUV" | "Hatchback" | "Luxury" | "Van";

export interface Car {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number; // asking price, in BDT (৳)
  category: CarCategory;
  seats: number;
  transmission: Transmission;
  fuelType: FuelType;
  location: string;
  image: string;
  contactInfo: string;
  createdBy: string;
  createdAt: Date;
}

export type CarInput = Omit<Car, "_id" | "createdBy" | "createdAt">;