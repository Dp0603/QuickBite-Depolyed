import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);

    try {
      // Hook this up to your backend help/support endpoint (example):
      // await fetch("/api/help-support", { method: "POST", body: JSON.stringify(form), headers: { "Content-Type": "application/json" }});
      await new Promise((r) => setTimeout(r, 700)); // demo
      setStatus({ type: "success", msg: "Message sent. We'll get back shortly." });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to send message. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white/50 to-white/10 dark:from-slate-900 dark:to-slate-950">
        <section className="max-w-screen-2xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600">
                Get in touch
              </h2>
              <p className="text-gray-700 dark:text-gray-300 max-w-lg">
                Have a question, partnership inquiry or need support? Send us a message — we aim to reply within 24 hours.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600">
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Phone</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">+1 (555) 123-4567</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-900/20 text-pink-600">
                    <FaEnvelope />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Email</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">support@quickbite.example</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">Office</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Downtown, City — 123 Food St.</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <form
                onSubmit={handleSubmit}
                className="bg-white/80 dark:bg-slate-800/60 border border-white/10 rounded-2xl p-6 shadow-lg"
              >
                {status && (
                  <div
                    className={`mb-4 p-3 rounded text-sm ${
                      status.type === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                    }`}
                  >
                    {status.msg}
                  </div>
                )}

                <div className="grid gap-3">
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-transparent focus:outline-none"
                    required
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-transparent focus:outline-none"
                    required
                  />
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 rounded-lg border border-white/10 bg-transparent focus:outline-none resize-none"
                    required
                  />

                  <div className="flex justify-between items-center gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow hover:scale-105 transition"
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      We reply within 24 hrs
                    </div>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}