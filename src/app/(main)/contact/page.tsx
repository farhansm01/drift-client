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
          <p className="text-xs uppercase tracking-widest text-accent-blue font-medium mb-3">
            Get in touch
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            We&apos;re here to help
          </h1>
          <p className="text-neutral-400 mt-3 max-w-md mx-auto">
            Questions about a listing, or need a hand with your account? Send us a message.
          </p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 p-8 md:border-r border-neutral-800 flex flex-col justify-center gap-6">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-accent-blue/10 p-2 shrink-0">
                  <Handset width={18} height={18} className="text-accent-blue" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Phone</p>
                  <p className="text-neutral-400 text-sm mt-0.5">+880 1712-345678</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-accent-blue/10 p-2 shrink-0">
                  <Envelope width={18} height={18} className="text-accent-blue" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Email</p>
                  <p className="text-neutral-400 text-sm mt-0.5">support@driftcars.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-accent-blue/10 p-2 shrink-0">
                  <MapPin width={18} height={18} className="text-accent-blue" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Location</p>
                  <p className="text-neutral-400 text-sm mt-0.5">Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-3 p-8">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                  <p className="text-white font-medium mb-1">Message sent</p>
                  <p className="text-neutral-400 text-sm">
                    Thanks for reaching out — we&apos;ll get back to you soon.
                  </p>
                </div>
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
                      className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-neutral-500 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="metallic-button w-full rounded-lg px-6 py-2.5 text-sm font-medium text-neutral-900 hover:opacity-90 transition"
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