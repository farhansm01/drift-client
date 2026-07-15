const testimonials = [
  { name: "Rahim Ahmed", text: "Sold my Corolla within a week. Buyer messaged me straight from the listing.", role: "Seller, Dhanmondi" },
  { name: "Nusrat Jahan", text: "Found a well-priced Vezel with real photos and honest description. Smooth process.", role: "Buyer, Gulshan" },
  { name: "Tanvir Hasan", text: "No commission, no middleman — just me and the buyer working out a fair price.", role: "Seller, Uttara" },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-2">
          What People Are Saying
        </h2>
        <p className="text-neutral-400 text-center mb-12">
          Real experiences from Drift users.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg p-6"
            >
              <p className="text-neutral-300 text-sm mb-4">&quote;{t.text}&quote;</p>
              <p className="text-white font-medium text-sm">{t.name}</p>
              <p className="text-neutral-500 text-xs">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}