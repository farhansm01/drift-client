const steps = [
  {
    number: "01",
    title: "Discover or List",
    desc: "Browse verified local car listings or post your vehicle in 2 minutes for free.",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "02",
    title: "Direct Contact",
    desc: "Connect directly with real buyers or sellers — no middleman, zero commission.",
    image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "03",
    title: "Meet & Inspect",
    desc: "Arrange a viewing in Dhaka, check vehicle paperwork, and take a test drive.",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
  {
    number: "04",
    title: "Close the Deal",
    desc: "Agree on final price and complete ownership transfer directly.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?fm=jpg&q=80&w=800&auto=format&fit=crop",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-[#e9e3e6] border-t border-[#b2b2b2]/40 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#9a8f97] font-bold block mb-1">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#232c33]">
            How <span className="text-[#9a8f97]">It Works</span>
          </h2>
          <p className="text-[#232c33]/70 text-sm mt-2 font-medium">
            Four simple steps for both car buyers and sellers in Dhaka.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-[#b2b2b2] bg-white/90 backdrop-blur-xl overflow-hidden hover:border-[#232c33] hover:shadow-xl transition duration-500 group flex flex-col justify-between"
            >
              {/* Step Image Header */}
              <div className="h-44 w-full relative overflow-hidden bg-[#c3baba]/40">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  style={{ backgroundImage: `url('${step.image}')` }}
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
                
                {/* Number Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl text-sm font-black text-white bg-[#232c33] shadow-md">
                  {step.number}
                </div>
              </div>

              {/* Step Description */}
              <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h3 className="text-lg font-bold text-[#232c33] mb-2 group-hover:text-[#9a8f97] transition">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#232c33]/70 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
