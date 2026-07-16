"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getCarById, getAllCars } from "@/lib/api/cars";
import { getReviewsByCarId } from "@/lib/api/reviews";
import ReviewForm from "@/components/ReviewForm";
import type { Car } from "@/types/Car";
import type { Review } from "@/types/Review";

interface CarDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default function CarDetailsPage({ params }: CarDetailsPageProps) {
    const [car, setCar] = useState<Car | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [relatedCars, setRelatedCars] = useState<Car[]>([]);
    const [activeImage, setActiveImage] = useState(0);
    const [id, setId] = useState<string>("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { id: carId } = await params;
            setId(carId);

            const carData = await getCarById(carId);
            if (!carData) {
                notFound();
                return;
            }
            setCar(carData);

            const reviewData = await getReviewsByCarId(carId);
            setReviews(reviewData);

            const allCars = await getAllCars();
            const related = allCars
                .filter((c) => c.category === carData.category && c._id?.toString() !== carData._id?.toString())
                .slice(0, 4);
            setRelatedCars(related);

            setLoading(false);
        }
        load();
    }, [params]);

    if (loading || !car) {
        return <div className="mx-auto max-w-5xl px-4 py-12 text-neutral-400">Loading...</div>;
    }

    const images = [car.image, ...(car.images || [])].filter(Boolean);

    return (
        <div className="mx-auto max-w-5xl px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {/* Main image */}
                    <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900/40 h-80 mb-3">
                        {images.length > 0 ? (
                            <img
                                src={images[activeImage]}
                                alt={car.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-neutral-600">
                                No image
                            </div>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {images.length > 1 && (
                        <div className="flex gap-2">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(i)}
                                    className={`h-16 w-20 rounded-lg overflow-hidden border-2 transition ${activeImage === i ? "border-neutral-300" : "border-transparent opacity-60"
                                        }`}
                                >
                                    <img src={img} alt={`${car.title} ${i + 1}`} className="h-full w-full object-cover" />
                                </button>
                            ))}
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