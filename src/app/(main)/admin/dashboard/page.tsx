"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  getAdminStats,
  getAdminCars,
  updateCarApproval,
  deleteCarAdmin,
  getAdminReviews,
  updateReviewApproval,
  deleteReviewAdmin,
  getAdminUsers,
  updateUserRole,
  deleteUserAdmin,
} from "@/lib/actions/admin";
import { Car, Star, Persons, Check, TrashBin, Pencil, ShieldCheck, ArrowRotateLeft } from "@gravity-ui/icons";

import { useUserRole } from "@/hooks/useUserRole";

type Tab = "overview" | "cars" | "reviews" | "users";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { session, userId, isAdmin, isPending } = useUserRole();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState<{
    totalCars: number;
    pendingCars: number;
    totalReviews: number;
    pendingReviews: number;
    totalUsers: number;
  } | null>(null);

  // Cars state
  const [cars, setCars] = useState<any[]>([]);
  const [carFilter, setCarFilter] = useState<string>("all");
  const [loadingCars, setLoadingCars] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewFilter, setReviewFilter] = useState<string>("all");
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Users state
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Action messages
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!isPending) {
      if (!session || !isAdmin) {
        router.push("/");
      }
    }
  }, [session, isPending, isAdmin, router]);

  async function loadData() {
    if (!userId || !isAdmin) return;
    setLoading(true);

    const statsRes = await getAdminStats(userId);
    if (statsRes.success && statsRes.stats) {
      setStats(statsRes.stats);
    }

    await Promise.all([fetchCars("all"), fetchReviews("all"), fetchUsers()]);
    setLoading(false);
  }

  async function fetchCars(filter: string) {
    if (!userId) return;
    setLoadingCars(true);
    const res = await getAdminCars(userId, filter);
    if (res.success && res.cars) {
      setCars(res.cars);
    }
    setLoadingCars(false);
  }

  async function fetchReviews(filter: string) {
    if (!userId) return;
    setLoadingReviews(true);
    const res = await getAdminReviews(userId, filter);
    if (res.success && res.reviews) {
      setReviews(res.reviews);
    }
    setLoadingReviews(false);
  }

  async function fetchUsers() {
    if (!userId) return;
    setLoadingUsers(true);
    const res = await getAdminUsers(userId);
    if (res.success && res.users) {
      setUsers(res.users);
    }
    setLoadingUsers(false);
  }

  useEffect(() => {
    if (userId && isAdmin) {
      loadData();
    }
  }, [userId, isAdmin]);

  function showFeedback(message: string, type: "success" | "error" = "success") {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  }

  // --- CAR HANDLERS ---
  async function handleCarApproval(carId: string, status: "approved" | "rejected") {
    if (!userId) return;
    const res = await updateCarApproval(carId, userId, status);
    if (res.success) {
      showFeedback(`Car status updated to ${status}.`);
      fetchCars(carFilter);
      const statsRes = await getAdminStats(userId);
      if (statsRes.stats) setStats(statsRes.stats);
    } else {
      showFeedback(res.error || "Failed to update car status.", "error");
    }
  }

  async function handleCarDelete(carId: string, title: string) {
    if (!userId) return;
    if (!confirm(`Are you sure you want to delete car listing: "${title}"?`)) return;
    const res = await deleteCarAdmin(carId, userId);
    if (res.success) {
      showFeedback(`Car listing deleted successfully.`);
      fetchCars(carFilter);
      const statsRes = await getAdminStats(userId);
      if (statsRes.stats) setStats(statsRes.stats);
    } else {
      showFeedback(res.error || "Failed to delete car.", "error");
    }
  }

  // --- REVIEW HANDLERS ---
  async function handleReviewApproval(reviewId: string, status: "approved" | "rejected") {
    if (!userId) return;
    const res = await updateReviewApproval(reviewId, userId, status);
    if (res.success) {
      showFeedback(`Review status updated to ${status}.`);
      fetchReviews(reviewFilter);
      const statsRes = await getAdminStats(userId);
      if (statsRes.stats) setStats(statsRes.stats);
    } else {
      showFeedback(res.error || "Failed to update review status.", "error");
    }
  }

  async function handleReviewDelete(reviewId: string) {
    if (!userId) return;
    if (!confirm("Are you sure you want to delete this review?")) return;
    const res = await deleteReviewAdmin(reviewId, userId);
    if (res.success) {
      showFeedback("Review deleted successfully.");
      fetchReviews(reviewFilter);
      const statsRes = await getAdminStats(userId);
      if (statsRes.stats) setStats(statsRes.stats);
    } else {
      showFeedback(res.error || "Failed to delete review.", "error");
    }
  }

  // --- USER HANDLERS ---
  async function handleUserRoleToggle(targetUserId: string, currentRole: string) {
    if (!userId) return;
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Change user role to ${newRole.toUpperCase()}?`)) return;
    const res = await updateUserRole(targetUserId, userId, newRole);
    if (res.success) {
      showFeedback(`User role updated to ${newRole}.`);
      fetchUsers();
    } else {
      showFeedback(res.error || "Failed to update user role.", "error");
    }
  }

  async function handleUserDelete(targetUserId: string, email: string) {
    if (!userId) return;
    if (!confirm(`Are you sure you want to permanently delete user (${email})?`)) return;
    const res = await deleteUserAdmin(targetUserId, userId);
    if (res.success) {
      showFeedback("User deleted successfully.");
      fetchUsers();
      const statsRes = await getAdminStats(userId);
      if (statsRes.stats) setStats(statsRes.stats);
    } else {
      showFeedback(res.error || "Failed to delete user.", "error");
    }
  }

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#e9e3e6] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-[#232c33] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[#232c33] font-bold text-sm">Loading Admin Dashboard...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#e9e3e6] py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#232c33] text-white">
                Admin Mode
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#232c33] tracking-tight">
              Platform Administration
            </h1>
            <p className="text-[#9a8f97] text-sm font-semibold mt-1">
              Approve car listings, moderate reviews, and manage platform user accounts.
            </p>
          </div>

          <button
            onClick={loadData}
            className="btn-secondary px-4 py-2.5 text-xs font-bold inline-flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <ArrowRotateLeft width={16} height={16} />
            Refresh Data
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-xl border text-sm font-bold shadow-sm transition ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-red-50 text-red-800 border-red-300"
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-[#b2b2b2] rounded-2xl p-6 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[#9a8f97] text-xs font-bold uppercase tracking-wider">Vehicle Listings</p>
              <h3 className="text-3xl font-black text-[#232c33] mt-1">{stats?.totalCars || 0}</h3>
              {stats && stats.pendingCars > 0 && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {stats.pendingCars} Pending Approval
                </span>
              )}
            </div>
            <div className="p-3 bg-[#232c33] text-white rounded-xl">
              <Car width={24} height={24} />
            </div>
          </div>

          <div className="bg-white border border-[#b2b2b2] rounded-2xl p-6 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[#9a8f97] text-xs font-bold uppercase tracking-wider">Reviews Submitted</p>
              <h3 className="text-3xl font-black text-[#232c33] mt-1">{stats?.totalReviews || 0}</h3>
              {stats && stats.pendingReviews > 0 && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {stats.pendingReviews} Pending Approval
                </span>
              )}
            </div>
            <div className="p-3 bg-[#232c33] text-white rounded-xl">
              <Star width={24} height={24} />
            </div>
          </div>

          <div className="bg-white border border-[#b2b2b2] rounded-2xl p-6 shadow-md flex items-center justify-between">
            <div>
              <p className="text-[#9a8f97] text-xs font-bold uppercase tracking-wider">Registered Users</p>
              <h3 className="text-3xl font-black text-[#232c33] mt-1">{stats?.totalUsers || 0}</h3>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#e9e3e6] text-[#232c33] border border-[#b2b2b2]">
                Active Accounts
              </span>
            </div>
            <div className="p-3 bg-[#232c33] text-white rounded-xl">
              <Persons width={24} height={24} />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#b2b2b2] mb-8 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "overview"
                ? "border-[#232c33] text-[#232c33] bg-white/50 rounded-t-xl"
                : "border-transparent text-[#9a8f97] hover:text-[#232c33]"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab("cars")}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "cars"
                ? "border-[#232c33] text-[#232c33] bg-white/50 rounded-t-xl"
                : "border-transparent text-[#9a8f97] hover:text-[#232c33]"
            }`}
          >
            🚘 Cars Moderation
            {stats && stats.pendingCars > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white font-black">
                {stats.pendingCars}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === "reviews"
                ? "border-[#232c33] text-[#232c33] bg-white/50 rounded-t-xl"
                : "border-transparent text-[#9a8f97] hover:text-[#232c33]"
            }`}
          >
            ⭐ Reviews Moderation
            {stats && stats.pendingReviews > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white font-black">
                {stats.pendingReviews}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-3 text-sm font-bold border-b-2 transition cursor-pointer whitespace-nowrap ${
              activeTab === "users"
                ? "border-[#232c33] text-[#232c33] bg-white/50 rounded-t-xl"
                : "border-transparent text-[#9a8f97] hover:text-[#232c33]"
            }`}
          >
            👤 User Accounts
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white border border-[#b2b2b2] rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-[#232c33] mb-4 flex items-center gap-2">
                <ShieldCheck width={20} height={20} />
                Quick Admin Actions & Moderation Status
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#b2b2b2] bg-[#e9e3e6]/40 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#232c33] text-base">Vehicle Moderation</h3>
                    <p className="text-xs text-[#9a8f97] mt-1 font-medium">
                      User listings are held in pending status until approved by an admin.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setCarFilter("pending");
                      setActiveTab("cars");
                      fetchCars("pending");
                    }}
                    className="btn-primary py-2 px-4 text-xs font-bold self-start cursor-pointer"
                  >
                    Review Pending Cars ({stats?.pendingCars || 0})
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-[#b2b2b2] bg-[#e9e3e6]/40 flex flex-col justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-[#232c33] text-base">Reviews Moderation</h3>
                    <p className="text-xs text-[#9a8f97] mt-1 font-medium">
                      Platform and car reviews require admin approval before going public.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setReviewFilter("pending");
                      setActiveTab("reviews");
                      fetchReviews("pending");
                    }}
                    className="btn-primary py-2 px-4 text-xs font-bold self-start cursor-pointer"
                  >
                    Review Pending Reviews ({stats?.pendingReviews || 0})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CARS MODERATION */}
        {activeTab === "cars" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-[#232c33]">Vehicle Listings Moderation</h2>

              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setCarFilter(status);
                      fetchCars(status);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                      carFilter === status
                        ? "bg-[#232c33] text-white"
                        : "bg-white border border-[#b2b2b2] text-[#232c33] hover:bg-[#e9e3e6]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {loadingCars ? (
              <div className="text-center py-12">
                <p className="text-[#9a8f97] font-semibold text-sm">Loading car listings...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="bg-white border border-[#b2b2b2] rounded-2xl p-10 text-center shadow-sm">
                <p className="text-[#232c33] font-bold">No car listings found for filter "{carFilter}".</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cars.map((car) => (
                  <div
                    key={car._id}
                    className="bg-white border border-[#b2b2b2] rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={car.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341"}
                        alt={car.title}
                        className="w-20 h-16 object-cover rounded-xl border border-[#b2b2b2] flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-[#232c33] text-base">{car.title}</h3>
                          {car.approvalStatus === "pending" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                              Pending Approval
                            </span>
                          )}
                          {car.approvalStatus === "approved" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Approved
                            </span>
                          )}
                          {car.approvalStatus === "rejected" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-800 border border-red-300">
                              Rejected
                            </span>
                          )}
                          {car.isSold && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-slate-200 text-slate-800 border border-slate-400">
                              SOLD OUT
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9a8f97] font-medium mt-1">
                          ৳{car.price?.toLocaleString("en-BD")} • {car.category} • {car.transmission} • {car.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-[#c3baba]">
                      {car.approvalStatus !== "approved" && (
                        <button
                          onClick={() => handleCarApproval(car._id, "approved")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check width={14} height={14} /> Accept / Approve
                        </button>
                      )}
                      {car.approvalStatus !== "rejected" && (
                        <button
                          onClick={() => handleCarApproval(car._id, "rejected")}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                      <Link
                        href={`/cars/${car._id}/edit`}
                        className="px-3 py-1.5 rounded-xl border border-[#b2b2b2] hover:bg-[#e9e3e6] text-[#232c33] text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Pencil width={14} height={14} /> Edit
                      </Link>
                      <button
                        onClick={() => handleCarDelete(car._id, car.title)}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <TrashBin width={14} height={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REVIEWS MODERATION */}
        {activeTab === "reviews" && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-[#232c33]">Reviews & Testimonials Moderation</h2>

              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setReviewFilter(status);
                      fetchReviews(status);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                      reviewFilter === status
                        ? "bg-[#232c33] text-white"
                        : "bg-white border border-[#b2b2b2] text-[#232c33] hover:bg-[#e9e3e6]"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {loadingReviews ? (
              <div className="text-center py-12">
                <p className="text-[#9a8f97] font-semibold text-sm">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white border border-[#b2b2b2] rounded-2xl p-10 text-center shadow-sm">
                <p className="text-[#232c33] font-bold">No reviews found for filter "{reviewFilter}".</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="bg-white border border-[#b2b2b2] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-bold text-[#232c33] text-sm">{rev.userName}</span>
                        <span className="text-xs text-[#9a8f97] font-semibold">({rev.userRole})</span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-[#232c33] text-white">
                          {rev.type === "platform" ? "Platform Review" : `Car: ${rev.carTitle || rev.carId}`}
                        </span>

                        {rev.approvalStatus === "pending" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                            Pending Approval
                          </span>
                        )}
                        {rev.approvalStatus === "approved" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                            Approved
                          </span>
                        )}
                        {rev.approvalStatus === "rejected" && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-800 border border-red-300">
                            Rejected
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                          <Star key={i} width={14} height={14} fill="currentColor" />
                        ))}
                      </div>

                      <p className="text-sm text-[#232c33] italic bg-[#e9e3e6]/40 p-3 rounded-xl border border-[#b2b2b2]/40">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap self-end md:self-auto border-t md:border-t-0 pt-3 md:pt-0 border-[#c3baba] w-full md:w-auto justify-end">
                      {rev.approvalStatus !== "approved" && (
                        <button
                          onClick={() => handleReviewApproval(rev._id, "approved")}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Check width={14} height={14} /> Accept / Approve
                        </button>
                      )}
                      {rev.approvalStatus !== "rejected" && (
                        <button
                          onClick={() => handleReviewApproval(rev._id, "rejected")}
                          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => handleReviewDelete(rev._id)}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <TrashBin width={14} height={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: USERS MANAGEMENT */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-[#232c33]">Registered Users Directory</h2>
            </div>

            {loadingUsers ? (
              <div className="text-center py-12">
                <p className="text-[#9a8f97] font-semibold text-sm">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="bg-white border border-[#b2b2b2] rounded-2xl p-10 text-center shadow-sm">
                <p className="text-[#232c33] font-bold">No registered users found.</p>
              </div>
            ) : (
              <div className="bg-white border border-[#b2b2b2] rounded-2xl overflow-hidden shadow-md">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#232c33] text-white text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Joined Date</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#c3baba]">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-[#e9e3e6]/30 transition">
                          <td className="px-6 py-4 font-bold text-[#232c33] flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#232c33] text-white flex items-center justify-center font-black text-xs uppercase">
                              {u.name?.slice(0, 2) || "US"}
                            </div>
                            {u.name}
                          </td>
                          <td className="px-6 py-4 text-[#232c33]/80 font-medium">{u.email}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${
                                u.role === "admin"
                                  ? "bg-purple-100 text-purple-900 border border-purple-300"
                                  : "bg-[#e9e3e6] text-[#232c33] border border-[#b2b2b2]"
                              }`}
                            >
                              {u.role || "user"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-[#9a8f97] font-semibold">
                            {new Date(u.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUserRoleToggle(u._id, u.role)}
                                className="px-3 py-1.5 rounded-xl border border-[#b2b2b2] hover:bg-[#e9e3e6] text-[#232c33] text-xs font-bold transition cursor-pointer"
                              >
                                Make {u.role === "admin" ? "User" : "Admin"}
                              </button>
                              {u._id !== userId && (
                                <button
                                  onClick={() => handleUserDelete(u._id, u.email)}
                                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <TrashBin width={14} height={14} /> Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
