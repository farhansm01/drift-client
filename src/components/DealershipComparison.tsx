"use client";

import { useState } from "react";
import { Check, Xmark } from "@gravity-ui/icons";

const COMPARISON_ITEMS = [
  {
    feature: "Broker & Dealer Commission",
    dealership: "8% - 15% cut on every sale",
    drift: "৳0 Commission (100% yours)",
    driftAdvantage: true,
  },
  {
    feature: "Buyer-Seller Communication",
    dealership: "Filtered through sales agents",
    drift: "Direct phone & instant messaging",
    driftAdvantage: true,
  },
  {
    feature: "Price Transparency",
    dealership: "High dealership markup price",
    drift: "True peer-to-peer market value",
    driftAdvantage: true,
  },
  {
    feature: "Vehicle History & Papers",
    dealership: "Selectively disclosed details",
    drift: "Verified BRTA registration & inspection",
    driftAdvantage: true,
  },
  {
    feature: "Test Drive & Handover",
    dealership: "Showroom visit & mandatory paperwork fee",
    drift: "Direct meeting at seller location or hub",
    driftAdvantage: true,
  },
];

export default function DealershipComparison() {
  const [carPrice, setCarPrice] = useState(2500000);

  const dealerCommission = Math.round(carPrice * 0.1);
  const driftCommission = 0;
  const totalSavings = dealerCommission - driftCommission;

  const formatBDT = (num: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <section className="py-20 px-4 bg-[#050b14] border-t border-blue-900/30 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/40 inline-block mb-3">
            Marketplace Advantage
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Why Skip the Dealership Middleman?
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            See how direct peer-to-peer buying and selling saves you hundreds of thousands in hidden fees.
          </p>
        </div>

        {/* Interactive Savings Calculator */}
        <div className="mb-14 bg-gradient-to-r from-blue-950/80 via-[#0a172c] to-blue-950/80 border border-blue-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-950/70">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-blue-300 mb-2">
                Car Value Calculator
              </label>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-slate-300">Target Car Price:</span>
                <span className="text-xl font-extrabold text-white">৳ {formatBDT(carPrice)}</span>
              </div>
              <input
                type="range"
                min={800000}
                max={8000000}
                step={100000}
                value={carPrice}
                onChange={(e) => setCarPrice(Number(e.target.value))}
                className="w-full h-2.5 bg-[#050b14] rounded-lg appearance-none cursor-pointer accent-blue-400 border border-blue-900/60"
              />
              <div className="flex justify-between text-[11px] text-blue-400/70 mt-2 font-mono">
                <span>৳ 8,00,000</span>
                <span>৳ 40,00,000</span>
                <span>৳ 80,00,000</span>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#050b14]/90 border border-blue-500/40 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-xl">
              <div>
                <span className="text-xs text-slate-400 block mb-1 font-medium">Your Direct Savings</span>
                <p className="text-2xl sm:text-3xl font-black text-blue-300 tracking-tight blue-glow-text">
                  + ৳ {formatBDT(totalSavings)}
                </p>
                <span className="text-[11px] text-slate-400">
                  Calculated at 10% average dealership markup vs ৳0 on Drift
                </span>
              </div>

              <div className="hidden sm:block shrink-0 px-4 py-2.5 bg-blue-500/15 border border-blue-400/40 rounded-xl text-center">
                <span className="text-xs text-blue-300 font-bold block">100% Kept</span>
                <span className="text-[10px] text-slate-400">By Buyer & Seller</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-blue-900/40 text-xs uppercase text-slate-400 tracking-wider">
                <th className="py-4 px-4 font-semibold w-1/3">Feature</th>
                <th className="py-4 px-4 font-semibold w-1/3 text-slate-400">Traditional Dealerships</th>
                <th className="py-4 px-4 font-bold text-blue-300 bg-blue-600/15 rounded-t-xl border-t border-x border-blue-500/40">
                  Drift Marketplace
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/30 text-sm">
              {COMPARISON_ITEMS.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-950/30 transition">
                  <td className="py-4 px-4 text-white font-semibold">{item.feature}</td>
                  <td className="py-4 px-4 text-slate-400">
                    <div className="flex items-center gap-2">
                      <Xmark width={16} height={16} className="text-red-400/80 shrink-0" />
                      <span>{item.dealership}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-blue-200 font-semibold bg-blue-600/10 border-x border-blue-500/30">
                    <div className="flex items-center gap-2">
                      <Check width={16} height={16} className="text-blue-400 shrink-0" />
                      <span>{item.drift}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
