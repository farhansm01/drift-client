import { notFound } from "next/navigation";
import Link from "next/link";
import { getCarById, getAllCars } from "@/lib/api/cars";
import { getReviewsByCarId } from "@/lib/api/reviews";
import ReviewForm from "@/components/ReviewForm";

interface CarDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default async function CarDetailsPage({ params }: CarDetailsPageProps) {
    const { id } = await params;
    const car = await getCarById(id);
    const reviews = await getReviewsByCarId(id);

    if (!car) {
        notFound();
    }

    const allCars = await getAllCars();
    const relatedCars = allCars
        .filter((c) => c.category === car.category && c._id?.toString() !== car._id?.toString())
        .slice(0, 4);

    return (
        <div className="mx-auto max-w-5xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/40 h-80">
                    {car.image ? (
                        <img src={car.image} alt={car.title} className="h-full w-full object-cover" />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-neutral-600">
                            No image
                        </div>
                    )}
                </div>

                <div className="flex flex-col">
                    <h1 className="text-2xl font-semibold text-white">{car.title}</h1>
                    <p className="text-neutral-400 text-sm mt-1">{car.shortDescription}</p>

                    <div className="mt-4">
                        <span className="text-3xl font-semibold text-white">
                            ৳{car.price.toLocaleString()}
                        </span>
                    </div>

                    <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
                        <p className="text-sm text-neutral-400 mb-1">Contact seller</p>
                        <p className="text-white text-sm">{car.contactInfo}</p>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-semibold text-white mb-2">Overview</h2>
                <p className="text-neutral-400 text-sm leading-relaxed">{car.fullDescription}</p>
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-semibold text-white mb-4">Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
                        <p className="text-xs text-neutral-500">Category</p>
                        <p className="text-sm text-white mt-1">{car.category}</p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
                        <p className="text-xs text-neutral-500">Seats</p>
                        <p className="text-sm text-white mt-1">{car.seats}</p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
                        <p className="text-xs text-neutral-500">Transmission</p>
                        <p className="text-sm text-white mt-1">{car.transmission}</p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
                        <p className="text-xs text-neutral-500">Fuel Type</p>
                        <p className="text-sm text-white mt-1">{car.fuelType}</p>
                    </div>
                    <div className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-3">
                        <p className="text-xs text-neutral-500">Location</p>
                        <p className="text-sm text-white mt-1">{car.location}</p>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-lg font-semibold text-white mb-4">Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="text-neutral-400 text-sm">No reviews yet for this car.</p>
                ) : (
                    <div className="space-y-3">
                        {reviews.map((review) => (
                            <div
                                key={review._id?.toString()}
                                className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-white font-medium">{review.userName}</span>
                                    <span className="text-xs text-neutral-500">
                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-400">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                <ReviewForm carId={id} />
            </div>

            {relatedCars.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-lg font-semibold text-white mb-4">Related Cars</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {relatedCars.map((related) => (
                            <Link
                                key={related._id?.toString()}
                                href={`/cars/${related._id}`}
                                className="rounded-xl border border-neutral-800 bg-neutral-900/40 overflow-hidden hover:border-neutral-700 transition"
                            >
                                <div className="h-32 w-full bg-neutral-800">
                                    {related.image && (
                                        <img src={related.image} alt={related.title} className="h-full w-full object-cover" />
                                    )}
                                </div>
                                <div className="p-3">
                                    <p className="text-sm text-white line-clamp-1">{related.title}</p>
                                    <p className="text-xs text-neutral-400 mt-1">৳{related.price.toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}