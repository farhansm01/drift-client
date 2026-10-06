"use client";

import { useState } from "react";
import { ChevronDown } from "@gravity-ui/icons";

const faqs = [
  { q: "Is it free to list my car?", a: "Yes, listing a car on Drift is completely free — no fees, no commission." },
  { q: "How do I contact a seller?", a: "Every listing shows the seller's contact info directly on the details page." },
  { q: "Do I need an account to browse?", a: "No — browsing and viewing listings is open to everyone. You only need an account to list your own car." },
  { q: "Can I edit my listing after posting?", a: "Currently you can view or delete your listings from the Manage Cars page. Editing isn't supported yet." },
  { q: "Is Drift available outside Dhaka?", a: "Right now Drift is focused on Dhaka, with plans to expand to more cities soon." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 px-4 bg-[#e9e3e6] border-t border-[#b2b2b2]/40 relative">
      <div className="max-w-3xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#9a8f97] font-bold block mb-1">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#232c33]">
            Frequently Asked <span className="text-[#9a8f97]">Questions</span>
          </h2>
          <p className="text-[#232c33]/70 text-sm mt-2 font-medium">
            Everything you need to know before you start.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className={`rounded-2xl border transition-all duration-300 backdrop-blur-xl overflow-hidden ${
                openIndex === i
                  ? "bg-white border-[#232c33] shadow-md"
                  : "bg-white/90 border-[#b2b2b2] hover:border-[#9a8f97]"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className="text-[#232c33] font-bold text-base">{faq.q}</span>
                <ChevronDown
                  width={20}
                  height={20}
                  className={`text-[#9a8f97] transition-transform duration-300 ${
                    openIndex === i ? "rotate-180 text-[#232c33]" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <p className="px-5 pb-5 text-sm text-[#232c33]/80 leading-relaxed border-t border-[#c3baba]/60 pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}