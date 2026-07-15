import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-semibold text-white sm:text-5xl">
        Drive further, worry less.
      </h1>
      <p className="mt-4 max-w-md text-neutral-400">
        Drift connects you with cars ready to rent — browse listings, book
        instantly, or list your own car in minutes.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/cars"
          className="metallic-button rounded-lg px-6 py-2.5 text-sm font-medium text-neutral-900 hover:opacity-90 transition"
        >
          Browse Cars
        </Link>
        <Link
          href="/register"
          className="rounded-lg border border-neutral-700 px-6 py-2.5 text-sm text-neutral-200 hover:bg-neutral-800 transition"
        >
          List Your Car
        </Link>
      </div>
    </div>
  );
}