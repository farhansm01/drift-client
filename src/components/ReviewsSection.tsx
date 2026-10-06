import Link from "next/link";
import { getAllReviews } from "@/lib/api/reviews";
import { StarFill } from "@gravity-ui/icons";

export default async function ReviewsSection() {
  const reviews = await getAllReviews();

  return (
    <section className="py-20 px-4 bg-[#e9e3e6] border-t border-[#b2b2b2]/40 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#9a8f97] font-bold block mb-1">
            Real Experience
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#232c33]">
            Community <span className="text-[#9a8f97]">Reviews</span>
          </h2>
          <p className="text-[#232c33]/70 text-sm mt-2 font-medium">
            Verified feedback from real car buyers and sellers in Dhaka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={review._id?.toString() || idx}
              className="rounded-2xl border border-[#b2b2b2] bg-white backdrop-blur-xl p-6 hover:border-[#232c33] hover:shadow-xl transition duration-300 group shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Header: User Info & Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {review.userAvatar ? (
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-11 h-11 rounded-full object-cover border border-[#c3baba] shadow-sm"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#232c33] text-white border border-[#232c33] flex items-center justify-center font-bold text-sm shadow-sm">
                        {review.userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-[#232c33] font-bold text-base group-hover:text-[#9a8f97] transition">
                        {review.userName}
                      </h3>
                      {review.userRole && (
                        <span className="text-[10px] font-semibold text-white bg-[#232c33] px-2 py-0.5 rounded-full inline-block mt-0.5">
                          {review.userRole}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 bg-[#e9e3e6] border border-[#b2b2b2]/60 px-2.5 py-1 rounded-full">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarFill
                        key={i}
                        width={14}
                        height={14}
                        className={
                          i < review.rating ? "text-amber-500" : "text-[#c3baba]"
                        }
                      />
                    ))}
                    <span className="text-xs font-bold text-[#232c33] ml-1">
                      {review.rating}.0
                    </span>
                  </div>
                </div>

                {/* Car Tag */}
                {review.carTitle && (
                  <div className="mb-3 text-xs text-[#232c33] font-semibold flex items-center gap-1.5 bg-[#e9e3e6] border border-[#b2b2b2]/60 px-3 py-1 rounded-lg w-fit">
                    <span>🚗</span> {review.carTitle}
                  </div>
                )}

                {/* Comment Text */}
                <p className="text-xs sm:text-sm text-[#232c33]/80 leading-relaxed font-normal italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              {/* Timestamp */}
              <div className="mt-4 pt-3 border-t border-[#c3baba]/60 text-[10px] text-[#9a8f97] font-medium">
                Verified Drift Listing • {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA to Write a Review on a Car Page */}
        <div className="mt-12 text-center">
          <Link
            href="/cars"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-xs font-bold shadow-md"
          >
            Explore Vehicles & Write a Review &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
