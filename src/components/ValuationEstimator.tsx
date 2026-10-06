"use client";

import { useState } from "react";
import Link from "next/link";

const MAKES = [
  { name: "Toyota", basePrice: 2400000 },
  { name: "Honda", basePrice: 2200000 },
  { name: "Nissan", basePrice: 1900000 },
  { name: "Hyundai", basePrice: 2000000 },
  { name: "BMW", basePrice: 4800000 },
  { name: "Mercedes-Benz", basePrice: 5500000 },
  { name: "Mitsubishi", basePrice: 2100000 },
];

const YEARS = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

const CONDITIONS = [
  { label: "Mint / Like New", multiplier: 1.12 },
  { label: "Good", multiplier: 1.0 },
  { label: "Fair", multiplier: 0.88 },
];

const MILEAGES = [
  { label: "Under 20,000 km", factor: 1.08 },
  { label: "20,000 - 50,000 km", factor: 1.0 },
  { label: "50,000 - 90,000 km", factor: 0.92 },
  { label: "90,000+ km", factor: 0.84 },
];

export default function ValuationEstimator() {
  const [selectedMake, setSelectedMake] = useState("Toyota");
  const [selectedYear, setSelectedYear] = useState(2021);
  const [selectedCondition, setSelectedCondition] = useState(1);
  const [selectedMileage, setSelectedMileage] = useState(1);

  const makeObj = MAKES.find((m) => m.name === selectedMake) || MAKES[0];
  const yearDepreciation = 1 - (2025 - selectedYear) * 0.045;
  const conditionMult = CONDITIONS[selectedCondition].multiplier;
  const mileageFactor = MILEAGES[selectedMileage].factor;

  const baseCalculated = Math.max(
    600000,
    Math.round(makeObj.basePrice * yearDepreciation * conditionMult * mileageFactor)
  );

  const minVal = Math.round(baseCalculated * 0.95);
  const maxVal = Math.round(baseCalculated * 1.06);

  const formatBDT = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section className="py-20 px-4 bg-[#050b14] border-t border-sky-500/20 relative overflow-hidden">
      {/* Blue Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-sky-300 font-bold px-3.5 py-1 rounded-full bg-blue-950/80 border border-sky-500/30 inline-block mb-3 shadow-md">
            Instant Market Calculator
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white">
            <span className="text-gradient-cyan-blue">
              Estimate Your Car&apos;s Resale Value
            </span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Get instant market valuation based on live Dhaka marketplace data before listing or buying.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Form */}
          <div className="lg:col-span-7 bg-[#09152b]/85 border border-sky-500/30 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-blue-950/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
              {/* Make Selection */}
              <div>
                <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                  Brand / Make
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => setSelectedMake(e.target.value)}
                  className="w-full bg-[#050b14] border border-sky-500/40 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-sky-300 focus:outline-none transition cursor-pointer"
                >
                  {MAKES.map((m) => (
                    <option key={m.name} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Selection */}
              <div>
                <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                  Model Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="w-full bg-[#050b14] border border-sky-500/40 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-sky-300 focus:outline-none transition cursor-pointer"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condition Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                Vehicle Condition
              </label>
              <div className="grid grid-cols-3 gap-2">
                {CONDITIONS.map((cond, idx) => (
                  <button
                    key={cond.label}
                    type="button"
                    onClick={() => setSelectedCondition(idx)}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${selectedCondition === idx
                        ? "bg-gradient-to-r from-blue-600/40 via-sky-600/40 to-indigo-600/40 border-sky-300 text-white shadow-lg shadow-blue-950/60"
                        : "bg-[#050b14]/80 border-blue-950 text-slate-400 hover:text-white hover:border-sky-700"
                      }`}
                  >
                    {cond.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mileage Selector */}
            <div>
              <label className="block text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">
                Odometer / Mileage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MILEAGES.map((m, idx) => (
                  <button
                    key={m.label}
                    type="button"
                    onClick={() => setSelectedMileage(idx)}
                    className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer text-center ${selectedMileage === idx
                        ? "bg-gradient-to-r from-blue-600/40 via-sky-600/40 to-indigo-600/40 border-sky-300 text-white shadow-lg shadow-blue-950/60"
                        : "bg-[#050b14]/80 border-blue-950 text-slate-400 hover:text-white hover:border-sky-700"
                      }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-blue-950 via-[#0a1835] to-[#050b14] border border-sky-400/40 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-2xl shadow-blue-950/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-8xl text-sky-300 select-none pointer-events-none">
              ৳
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-400/40 mb-4 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                Live Market Estimation
              </div>

              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Estimated Value ({selectedYear} {selectedMake})
              </p>
              <h3 className="text-3xl sm:text-4xl font-black text-gradient-cyan-blue tracking-tight mb-2 glow-cyan">
                ৳ {formatBDT(minVal)} - {formatBDT(maxVal)}
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Based on direct buyer offers and recent completed listings in Dhaka.
              </p>

              <div className="space-y-2.5 pt-4 border-t border-sky-500/20 text-xs text-slate-300 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-400">Demand Level:</span>
                  <span className="text-sky-300 font-bold">🔥 High Demand</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Average Sale Time:</span>
                  <span className="text-white font-semibold">3-5 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Drift Fee:</span>
                  <span className="text-sky-300 font-semibold">৳0 (No Commission)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/cars/add"
                className="w-full flex items-center justify-center gap-2 btn-primary py-3 px-4 text-sm font-bold text-white shadow-xl text-center"
              >
                List Your Car at This Price
              </Link>
              <Link
                href={`/cars?search=${encodeURIComponent(selectedMake)}`}
                className="block text-center text-xs text-slate-400 hover:text-sky-300 transition py-1 font-semibold"
              >
                Browse {selectedMake} cars on market
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
