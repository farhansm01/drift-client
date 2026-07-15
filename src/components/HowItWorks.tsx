const steps = [
  { number: "01", title: "Browse listings", desc: "Explore verified car listings from real sellers across Dhaka." },
  { number: "02", title: "Contact the seller", desc: "Found a match? Reach out directly using the contact info on the listing." },
  { number: "03", title: "Meet & inspect", desc: "Arrange a viewing, take it for a spin, and check the car in person." },
  { number: "04", title: "Close the deal", desc: "Agree on price and paperwork directly with the seller — no middleman." },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-2">
          How It Works
        </h2>
        <p className="text-neutral-400 text-center mb-12">
          From browsing to driving — four simple steps.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg p-6"
            >
              <span className="text-3xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-500 bg-clip-text text-transparent">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold text-white mt-3 mb-2">{step.title}</h3>
              <p className="text-sm text-neutral-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}