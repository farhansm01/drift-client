const testimonials = [
  { name: "Rahim Ahmed", text: "Sold my Corolla within a week. Buyer messaged me straight from the listing.", role: "Seller, Dhanmondi" },
  { name: "Nusrat Jahan", text: "Found a well-priced Vezel with real photos and honest description. Smooth process.", role: "Buyer, Gulshan" },
  { name: "Tanvir Hasan", text: "No commission, no middleman — just me and the buyer working out a fair price.", role: "Seller, Uttara" },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-[#050b14] border-t border-blue-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold block mb-1">
            Community Feedback
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            What People Are Saying
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Real experiences from real buyers and sellers on Drift.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-blue-900/40 bg-[#09111e]/70 backdrop-blur-lg p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/40 transition duration-300 flex flex-col justify-between"
            >
              <p className="text-slate-300 text-sm mb-6 leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
              <div className="pt-4 border-t border-blue-900/30">
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-blue-400 text-xs font-medium mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}