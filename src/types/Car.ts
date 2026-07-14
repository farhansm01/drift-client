import { ObjectId } from "mongodb";

/**
 * Drift — Car type definition (T06)
 *
 * This is the shape every document in the "cars" MongoDB collection
 * must follow. Since we're using the plain MongoDB driver (not Mongoose),
 * this interface is our "schema" — TypeScript enforces the shape at
 * compile time instead of the database enforcing it at write time.
 */

export type Transmission = "Automatic" | "Manual";
export type FuelType = "Petrol" | "Diesel" | "Electric" | "Hybrid";
export type CarCategory = "Sedan" | "SUV" | "Hatchback" | "Luxury" | "Van";

export interface Car {
  _id?: ObjectId;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number; // per day, in BDT (৳)
  category: CarCategory;
  seats: number;
  transmission: Transmission;
  fuelType: FuelType;
  location: string;
  image: string; // imgbb-hosted URL — never binary/file data
  createdBy: string; // the user id (from BetterAuth) who added this car
  createdAt: Date;
}

/**
 * Shape of the data coming FROM the Add Item form, before we attach
 * createdBy / createdAt / _id server-side. Keeps the form's payload
 * separate from the full stored document.
 */
export type CarInput = Omit<Car, "_id" | "createdBy" | "createdAt">;