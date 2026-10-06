export interface Review {
  _id?: string;
  type?: "car" | "platform";
  carId?: string;
  carTitle?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  userRole?: string;
  rating: number; // 1–5
  comment: string;
  approved?: boolean;
  approvalStatus?: "pending" | "approved" | "rejected";
  createdAt: string | Date;
}

export type ReviewInput = Omit<Review, "_id" | "createdAt">;