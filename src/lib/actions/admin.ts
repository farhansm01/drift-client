"use server";

import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

async function verifyAdmin(userId: string): Promise<boolean> {
  if (!userId) return false;
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
    return user?.role === "admin";
  } catch (err) {
    console.error("verifyAdmin error:", err);
    return false;
  }
}

export async function getAdminStats(userId: string) {
  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const db = await getDb();

    const [totalCars, pendingCars, totalReviews, pendingReviews, totalUsers] = await Promise.all([
      db.collection("cars").countDocuments(),
      db.collection("cars").countDocuments({ approvalStatus: "pending" }),
      db.collection("reviews").countDocuments(),
      db.collection("reviews").countDocuments({
        $or: [{ approvalStatus: "pending" }, { approved: false }],
      }),
      db.collection("user").countDocuments(),
    ]);

    return {
      success: true,
      stats: {
        totalCars,
        pendingCars,
        totalReviews,
        pendingReviews,
        totalUsers,
      },
    };
  } catch (err) {
    console.error("getAdminStats error:", err);
    return { success: false, error: "Failed to fetch stats." };
  }
}

export async function getAdminCars(userId: string, filter: string = "all") {
  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const db = await getDb();
    const query: any = {};

    if (filter === "pending") {
      query.approvalStatus = "pending";
    } else if (filter === "approved") {
      query.$or = [{ approvalStatus: "approved" }, { approvalStatus: { $exists: false } }];
    } else if (filter === "rejected") {
      query.approvalStatus = "rejected";
    }

    const carsDoc = await db.collection("cars").find(query).sort({ createdAt: -1 }).toArray();

    const cars = carsDoc.map((car) => ({
      _id: car._id.toString(),
      title: car.title || "Untitled Car",
      shortDescription: car.shortDescription || "",
      price: car.price || 0,
      category: car.category || "Sedan",
      transmission: car.transmission || "Automatic",
      location: car.location || "Dhaka",
      image: car.image || "",
      createdBy: car.createdBy || "",
      isSold: !!car.isSold,
      status: car.status || "available",
      approvalStatus: car.approvalStatus || "approved",
      createdAt: car.createdAt ? new Date(car.createdAt).toISOString() : new Date().toISOString(),
    }));

    return { success: true, cars };
  } catch (err) {
    console.error("getAdminCars error:", err);
    return { success: false, error: "Failed to fetch cars." };
  }
}

export async function updateCarApproval(
  carId: string,
  userId: string,
  approvalStatus: "approved" | "rejected"
) {
  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const db = await getDb();
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(carId);
    } catch {
      return { success: false, error: "Invalid Car ID" };
    }

    await db.collection("cars").updateOne(
      { _id: objectId },
      { $set: { approvalStatus } }
    );

    return { success: true };
  } catch (err) {
    console.error("updateCarApproval error:", err);
    return { success: false, error: "Failed to update car status." };
  }
}

export async function deleteCarAdmin(carId: string, userId: string) {
  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const db = await getDb();
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(carId);
    } catch {
      return { success: false, error: "Invalid Car ID" };
    }

    await db.collection("cars").deleteOne({ _id: objectId });
    return { success: true };
  } catch (err) {
    console.error("deleteCarAdmin error:", err);
    return { success: false, error: "Failed to delete car." };
  }
}

export async function getAdminReviews(userId: string, filter: string = "all") {
  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const db = await getDb();
    const query: any = {};

    if (filter === "pending") {
      query.$or = [{ approvalStatus: "pending" }, { approved: false }];
    } else if (filter === "approved") {
      query.$or = [
        { approvalStatus: "approved" },
        { $and: [{ approved: true }, { approvalStatus: { $ne: "pending" } }] },
      ];
    } else if (filter === "rejected") {
      query.approvalStatus = "rejected";
    }

    const reviewsDoc = await db.collection("reviews").find(query).sort({ createdAt: -1 }).toArray();

    const reviews = reviewsDoc.map((r) => ({
      _id: r._id.toString(),
      type: r.type || (r.carId === "platform" ? "platform" : "car"),
      carId: r.carId || "platform",
      carTitle: r.carTitle || "",
      userId: r.userId || "",
      userName: r.userName || "Anonymous",
      userAvatar: r.userAvatar || "",
      userRole: r.userRole || "Buyer",
      rating: r.rating || 5,
      comment: r.comment || "",
      approved: r.approved ?? true,
      approvalStatus: r.approvalStatus || (r.approved ? "approved" : "pending"),
      createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    }));

    return { success: true, reviews };
  } catch (err) {
    console.error("getAdminReviews error:", err);
    return { success: false, error: "Failed to fetch reviews." };
  }
}

export async function updateReviewApproval(
  reviewId: string,
  userId: string,
  approvalStatus: "approved" | "rejected"
) {
  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const db = await getDb();
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(reviewId);
    } catch {
      return { success: false, error: "Invalid Review ID" };
    }

    const isApproved = approvalStatus === "approved";
    await db.collection("reviews").updateOne(
      { _id: objectId },
      { $set: { approvalStatus, approved: isApproved } }
    );

    return { success: true };
  } catch (err) {
    console.error("updateReviewApproval error:", err);
    return { success: false, error: "Failed to update review status." };
  }
}

export async function deleteReviewAdmin(reviewId: string, userId: string) {
  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const db = await getDb();
    let objectId: ObjectId;
    try {
      objectId = new ObjectId(reviewId);
    } catch {
      return { success: false, error: "Invalid Review ID" };
    }

    await db.collection("reviews").deleteOne({ _id: objectId });
    return { success: true };
  } catch (err) {
    console.error("deleteReviewAdmin error:", err);
    return { success: false, error: "Failed to delete review." };
  }
}

export async function getAdminUsers(userId: string) {
  const isAdmin = await verifyAdmin(userId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const db = await getDb();
    const usersDoc = await db.collection("user").find({}).sort({ createdAt: -1 }).toArray();

    const users = usersDoc.map((u) => ({
      _id: u._id.toString(),
      name: u.name || "User",
      email: u.email || "",
      image: u.image || "",
      role: u.role || "user",
      createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
    }));

    return { success: true, users };
  } catch (err) {
    console.error("getAdminUsers error:", err);
    return { success: false, error: "Failed to fetch users." };
  }
}

export async function updateUserRole(
  targetUserId: string,
  adminUserId: string,
  newRole: "user" | "admin"
) {
  const isAdmin = await verifyAdmin(adminUserId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  try {
    const db = await getDb();
    await db.collection("user").updateOne(
      { _id: targetUserId as any },
      { $set: { role: newRole } }
    );

    return { success: true };
  } catch (err) {
    console.error("updateUserRole error:", err);
    return { success: false, error: "Failed to update user role." };
  }
}

export async function deleteUserAdmin(targetUserId: string, adminUserId: string) {
  const isAdmin = await verifyAdmin(adminUserId);
  if (!isAdmin) return { success: false, error: "Unauthorized access" };

  if (targetUserId === adminUserId) {
    return { success: false, error: "You cannot delete your own admin account." };
  }

  try {
    const db = await getDb();
    await db.collection("user").deleteOne({ _id: targetUserId as any });
    return { success: true };
  } catch (err) {
    console.error("deleteUserAdmin error:", err);
    return { success: false, error: "Failed to delete user." };
  }
}
