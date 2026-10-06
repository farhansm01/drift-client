import React from "react";

export default function EnvironmentalImpact() {
  const impactCards = [
    {
      icon: (
        <svg
          className="w-6 h-6 text-[#232c33]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V11.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 5H7a2 2 0 00-2 2v1.935z"
          />
        </svg>
      ),
      stat: "~5.8 Tons",
      title: "CO₂ Saved Per Vehicle",
      description:
        "Manufacturing a new automobile creates immense carbon emissions. Reusing quality pre-owned vehicles keeps embodied carbon in active circulation.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-[#232c33]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      stat: "40%+ Listings",
      title: "Hybrid & EV Focus",
      description:
        "We actively highlight hybrid and zero-emission electric vehicles, accelerating Dhaka's transition toward clean urban transit.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-[#232c33]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      ),
      stat: "Circular Economy",
      title: "Zero Waste Automotive",
      description:
        "Extending auto lifecycles prevents premature scrapping and reduces industrial waste, nurturing a sustainable circular economy.",
    },
    {
      icon: (
        <svg
          className="w-6 h-6 text-[#232c33]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      stat: "Direct Transit",
      title: "Zero Middleman Transport",
      description:
        "Direct buyer-to-seller connections eliminate unnecessary transport to dealership lots, reducing city logistics emissions.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-[#e9e3e6]/40 via-white to-[#e9e3e6]/40 relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#232c33] text-white text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <svg
              className="w-3.5 h-3.5 text-emerald-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.083 9h11.834a1 1 0 01.993 1.117l-1.5 13.5A1 1 0 0114.417 25H5.583a1 1 0 01-.993-.883l-1.5-13.5A1 1 0 014.083 9z"
                clipRule="evenodd"
              />
              <path d="M10 2a6 6 0 00-6 6v1h12V8a6 6 0 00-6-6z" />
            </svg>
            Environmental Impact
          </span>

          <h2 className="text-3xl md:text-5xl font-extrabold text-[#232c33] tracking-tight">
            Driving Sustainability for a Greener Tomorrow
          </h2>
          <p className="text-[#9a8f97] mt-4 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            By facilitating direct peer-to-peer pre-owned car transactions and promoting electric & hybrid vehicles, Drift helps reduce automotive industrial waste and carbon emissions.
          </p>
        </div>

        {/* Impact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {impactCards.map((card, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-[#b2b2b2] bg-white p-7 shadow-xl hover:shadow-2xl hover:border-[#232c33] transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#e9e3e6] flex items-center justify-center mb-5 group-hover:scale-110 transition duration-300">
                  {card.icon}
                </div>
                <div className="inline-block px-2.5 py-1 rounded-md bg-[#e9e3e6] border border-[#b2b2b2]/60 text-[11px] font-black text-[#232c33] uppercase tracking-wider mb-3">
                  {card.stat}
                </div>
                <h3 className="text-lg font-bold text-[#232c33] mb-2">
                  {card.title}
                </h3>
                <p className="text-[#9a8f97] text-xs leading-relaxed font-medium">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Environmental Metrics Counter Banner */}
        <div className="rounded-2xl border border-[#b2b2b2] bg-[#232c33] text-white p-8 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="pt-4 sm:pt-0">
              <p className="text-3xl md:text-4xl font-black text-white tracking-tight">
                1,200+
              </p>
              <p className="text-[#b2b2b2] text-xs font-semibold uppercase tracking-wider mt-1">
                Vehicles Resold Responsibly
              </p>
            </div>
            <div className="pt-4 sm:pt-0 sm:px-4">
              <p className="text-3xl md:text-4xl font-black text-white tracking-tight">
                6,900+ Tons
              </p>
              <p className="text-[#b2b2b2] text-xs font-semibold uppercase tracking-wider mt-1">
                CO₂ Emissions Mitigated
              </p>
            </div>
            <div className="pt-4 sm:pt-0">
              <p className="text-3xl md:text-4xl font-black text-white tracking-tight">
                40%+
              </p>
              <p className="text-[#b2b2b2] text-xs font-semibold uppercase tracking-wider mt-1">
                Hybrid & EV Marketplace Growth
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
