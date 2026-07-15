import Link from "next/link";

const categories = [
  { name: "Sedan", desc: "Comfortable daily drivers" },
  { name: "SUV", desc: "Space and power combined" },
  { name: "Hatchback", desc: "Compact and city-friendly" },
  { name: "Luxury", desc: "Premium rides, top condition" },
  { name: "Van", desc: "Room for family or cargo" },
];

export default function Categories() {
  return (
    <section className="py-20 px-4 bg-neutral-900/40">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-2">
          Browse by Category
        </h2>
        <p className="text-neutral-400 text-center mb-12">
          Find exactly the type of car you&apos;re after.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/cars?category=${cat.name}`}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg p-6 text-center hover:border-neutral-600 transition"
            >
              <h3 className="text-white font-semibold mb-1">{cat.name}</h3>
              <p className="text-xs text-neutral-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}