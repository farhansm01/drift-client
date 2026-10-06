"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { getCarById, getAllCars } from "@/lib/api/cars";
import { getReviewsByCarId } from "@/lib/api/reviews";
import ReviewForm from "@/components/ReviewForm";
import CarCard from "@/components/CarCard";
import type { Car } from "@/types/Car";
import type { Review } from "@/types/Review";
import { useUserRole } from "@/hooks/useUserRole";

interface CarDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default function CarDetailsPage({ params }: CarDetailsPageProps) {
    const { session, isAdmin } = useUserRole();
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
        return <div className="mx-auto max-w-5xl px-4 py-12 text-[#232c33] font-bold">Loading car details...</div>;
    }

    const images = [car.image, ...(car.images || [])].filter(Boolean);
    const isSold = Boolean(car.isSold || car.status === "sold");
    const isOwner = session?.user?.id === car.createdBy;

    return (
        <div className="mx-auto max-w-5xl px-4 py-12 bg-[#e9e3e6]">
            {/* Owner/Admin Action Bar & Sold Out Banner */}
            {isSold && (
                <div className="mb-6 rounded-2xl bg-red-600 text-white p-4 font-black text-center text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2">
                    <span className="text-xl">⚠️</span> THIS VEHICLE HAS BEEN MARKED AS SOLD OUT
                </div>
            )}

            {(isOwner || isAdmin) && (
                <div className="mb-6 rounded-2xl border border-[#b2b2b2] bg-white p-4 shadow-md flex items-center justify-between">
                    <span className="text-xs font-bold text-[#232c33]">
                        {isOwner ? "You own this listing" : "Admin Management Controls"}
                    </span>
                    <Link
                        href={`/cars/${id}/edit`}
                        className="btn-primary rounded-xl px-5 py-2 text-xs font-bold shadow-md"
                    >
                        Edit Listing Details
                    </Link>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    {/* Main image */}
                    <div className="rounded-2xl overflow-hidden border border-[#b2b2b2] bg-white h-80 mb-3 shadow-md relative">
                        {images.length > 0 ? (
                            <img
                                src={images[activeImage]}
                                alt={car.title}
                                className={`h-full w-full object-cover ${isSold ? "grayscale-[30%]" : ""}`}
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-[#9a8f97] text-sm">
                                No image available
                            </div>
                        )}
                        {isSold && (
                            <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-red-600 text-white shadow-xl border border-red-500">
                                SOLD OUT
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
                                    className={`h-16 w-20 rounded-xl overflow-hidden border-2 transition ${activeImage === i ? "border-[#232c33] shadow-md" : "border-[#b2b2b2] opacity-70"
                                        }`}
                                >
                                    <img src={img} alt={`${car.title} ${i + 1}`} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs uppercase font-extrabold tracking-wider text-white bg-[#232c33] px-3 py-1 rounded-full inline-block">
                                {car.category}
                            </span>
                            {isSold && (
                                <span className="text-xs uppercase font-extrabold tracking-wider text-white bg-red-600 px-3 py-1 rounded-full inline-block">
                                    SOLD OUT
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl font-black text-[#232c33] tracking-tight">{car.title}</h1>
                        <p className="text-[#9a8f97] text-sm mt-1.5 font-semibold">{car.shortDescription}</p>

                        <div className="mt-5">
                            <span className={`text-4xl font-black tracking-tight ${isSold ? "text-neutral-500 line-through" : "text-[#232c33]"}`}>
                                ৳{car.price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-[#b2b2b2] bg-white p-5 shadow-md">
                        {isSold ? (
                            <div>
                                <p className="text-xs uppercase font-bold tracking-wider text-red-600 mb-1">Status</p>
                                <p className="text-[#232c33] text-sm font-bold">This car has been marked as SOLD OUT by the owner.</p>
                            </div>
                        ) : (
                            <div>
                                <p className="text-xs uppercase font-bold tracking-wider text-[#9a8f97] mb-1">Contact Seller Directly</p>
                                <p className="text-[#232c33] text-base font-bold">{car.contactInfo}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-12 rounded-2xl border border-[#b2b2b2] bg-white p-6 shadow-md">
                <h2 className="text-xl font-black text-[#232c33] mb-3">Vehicle Overview</h2>
                <p className="text-[#232c33]/80 text-sm leading-relaxed font-normal">{car.fullDescription}</p>
            </div>

            <div className="mt-10">
                <h2 className="text-xl font-black text-[#232c33] mb-4">Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="rounded-xl border border-[#b2b2b2] bg-white p-3.5 shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-[#9a8f97]">Category</p>
                        <p className="text-sm font-bold text-[#232c33] mt-0.5">{car.category}</p>
                    </div>
                    <div className="rounded-xl border border-[#b2b2b2] bg-white p-3.5 shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-[#9a8f97]">Seats</p>
                        <p className="text-sm font-bold text-[#232c33] mt-0.5">{car.seats}</p>
                    </div>
                    <div className="rounded-xl border border-[#b2b2b2] bg-white p-3.5 shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-[#9a8f97]">Transmission</p>
                        <p className="text-sm font-bold text-[#232c33] mt-0.5">{car.transmission}</p>
                    </div>
                    <div className="rounded-xl border border-[#b2b2b2] bg-white p-3.5 shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-[#9a8f97]">Fuel Type</p>
                        <p className="text-sm font-bold text-[#232c33] mt-0.5">{car.fuelType}</p>
                    </div>
                    <div className="rounded-xl border border-[#b2b2b2] bg-white p-3.5 shadow-sm">
                        <p className="text-[10px] uppercase font-bold text-[#9a8f97]">Location</p>
                        <p className="text-sm font-bold text-[#232c33] mt-0.5">{car.location}</p>
                    </div>
                </div>
            </div>

            <div className="mt-12 rounded-2xl border border-[#b2b2b2] bg-white p-6 shadow-md">
                <h2 className="text-xl font-black text-[#232c33] mb-4">Vehicle Reviews</h2>
                {reviews.length === 0 ? (
                    <p className="text-[#9a8f97] text-sm font-medium">No reviews yet for this car. Be the first to leave one below!</p>
                ) : (
                    <div className="space-y-3 mb-6">
                        {reviews.map((review) => (
                            <div
                                key={review._id?.toString()}
                                className="rounded-xl border border-[#c3baba] bg-[#e9e3e6]/40 p-4 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-[#232c33] font-bold">{review.userName}</span>
                                    <span className="text-xs text-amber-500 font-bold">
                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                    </span>
                                </div>
                                <p className="text-xs text-[#232c33]/80 font-medium">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                {!isAdmin && <ReviewForm carId={id} carOwnerId={car.createdBy} />}
            </div>

            {relatedCars.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl font-black text-[#232c33] mb-4">Related Cars</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedCars.map((related) => (
                            <CarCard key={related._id?.toString()} car={related} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}