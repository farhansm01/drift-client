"use client";

import { useState } from "react";
import { Handset, Envelope, MapPin } from "@gravity-ui/icons";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#232c33] text-white text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            Get in touch
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#232c33] tracking-tight">
            We&apos;re here to help
          </h1>
          <p className="text-[#9a8f97] mt-3 max-w-md mx-auto font-medium">
            Questions about a listing, or need assistance with your account? Send us a message below.
          </p>
        </div>

        <div className="rounded-2xl border border-[#b2b2b2] bg-white overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 p-8 bg-[#232c33] text-white flex flex-col justify-center gap-8">
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">Contact Info</h3>
                <p className="text-sm text-[#b2b2b2]">
                  Reach out to the Drift support team anytime.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/10 p-2.5 shrink-0 text-white">
                    <Handset width={20} height={20} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Phone</p>
                    <p className="text-[#b2b2b2] text-sm mt-0.5">+880 1712-345678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/10 p-2.5 shrink-0 text-white">
                    <Envelope width={20} height={20} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Email</p>
                    <p className="text-[#b2b2b2] text-sm mt-0.5">support@driftcars.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-white/10 p-2.5 shrink-0 text-white">
                    <MapPin width={20} height={20} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Location</p>
                    <p className="text-[#b2b2b2] text-sm mt-0.5">Dhaka, Bangladesh</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 p-8 md:p-10">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-[#232c33] text-white flex items-center justify-center text-2xl font-bold mb-4 shadow-md">
                    ✓
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#232c33] mb-2">Message Sent!</h3>
                  <p className="text-[#9a8f97] text-sm max-w-xs font-medium">
                    Thanks for reaching out — our team will get back to you as soon as possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#232c33] mb-1.5">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className="w-full rounded-xl bg-[#e9e3e6]/40 border border-[#b2b2b2] px-4 py-2.5 text-[#232c33] placeholder:text-[#9a8f97] text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#232c33]/20 focus:border-[#232c33] transition resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-full rounded-xl px-6 py-3.5 text-sm font-bold text-white transition shadow-lg hover:shadow-xl cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}