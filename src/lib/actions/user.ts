"use server";

import { getDb } from "@/lib/db";

import { ObjectId } from "mongodb";

export async function getUserRole(userId: string): Promise<string> {
  if (!userId) return "user";
  try {
    const db = await getDb();
    let objectId: ObjectId | null = null;
    try {
      objectId = new ObjectId(userId);
    } catch {
      objectId = null;
    }

    const query = objectId
      ? { $or: [{ _id: objectId }, { _id: userId as any }, { id: userId }] }
      : { $or: [{ _id: userId as any }, { id: userId }] };

    const user = await db.collection("user").findOne(query);
    return user?.role || "user";
  } catch (err) {
    console.error("getUserRole error:", err);
    return "user";
  }
}
