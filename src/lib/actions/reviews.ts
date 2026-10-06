"use server";

import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

interface SubmitReviewPayload {
  carId: string;
  type?: "car" | "platform";
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  carTitle?: string;
  rating: number;
  comment: string;
}

interface SubmitReviewResult {
  success: boolean;
  error?: string;
}

export async function submitReview(payload: SubmitReviewPayload): Promise<SubmitReviewResult> {
  try {
    const db = await getDb();
    
    let objectId: ObjectId | null = null;
    try {
      objectId = new ObjectId(payload.userId);
    } catch {
      objectId = null;
    }

    const userQuery = objectId
      ? { $or: [{ _id: objectId }, { _id: payload.userId as any }, { id: payload.userId }] }
      : { $or: [{ _id: payload.userId as any }, { id: payload.userId }] };

    const user = await db.collection("user").findOne(userQuery);
    if (user?.role === "admin") {
      return { success: false, error: "Administrators cannot post reviews." };
    }

    const userRole = payload.userRole || "Verified Buyer";

    const newReview = {
      carId: payload.carId || "platform",
      type: payload.type || (payload.carId === "platform" ? "platform" : "car"),
      userId: payload.userId,
      userName: payload.userName,
      userAvatar: payload.userAvatar || "",
      userRole: userRole,
      carTitle: payload.carTitle || "",
      rating: Number(payload.rating),
      comment: payload.comment,
      approved: false,
      approvalStatus: "pending",
      createdAt: new Date().toISOString(),
    };

    await db.collection("reviews").insertOne(newReview);
    return { success: true };
  } catch (err) {
    console.error("submitReview error:", err);
    return { success: false, error: "Failed to submit review." };
  }
}

export async function fetchPlatformReviewsAction() {
  try {
    const db = await getDb();
    const docs = await db
      .collection("reviews")
      .find({
        $or: [
          { carId: "platform", approvalStatus: "approved" },
          { type: "platform", approvalStatus: "approved" },
          { carId: "platform", approved: true },
          { type: "platform", approved: true },
        ],
      })
      .sort({ createdAt: -1, _id: -1 })
      .limit(20)
      .toArray();

    const reviews = docs.map((r) => {
      let isoDate = "";
      if (r.createdAt) {
        const d = new Date(r.createdAt);
        if (!isNaN(d.getTime())) {
          isoDate = d.toISOString();
        }
      }
      if (!isoDate && ObjectId.isValid(r._id)) {
        try {
          isoDate = new ObjectId(r._id).getTimestamp().toISOString();
        } catch (e) {}
      }
      if (!isoDate) {
        isoDate = new Date().toISOString();
      }

      return {
        _id: r._id.toString(),
        type: "platform" as const,
        carId: "platform",
        userId: r.userId || "",
        userName: r.userName || "Anonymous",
        userAvatar: r.userAvatar || "",
        userRole: r.userRole || "Verified Platform User",
        rating: r.rating || 5,
        comment: r.comment || "",
        approved: true,
        approvalStatus: "approved" as const,
        createdAt: isoDate,
      };
    });

    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return reviews;
  } catch (err) {
    console.error("fetchPlatformReviewsAction error:", err);
    return [];
  }
}

export async function fetchReviewsByCarIdAction(carId: string) {
  try {
    const db = await getDb();
    const docs = await db
      .collection("reviews")
      .find({
        carId,
        $or: [{ approvalStatus: "approved" }, { approved: true }],
      })
      .sort({ createdAt: -1, _id: -1 })
      .limit(20)
      .toArray();

    const reviews = docs.map((r) => {
      let isoDate = "";
      if (r.createdAt) {
        const d = new Date(r.createdAt);
        if (!isNaN(d.getTime())) {
          isoDate = d.toISOString();
        }
      }
      if (!isoDate && ObjectId.isValid(r._id)) {
        try {
          isoDate = new ObjectId(r._id).getTimestamp().toISOString();
        } catch (e) {}
      }
      if (!isoDate) {
        isoDate = new Date().toISOString();
      }

      return {
        _id: r._id.toString(),
        type: "car" as const,
        carId: r.carId,
        carTitle: r.carTitle || "",
        userId: r.userId || "",
        userName: r.userName || "Anonymous",
        userAvatar: r.userAvatar || "",
        userRole: r.userRole || "Verified Buyer",
        rating: r.rating || 5,
        comment: r.comment || "",
        approved: true,
        approvalStatus: "approved" as const,
        createdAt: isoDate,
      };
    });

    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return reviews;
  } catch (err) {
    console.error("fetchReviewsByCarIdAction error:", err);
    return [];
  }
}