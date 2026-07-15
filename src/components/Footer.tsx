import Link from "next/link";
import { Envelope, Handset, Car } from "@gravity-ui/icons";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-neutral-800 bg-neutral-950/70 backdrop-blur-lg">
            <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    <div>
                        <Link href="/" className="flex items-center gap-2 text-white font-semibold text-lg mb-3">
                            <Car width={22} height={22} />
                            Drift
                        </Link>
                        <p className="text-sm text-neutral-400 max-w-xs">
                            Drive further, worry less. Find and list cars for sale, hassle-free.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-white mb-3">Explore</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/cars" className="text-sm text-neutral-400 hover:text-white transition">
                                    Browse Cars
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-neutral-400 hover:text-white transition">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-neutral-400 hover:text-white transition">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-white mb-3">Account</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="text-sm text-neutral-400 hover:text-white transition">
                                    Register
                                </Link>
                            </li>
                            <li>
                                <Link href="/cars/add" className="text-sm text-neutral-400 hover:text-white transition">
                                    List Your Car
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-white mb-3">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm text-neutral-400">
                                <Envelope width={16} height={16} />
                                <a href="mailto:hello@drift.app" className="hover:text-white transition">
                                    hello@drift.app
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-sm text-neutral-400">
                                <Handset width={16} height={16} />
                                <a href="tel:+8801234567890" className="hover:text-white transition">
                                    +880 1234-567890
                                </a>
                            </li>
                        </ul>

                        <div className="flex gap-4 mt-4">

                            <a href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-neutral-400 hover:text-white transition"
                            >
                                Facebook
                            </a>

                            <a href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-neutral-400 hover:text-white transition"
                            >
                                Twitter
                            </a>

                            <a href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-neutral-400 hover:text-white transition"
                            >
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-10 border-t border-neutral-800 pt-6 text-center text-xs text-neutral-500">
                    © {year} Drift. All rights reserved.
                </div>
            </div>
        </footer >
    );
}