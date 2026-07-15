const stats = [
  { value: "500+", label: "Active listings" },
  { value: "1,200+", label: "Happy users" },
  { value: "8", label: "Cities covered" },
  { value: "4.7★", label: "Average rating" },
];

export default function Stats() {
  return (
    <section className="py-16 px-4 bg-neutral-900/40 border-y border-neutral-800">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-3xl md:text-4xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-neutral-400 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}