import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaArrowRight,
  FaStar,
  FaFire,
  FaCrown,
  FaBolt,
  FaHeart,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-gray-900 dark:text-white transition-colors overflow-hidden">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>QuickBite | Order Food Online</title>
        <meta
          name="description"
          content="Get food delivered from top-rated restaurants at your doorstep. Try QuickBite now!"
        />
      </Helmet>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative w-full min-h-[80vh] py-24 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 dark:bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "700ms" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1000ms" }}
          ></div>

          {/* Floating particles */}
          <div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping"
            style={{ animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-3/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping"
            style={{ animationDuration: "4s", animationDelay: "500ms" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping"
            style={{ animationDuration: "5s", animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className="lg:w-1/2 space-y-6 animate-fadeIn">
            {/* Trending Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-500/20 dark:to-pink-500/20 border border-orange-300 dark:border-orange-500/30 backdrop-blur-sm animate-slideInLeft">
              <FaFire className="text-orange-500 dark:text-orange-400 animate-pulse" />
              <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                Trending Now 🔥
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl font-black leading-tight animate-fadeIn">
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 dark:from-orange-400 dark:via-pink-500 dark:to-purple-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Hungry?
              </span>
              <br />
              <span className="inline-block hover:scale-105 transition-transform duration-300">
                Let us deliver
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-600 to-orange-600 dark:from-pink-400 dark:to-orange-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                happiness.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed animate-fadeIn">
              Order from top-rated restaurants, delivered hot and fresh to your
              door in minutes.
            </p>

            <div className="flex flex-wrap gap-4 animate-fadeIn">
              <Link
                to="/login"
                className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 relative overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/customer"
                className="px-8 py-4 rounded-2xl border-2 border-orange-500/30 dark:border-white/20 hover:bg-orange-50 dark:hover:bg-white/10 font-bold transition-all duration-300 backdrop-blur-sm hover:scale-105 hover:border-orange-500 dark:hover:border-white/40"
              >
                Browse as Guest
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { value: "500+", label: "Restaurants" },
                { value: "50K+", label: "Happy Customers" },
                { value: "4.8★", label: "Average Rating" },
              ].map((stat, i) => (
                <div key={i} className="group cursor-pointer animate-fadeIn">
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

          <div className="lg:w-1/2 relative animate-fadeIn">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-pink-500/30 rounded-3xl blur-3xl animate-pulse"></div>
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
              alt="Delicious food on a plate"
              loading="lazy"
              decoding="async"
              className="relative rounded-3xl shadow-2xl shadow-orange-500/20 border border-orange-200 dark:border-white/10 w-full object-cover hover:scale-[1.05] hover:rotate-1 transition-all duration-500"
            />

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 px-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/20 backdrop-blur-xl shadow-2xl animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-2xl animate-bounce">
                  🍕
                </div>
                <div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    Fast Delivery
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <FaBolt className="text-yellow-500 animate-pulse" />
                    Under 30 mins
                  </div>
                </div>
              </div>
            </div>

            {/* Floating hearts */}
            <div className="absolute top-10 right-10 animate-float">
              <FaHeart className="text-pink-500 text-2xl opacity-80" />
            </div>
            <div
              className="absolute bottom-1/3 right-5 animate-float"
              style={{ animationDelay: "1s" }}
            >
              <FaHeart className="text-red-500 text-xl opacity-60" />
            </div>
          </div>
        </div>
      </header>

      {/* How It Works */}
      <section className="w-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm py-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-screen-2xl mx-auto">
          <div className="text-center mb-16 animate-[fadeIn_0.8s_ease-out]">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                How It Works
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Three simple steps to satisfy your cravings
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: "🍽️",
                title: "Choose Restaurant",
                desc: "Browse top-rated eateries in your area.",
                color: "from-orange-500 to-pink-600",
                delay: "0ms",
              },
              {
                icon: "🛒",
                title: "Place Your Order",
                desc: "Customize your meal and checkout easily.",
                color: "from-pink-500 to-purple-600",
                delay: "200ms",
              },
              {
                icon: "🚚",
                title: "Track & Enjoy",
                desc: "Follow your delivery in real-time.",
                color: "from-purple-500 to-blue-600",
                delay: "400ms",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="group relative"
                style={{ animation: `fadeIn 0.8s ease-out ${step.delay}` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-white/10 text-orange-600 dark:text-white flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                      {i + 1}
                    </span>
                    <h3 className="text-2xl font-bold text-primary group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="w-full bg-gradient-to-br from-orange-50 to-pink-50 dark:bg-gray-800 py-20 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-300/10 dark:bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300/10 dark:bg-pink-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="text-center mb-16 animate-[fadeIn_0.8s_ease-out]">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 dark:from-orange-400 dark:to-pink-500 bg-clip-text text-transparent">
                Popular Restaurants
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Discover the best food experiences near you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Urban Bites",
                types: "Fast Food, Burgers",
                rating: "4.5",
                img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
                badge: "Trending",
                delay: "0ms",
              },
              {
                name: "Spice Villa",
                types: "Indian, Curry",
                rating: "4.7",
                img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
                badge: "Premium",
                delay: "150ms",
              },
              {
                name: "Green Bowl",
                types: "Healthy, Vegan",
                rating: "4.6",
                img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80",
                badge: "New",
                delay: "300ms",
              },
            ].map((r, i) => (
              <div
                key={i}
                className="group relative"
                style={{ animation: `fadeIn 0.8s ease-out ${r.delay}` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-orange-200 dark:border-white/10 hover:border-orange-300 dark:hover:border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:rotate-1">
                  <div className="relative overflow-hidden">
                    <img
                      src={r.img}
                      alt={`${r.name} preview`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-56 object-cover group-hover:scale-125 group-hover:brightness-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-bold flex items-center gap-1 shadow-lg animate-[float_3s_ease-in-out_infinite]">
                      <FaCrown className="text-xs animate-pulse" />
                      {r.badge}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                      {r.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {r.types}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                        <FaStar className="text-yellow-500 animate-pulse" />
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {r.rating}
                        </span>
                      </div>
                      <button className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold transition-all duration-300 hover:scale-110 hover:-rotate-3 shadow-md hover:shadow-xl relative overflow-hidden group/btn">
                        <span className="relative z-10">Order Now</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-10 w-full border-t border-orange-200 dark:border-white/10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} QuickBite. All rights reserved.
          </p>
          <div className="flex gap-4 justify-center md:justify-end">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-white/10 text-orange-600 dark:text-gray-400 hover:bg-gradient-to-br hover:from-orange-500 hover:to-pink-600 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-125 hover:-rotate-12"
                  aria-label={`Social ${i}`}
                >
                  <Icon size={18} />
                </a>
              )
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

//old code
// import React from "react";
// import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
// } from "react-icons/fa";
// import Navbar from "../components/Navbar";

// export default function Home() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
//       {/* SEO Meta Tags */}
//       <Helmet>
//         <title>QuickBite | Order Food Online</title>
//         <meta
//           name="description"
//           content="Get food delivered from top-rated restaurants at your doorstep. Try QuickBite now!"
//         />
//       </Helmet>

//       {/* Navbar */}
//       <Navbar />

//       {/* Hero Section */}
//       <header className="relative w-full bg-primary text-white min-h-[80vh] py-24">
//         <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-90" />
//         <div className="relative z-10 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row justify-between items-center gap-10">
//           <div className="lg:w-1/2">
//             <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
//               Hungry? Let us deliver happiness.
//             </h1>
//             <p className="text-lg sm:text-xl mb-6">
//               Order from top-rated restaurants, delivered hot and fresh to your
//               door.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Link
//                 to="/login"
//                 className="bg-white text-primary px-6 py-3 rounded-full font-semibold shadow hover:bg-gray-200 transition"
//               >
//                 Get Started
//               </Link>
//               <Link
//                 to="/customer"
//                 className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-primary transition"
//               >
//                 Browse as Guest
//               </Link>
//             </div>
//           </div>
//           <div className="lg:w-1/2">
//             <img
//               src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
//               alt="Delicious food on a plate"
//               loading="lazy"
//               decoding="async"
//               className="rounded-xl shadow-xl w-full object-cover"
//             />
//           </div>
//         </div>
//       </header>

//       {/* How It Works */}
//       <section className="w-full bg-white dark:bg-gray-800 py-16 px-4 sm:px-6 lg:px-12">
//         <div className="max-w-screen-2xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-12 text-secondary">
//             How It Works
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//             {[
//               {
//                 icon: "🍽️",
//                 title: "Choose Restaurant",
//                 desc: "Browse top-rated eateries in your area.",
//               },
//               {
//                 icon: "🛒",
//                 title: "Place Your Order",
//                 desc: "Customize your meal and checkout easily.",
//               },
//               {
//                 icon: "🚚",
//                 title: "Track & Enjoy",
//                 desc: "Follow your delivery in real-time.",
//               },
//             ].map((step, i) => (
//               <div
//                 key={i}
//                 className="bg-gray-100 dark:bg-gray-900 p-8 rounded-xl shadow hover:shadow-lg transition"
//               >
//                 <div
//                   className="text-5xl mb-4"
//                   role="img"
//                   aria-label={step.title}
//                 >
//                   {step.icon}
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2 text-primary">
//                   {step.title}
//                 </h3>
//                 <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Popular Restaurants */}
//       <section className="w-full bg-gray-100 dark:bg-gray-800 py-16 px-4 sm:px-6 lg:px-12">
//         <div className="max-w-screen-2xl mx-auto">
//           <h2 className="text-3xl font-bold text-secondary mb-12 text-center">
//             Popular Restaurants
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//             {[
//               {
//                 name: "Urban Bites",
//                 types: "Fast Food, Burgers",
//                 rating: "4.5",
//                 img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
//               },
//               {
//                 name: "Spice Villa",
//                 types: "Indian, Curry",
//                 rating: "4.7",
//                 img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
//               },
//               {
//                 name: "Green Bowl",
//                 types: "Healthy, Vegan",
//                 rating: "4.6",
//                 img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=600&q=80",
//               },
//             ].map((r, i) => (
//               <div
//                 key={i}
//                 className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden hover:scale-[1.02] hover:shadow-xl hover:brightness-105 transition"
//               >
//                 <img
//                   src={r.img}
//                   alt={`${r.name} preview`}
//                   loading="lazy"
//                   decoding="async"
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-6 text-center">
//                   <h3 className="text-xl font-semibold text-primary">
//                     {r.name}
//                   </h3>
//                   <p className="text-secondary dark:text-gray-300">{r.types}</p>
//                   <span className="text-gray-500 text-sm">⭐ {r.rating}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white dark:bg-gray-900 py-10 w-full">
//         <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center">
//           <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0 text-center md:text-left">
//             © {new Date().getFullYear()} QuickBite. All rights reserved.
//           </p>
//           <div className="flex gap-4 justify-center md:justify-end">
//             {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
//               (Icon, i) => (
//                 <a
//                   key={i}
//                   href="#"
//                   className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
//                   aria-label={`Social ${i}`}
//                 >
//                   <Icon size={18} />
//                 </a>
//               )
//             )}
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
