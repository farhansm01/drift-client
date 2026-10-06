const stats = [
  { value: "16+", label: "Cars listed" },
  { value: "5", label: "Categories" },
  { value: "100%", label: "Direct contact, no middleman" },
  { value: "৳0", label: "Commission fees" },
];

export default function Stats() {
  return (
    <section className="py-16 px-4 bg-[#070e1b] border-y border-blue-900/40">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-3xl md:text-5xl font-black text-blue-300 blue-glow-text tracking-tight">{s.value}</p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


