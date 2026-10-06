"use client";

import { useState } from "react";
import Link from "next/link";
import { Envelope, Handset, Car, StarFill } from "@gravity-ui/icons";
import { FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import PlatformReviewModal from "@/components/PlatformReviewModal";
import { useUserRole } from "@/hooks/useUserRole";

export default function Footer() {
    const year = new Date().getFullYear();
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const { isAdmin } = useUserRole();

    return (
        <>
            <footer className="border-t border-[#343e47] bg-[#232c33] text-white">
                <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
                    <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                        <div>
                            <Link href="/" className="flex items-center gap-2.5 text-white font-bold text-xl tracking-tight mb-3 group">
                                <div className="p-2 rounded-xl bg-[#9a8f97] text-white transition shadow-md">
                                    <Car width={22} height={22} />
                                </div>
                                <span className="font-black tracking-widest text-2xl text-white">
                                    DRIFT
                                </span>
                            </Link>
                            <p className="text-xs text-[#c3baba] max-w-xs leading-relaxed font-normal mb-4">
                                Drive further, worry less. Dhaka&apos;s direct car marketplace connecting buyers & sellers directly.
                            </p>
                            {!isAdmin && (
                                <button
                                    onClick={() => setReviewModalOpen(true)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#9a8f97] hover:bg-white hover:text-[#232c33] transition shadow-sm cursor-pointer"
                                >
                                    <StarFill width={12} height={12} className="text-amber-300" />
                                    Review Drift Platform
                                </button>
                            )}
                        </div>

                        <div>
                            <h3 className="text-xs uppercase font-bold tracking-widest text-[#9a8f97] mb-3">Explore</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/cars" className="text-sm text-[#e9e3e6]/80 hover:text-white font-medium transition">
                                        Browse Cars
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="text-sm text-[#e9e3e6]/80 hover:text-white font-medium transition">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-sm text-[#e9e3e6]/80 hover:text-white font-medium transition">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase font-bold tracking-widest text-[#9a8f97] mb-3">Account</h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href="/login" className="text-sm text-[#e9e3e6]/80 hover:text-white font-medium transition">
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/register" className="text-sm text-[#e9e3e6]/80 hover:text-white font-medium transition">
                                        Register
                                    </Link>
                                </li>
                                {!isAdmin && (
                                    <li>
                                        <Link href="/cars/add" className="text-sm text-[#e9e3e6]/80 hover:text-white font-medium transition">
                                            List Your Car
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase font-bold tracking-widest text-[#9a8f97] mb-3">Contact & Support</h3>
                            <ul className="space-y-2.5">
                                <li className="flex items-center gap-2 text-sm text-[#e9e3e6]/80">
                                    <Envelope width={16} height={16} className="text-[#9a8f97] shrink-0" />
                                    <a href="mailto:hello@drift.app" className="hover:text-white transition">
                                        hello@drift.app
                                    </a>
                                </li>
                                <li className="flex items-center gap-2 text-sm text-[#e9e3e6]/80">
                                    <Handset width={16} height={16} className="text-[#9a8f97] shrink-0" />
                                    <a href="tel:+8801234567890" className="hover:text-white transition">
                                        +880 1234-567890
                                    </a>
                                </li>
                            </ul>

                            <div className="flex gap-3 mt-4 items-center">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-[#343e47] border border-[#9a8f97]/40 text-white hover:bg-[#9a8f97] transition"
                                    aria-label="Facebook"
                                >
                                    <FaFacebook size={16} />
                                </a>

                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-[#343e47] border border-[#9a8f97]/40 text-white hover:bg-[#9a8f97] transition"
                                    aria-label="Twitter"
                                >
                                    <FaXTwitter size={16} />
                                </a>

                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-lg bg-[#343e47] border border-[#9a8f97]/40 text-white hover:bg-[#9a8f97] transition"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-[#343e47] pt-6 text-center text-xs text-[#9a8f97] font-medium">
                        © {year} DRIFT Marketplace. All rights reserved.
                    </div>
                </div>
            </footer>

            {!isAdmin && (
                <PlatformReviewModal
                    isOpen={reviewModalOpen}
                    onClose={() => setReviewModalOpen(false)}
                />
            )}
        </>
    );
}