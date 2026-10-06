"use client";

import { useState } from "react";
import { ShieldCheck, FileText, MapPin, SealCheck } from "@gravity-ui/icons";

const TRUST_PILLARS = [
  {
    id: "verification",
    icon: FileText,
    title: "100% BRTA Paperwork Verification",
    badge: "Document Check",
    shortDesc: "Registration card, tax token, and fitness certificate checked.",
    details: [
      "BRTA Registration Smart Card validity verification",
      "Up-to-date Tax Token and Fitness Certificate inspection",
      "Digital engine & chassis serial cross-check with database",
      "Clear ownership title without bank liens or disputes",
    ],
    highlight: "Zero stolen or documentation-disputed vehicles listed.",
  },
  {
    id: "inspection",
    icon: ShieldCheck,
    title: "150-Point Technical Inspection",
    badge: "Technical Health",
    shortDesc: "Engine, transmission, chassis frame, and paint depth analysis.",
    details: [
      "OBD-II scanner diagnosis for hidden ECU error codes",
      "Engine compression, oil purity, and transmission check",
      "Paint thickness gauge test to detect hidden accident repairs",
      "Suspension, steering, and braking system test drives",
    ],
    highlight: "Full transparent report provided directly to potential buyers.",
  },
  {
    id: "hubs",
    icon: MapPin,
    title: "Safe Dhaka Meeting Hubs",
    badge: "Secure Spot",
    shortDesc: "Designated partner test-drive locations in Gulshan, Banani, and Uttara.",
    details: [
      "CCTV-monitored parking bays for initial car viewings",
      "On-site mechanic lift availability for quick undercarriage inspection",
      "Secure banking partner counters for immediate instant transfer",
      "Verifiable witness assistance during handover agreements",
    ],
    highlight: "Meet safely with complete peace of mind.",
  },
  {
    id: "sellers",
    icon: SealCheck,
    title: "Verified Seller Profiles",
    badge: "Identity Verified",
    shortDesc: "Phone, NID, and contact address verified sellers.",
    details: [
      "Multi-factor phone and identity check for all car sellers",
      "Community rating system based on actual test drives",
      "Direct WhatsApp and call buttons — no fake contact numbers",
      "Seller response rate & listing history displayed transparently",
    ],
    highlight: "Talk directly to real owners, never anonymous middle-agents.",
  },
];

export default function SafetyShield() {
  const [activeTab, setActiveTab] = useState(0);

  const activePillar = TRUST_PILLARS[activeTab];

  return (
    <section className="py-20 px-4 bg-[#050b14] border-t border-blue-900/30 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-blue-400 font-semibold px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/40 inline-block mb-3">
            Trust & Security Guarantee
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Drive with Total Confidence
          </h2>
          <p className="text-slate-400 text-sm md:text-base mt-2">
            Every vehicle detail and seller on Drift is backed by our strict verification standards.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {TRUST_PILLARS.map((pillar, idx) => {
            const Icon = pillar.icon;
            const isActive = idx === activeTab;
            return (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(idx)}
                className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between ${isActive
                    ? "bg-[#091427] border-blue-400 shadow-xl shadow-blue-950/60"
                    : "bg-[#060c18]/80 border-blue-900/40 hover:border-blue-600 hover:bg-[#09111e]"
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`p-2 rounded-xl ${isActive ? "bg-blue-600/25 text-blue-300" : "bg-blue-950/60 text-slate-400"
                      }`}
                  >
                    <Icon width={22} height={22} />
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md ${isActive
                        ? "bg-blue-500/25 text-blue-200 border border-blue-400/40"
                        : "bg-blue-950/50 text-slate-500"
                      }`}
                  >
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{pillar.title}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{pillar.shortDesc}</p>
              </button>
            );
          })}
        </div>

        {/* Tab Detail Box */}
        <div className="bg-gradient-to-br from-blue-950/90 via-[#0a162b] to-[#050b14] border border-blue-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-blue-950/80">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#38bdf8]" />
                <span className="text-xs uppercase font-mono tracking-widest text-blue-300 font-semibold">
                  {activePillar.badge} Standard
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-snug">
                {activePillar.title}
              </h3>

              <ul className="space-y-3 mb-6">
                {activePillar.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-blue-400/30">
                      ✓
                    </span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              <div className="inline-block bg-[#050b14] border border-blue-500/30 rounded-xl px-4 py-2.5 text-xs text-blue-300 font-medium shadow-md">
                🛡️ <span className="font-bold text-white">Guarantee:</span> {activePillar.highlight}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#050b14]/90 border border-blue-500/30 rounded-2xl p-6 text-center space-y-6 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-400/40 text-blue-300 flex items-center justify-center mx-auto shadow-lg shadow-blue-950">
                <ShieldCheck width={36} height={36} />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white mb-1">Direct Trust Shield</h4>
                <p className="text-xs text-slate-400">
                  Protecting over ৳50+ Million in direct car transactions in Dhaka.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-blue-900/40 text-left">
                <div className="bg-[#09111e] p-3 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-slate-400 block">Verified Ratio</span>
                  <span className="text-lg font-bold text-blue-300">100%</span>
                </div>
                <div className="bg-[#09111e] p-3 rounded-xl border border-blue-900/40">
                  <span className="text-xs text-slate-400 block">Middleman Fees</span>
                  <span className="text-lg font-bold text-white">৳0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
