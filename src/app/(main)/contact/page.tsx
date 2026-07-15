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
    // No backend wiring required by spec — just confirm the interaction locally
    setSubmitted(true);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl md:text-4xl font-semibold text-white mb-2">
        Contact Us
      </h1>
      <p className="text-neutral-400 mb-10">
        Questions, feedback, or need help with a listing? Reach out.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Handset width={20} height={20} className="text-neutral-400 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Phone</p>
                <p className="text-neutral-400 text-sm">+880 1712-345678</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Envelope width={20} height={20} className="text-neutral-400 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Email</p>
                <p className="text-neutral-400 text-sm">support@driftcars.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin width={20} height={20} className="text-neutral-400 mt-0.5" />
              <div>
                <p className="text-white text-sm font-medium">Location</p>
                <p className="text-neutral-400 text-sm">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-lg p-6">
          {submitted ? (
            <p className="text-neutral-300 text-sm">
              Thanks for reaching out — we'll get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-300 mb-1">Message</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-neutral-200 to-neutral-400 text-neutral-900 font-medium py-2.5 text-sm hover:opacity-90 transition"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}