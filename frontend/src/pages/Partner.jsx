import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaStore,
  FaUserTie,
  FaChartLine,
  FaHandshake,
  FaBolt,
  FaShieldAlt,
  FaRocket,
  FaCheckCircle,
  FaArrowRight,
  FaStar,
  FaCrown,
} from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Partner() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors overflow-hidden">
      {/* SEO */}
      <Helmet>
        <title>QuickBite | Partner with Us</title>
        <meta
          name="description"
          content="Join QuickBite as a restaurant partner or staff member and grow your business."
        />
      </Helmet>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative w-full min-h-[80vh] py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400/20 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "700ms" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1000ms" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="lg:w-1/2 space-y-6 animate-[fadeIn_0.8s_ease-out]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-500/20 dark:to-pink-500/20 border border-orange-300 dark:border-orange-500/30 backdrop-blur-sm">
              <FaCrown className="text-orange-500 dark:text-orange-400" />
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                Partner Program 🤝
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent">
                Partner with
              </span>
              <br />
              <span>QuickBite & Grow</span>
              <br />
              <span className="bg-gradient-to-r from-pink-600 to-orange-600 dark:from-pink-400 dark:to-orange-500 bg-clip-text text-transparent">
                Your Restaurant
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Join hundreds of top restaurants delivering delicious food to
              thousands of customers daily. Full control over your menu and
              orders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/partner/join"
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <FaStore className="relative z-10 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">Restaurant Owner</span>
                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <Link
                to="/partner/staff-join"
                className="px-8 py-4 rounded-2xl border-2 border-orange-500/30 dark:border-white/20 hover:bg-orange-50 dark:hover:bg-white/10 font-bold transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:border-orange-500 dark:hover:border-white/40 flex items-center justify-center gap-2"
              >
                <FaUserTie className="group-hover:scale-110 transition-transform" />
                <span>Staff Registration</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { value: "500+", label: "Partners" },
                { value: "50K+", label: "Daily Orders" },
                { value: "4.8★", label: "Avg Rating" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group cursor-pointer"
                  style={{ animation: `fadeIn 0.6s ease-out ${i * 100}ms` }}
                >
                  <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 relative animate-[fadeIn_1s_ease-out]">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded-3xl blur-3xl animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
              alt="Restaurant partnership"
              loading="lazy"
              decoding="async"
              className="relative rounded-3xl shadow-2xl shadow-orange-500/20 border border-orange-200 dark:border-white/10 w-full object-cover hover:scale-[1.05] hover:rotate-1 transition-all duration-500"
            />

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/20 backdrop-blur-xl shadow-2xl animate-[float_3s_ease-in-out_infinite]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-2xl">
                  🤝
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    Join 500+ Partners
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaBolt className="text-yellow-500" />
                    Growing Fast
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Why Partner Section */}
      <section className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16 animate-[fadeIn_0.8s_ease-out]">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                Why Partner with QuickBite
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Unlock unlimited growth potential for your business
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: <FaHandshake />,
                title: "Expand Your Reach",
                desc: "Get your restaurant in front of thousands of hungry customers.",
                color: "from-orange-500 to-pink-600",
                delay: "0ms",
              },
              {
                icon: <FaChartLine />,
                title: "Grow Revenue",
                desc: "Increase sales through online orders and optimized delivery management.",
                color: "from-pink-500 to-purple-600",
                delay: "200ms",
              },
              {
                icon: <FaBolt />,
                title: "Full Control",
                desc: "Manage your menu, prices, and orders easily from your dashboard.",
                color: "from-purple-500 to-blue-600",
                delay: "400ms",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative"
                style={{ animation: `fadeIn 0.8s ease-out ${item.delay}` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-4xl text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="w-full bg-gradient-to-br from-orange-50 to-pink-50 dark:bg-gray-800 py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/10 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300/10 dark:bg-pink-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-[fadeIn_0.8s_ease-out]">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                Onboarding in 3 Simple Steps
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Get started in minutes, not days
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: "📝",
                title: "Sign Up",
                desc: "Provide your details as an owner or staff member.",
                delay: "0ms",
              },
              {
                icon: "📄",
                title: "Verify",
                desc: "Upload licenses, ID, or certifications for approval.",
                delay: "150ms",
              },
              {
                icon: "🚀",
                title: "Start Receiving Orders",
                desc: "Get approved and start managing or serving your restaurant.",
                delay: "300ms",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="group relative"
                style={{ animation: `fadeIn 0.8s ease-out ${step.delay}` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-white/10 text-orange-600 dark:text-white flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-3xl p-12 shadow-2xl shadow-orange-500/30 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-black mb-4">
                  Partner Benefits
                </h2>
                <p className="text-xl text-white/90">
                  Everything you need to succeed
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { icon: <FaCheckCircle />, text: "Zero joining fees" },
                  { icon: <FaCheckCircle />, text: "Dedicated support team" },
                  {
                    icon: <FaCheckCircle />,
                    text: "Real-time analytics dashboard",
                  },
                  {
                    icon: <FaCheckCircle />,
                    text: "Marketing & promotional support",
                  },
                  {
                    icon: <FaCheckCircle />,
                    text: "Flexible commission structure",
                  },
                  { icon: <FaCheckCircle />, text: "Easy menu management" },
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all duration-300"
                    style={{ animation: `fadeIn 0.6s ease-out ${i * 100}ms` }}
                  >
                    <div className="text-2xl">{benefit.icon}</div>
                    <span className="text-lg font-semibold">
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gradient-to-br from-orange-50 to-pink-50 dark:bg-gray-800 py-20 px-4 sm:px-6 lg:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 shadow-lg shadow-orange-500/30 mb-6">
            <FaRocket className="text-white text-3xl" />
          </div>

          <h2 className="text-4xl sm:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
              Ready to Grow Your Restaurant?
            </span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
            Join QuickBite today and start reaching more customers
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/partner/join"
              className="group px-10 py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 relative overflow-hidden"
            >
              <FaStore className="relative z-10 text-xl" />
              <span className="relative z-10">Restaurant Owner</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link
              to="/partner/staff-join"
              className="px-10 py-5 rounded-2xl border-2 border-orange-500/30 dark:border-white/20 hover:bg-orange-50 dark:hover:bg-white/10 font-bold text-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:border-orange-500 dark:hover:border-white/40 flex items-center gap-2"
            >
              <FaUserTie className="text-xl" />
              <span>Staff Registration</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}

// old
// // src/pages/Partner.jsx
// import React from "react";
// import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import Navbar from "../components/Navbar";

// export default function Partner() {
//   return (
//     <div className="min-h-screen flex flex-col bg-accent dark:bg-secondary text-secondary dark:text-accent transition-colors">
//       {/* SEO */}
//       <Helmet>
//         <title>QuickBite | Partner with Us</title>
//         <meta
//           name="description"
//           content="Join QuickBite as a restaurant partner or staff member and grow your business."
//         />
//       </Helmet>

//       {/* Navbar */}
//       <Navbar />

//       {/* Hero */}
//       <header className="relative w-full bg-primary text-white min-h-[70vh] py-24">
//         <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
//         <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-center gap-10">
//           <div className="lg:w-1/2">
//             <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
//               Partner with QuickBite & Grow Your Restaurant
//             </h1>
//             <p className="text-lg sm:text-xl mb-6">
//               Join hundreds of top restaurants delivering delicious food to
//               thousands of customers daily. Full control over your menu and
//               orders.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <Link
//                 to="/partner/join"
//                 className="bg-accent text-primary px-6 py-3 rounded-full font-semibold shadow-brand hover:shadow-brand-lg transition"
//               >
//                 Restaurant Owner Registration
//               </Link>

//               <Link
//                 to="/partner/staff-join"
//                 className="bg-secondary text-white px-6 py-3 rounded-full font-semibold shadow-brand hover:shadow-brand-lg transition"
//               >
//                 Staff Registration
//               </Link>
//             </div>
//           </div>

//           <div className="lg:w-1/2">
//             <img
//               src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
//               alt="Restaurant onboarding illustration"
//               loading="lazy"
//               decoding="async"
//               className="rounded-xl shadow-brand-lg w-full object-cover"
//             />
//           </div>
//         </div>
//       </header>

//       {/* Why Partner */}
//       <section className="w-full bg-white dark:bg-secondary py-16 px-4 sm:px-6 lg:px-12">
//         <div className="max-w-screen-2xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-12 text-primary">
//             Why Partner with QuickBite
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: "💼",
//                 title: "Expand Your Reach",
//                 desc: "Get your restaurant in front of thousands of hungry customers.",
//               },
//               {
//                 icon: "📈",
//                 title: "Grow Revenue",
//                 desc: "Increase sales through online orders and optimized delivery management.",
//               },
//               {
//                 icon: "⚡",
//                 title: "Full Control",
//                 desc: "Manage your menu, prices, and orders easily from your dashboard.",
//               },
//             ].map((item, i) => (
//               <div
//                 key={i}
//                 className="bg-accent dark:bg-secondary p-8 rounded-xl shadow-brand hover:shadow-brand-lg transition"
//               >
//                 <div className="text-5xl mb-4">{item.icon}</div>
//                 <h3 className="text-xl font-semibold mb-2 text-primary">
//                   {item.title}
//                 </h3>
//                 <p className="text-secondary dark:text-accent">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Steps */}
//       <section className="w-full bg-accent dark:bg-secondary py-16 px-4 sm:px-6 lg:px-12">
//         <div className="max-w-screen-2xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-12 text-primary">
//             Onboarding in 3 Simple Steps
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: "📝",
//                 title: "Sign Up",
//                 desc: "Provide your details as an owner or staff member.",
//               },
//               {
//                 icon: "📄",
//                 title: "Verify",
//                 desc: "Upload licenses, ID, or certifications for approval.",
//               },
//               {
//                 icon: "🚀",
//                 title: "Start Receiving Orders",
//                 desc: "Get approved and start managing or serving your restaurant.",
//               },
//             ].map((step, i) => (
//               <div
//                 key={i}
//                 className="bg-white dark:bg-secondary p-8 rounded-xl shadow-brand hover:shadow-brand-lg transition"
//               >
//                 <div className="text-5xl mb-4">{step.icon}</div>
//                 <h3 className="text-xl font-semibold mb-2 text-primary">
//                   {step.title}
//                 </h3>
//                 <p className="text-secondary dark:text-accent">{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="w-full bg-primary text-white py-16 px-4 sm:px-6 lg:px-12 text-center">
//         <h2 className="text-3xl font-bold mb-6">
//           Ready to Grow Your Restaurant or Join as Staff?
//         </h2>
//         <div className="flex justify-center gap-4 flex-wrap">
//           <Link
//             to="/partner/join"
//             className="bg-accent text-primary px-8 py-4 rounded-full font-semibold shadow-brand hover:shadow-brand-lg transition"
//           >
//             Restaurant Owner
//           </Link>
//           <Link
//             to="/partner/staff-join"
//             className="bg-secondary text-white px-8 py-4 rounded-full font-semibold shadow-brand hover:shadow-brand-lg transition"
//           >
//             Staff
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white dark:bg-secondary py-10 w-full">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center">
//           <p className="text-secondary dark:text-accent mb-4 md:mb-0 text-center md:text-left">
//             © {new Date().getFullYear()} QuickBite. All rights reserved.
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }
