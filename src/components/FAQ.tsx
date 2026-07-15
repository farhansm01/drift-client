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
    <section className="py-20 px-4 bg-neutral-900/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-neutral-400 text-center mb-12">
          Everything you need to know before you start.
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium">{faq.q}</span>
                <ChevronDown
                  width={18}
                  height={18}
                  className={`text-neutral-400 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <p className="px-5 pb-5 text-sm text-neutral-400">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}