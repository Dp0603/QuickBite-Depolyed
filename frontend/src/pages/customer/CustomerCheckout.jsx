import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import API from "../../api/axios";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaListUl,
  FaArrowLeft,
  FaTruck,
  FaClock,
  FaCrown,
} from "react-icons/fa";

const CustomerCheckout = () => {
  const { user, token } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);

  const {
    cartItems = [],
    subtotal = 0,
    tax = 0,
    deliveryFee: baseDeliveryFee = 0,
    appliedDiscount = 0,
    totalPayable: baseTotalPayable = 0,
    selectedOfferId = null,
    offer = null,
    restaurantId = null,
    premiumSummary = {},
  } = location.state || {};

  const deliveryFee = Math.max(
    baseDeliveryFee - (premiumSummary.freeDelivery || 0),
    0
  );

  const totalPayable = Math.max(
    subtotal +
      tax +
      deliveryFee -
      appliedDiscount -
      (premiumSummary.extraDiscount || 0),
    0
  );

  useEffect(() => {
    if (!location.state || cartItems.length === 0) {
      navigate("/customer/cart");
    }
  }, [location.state, cartItems, navigate]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await API.get(`/addresses/entity/User/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const all = res.data.addresses || [];
        setAddresses(all);
        const def = all.find((a) => a.isDefault) || all[0];
        setDefaultAddress(def || null);
      } catch (err) {
        console.error("Failed to load addresses:", err);
      }
    };
    if (user?._id) fetchAddresses();
  }, [user, token]);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePlaceOrder = async () => {
    if (placingOrder) return;
    if (!defaultAddress) {
      alert("Please add a delivery address first.");
      return;
    }

    setPlacingOrder(true);
    try {
      const isRazorpayLoaded = await loadRazorpayScript();
      if (!isRazorpayLoaded) {
        alert("❌ Razorpay failed to load.");
        setPlacingOrder(false);
        return;
      }

      const roundedAmount = Math.round(totalPayable * 100);
      const razorpayOrderRes = await API.post("/payment/create-order", {
        amount: roundedAmount / 100,
      });

      const { razorpayOrderId, amount } = razorpayOrderRes.data;

      const options = {
        key: "rzp_test_GDBH9Rf7wvZ3R6",
        amount: amount * 100,
        currency: "INR",
        name: "QuickBite",
        description: "Food Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          const normalizedPremium = {
            freeDelivery: premiumSummary.freeDelivery > 0,
            extraDiscount: {
              type: "FLAT",
              value: premiumSummary.extraDiscount || 0,
            },
            cashback: { type: "FLAT", value: premiumSummary.cashback || 0 },
          };

          const payload = {
            customerId: user._id,
            restaurantId,
            items: cartItems.map((item) => ({
              menuItemId: item.menuItemId || item.id || item._id,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              note: item.note || "",
            })),
            subtotal,
            tax,
            originalDeliveryFee: baseDeliveryFee,
            discount: appliedDiscount,
            offerId: selectedOfferId || null,
            premiumBreakdown: normalizedPremium,
            paymentMethod: "Razorpay",
            addressId: defaultAddress._id,
            deliveryAddress: {
              addressLine: defaultAddress.addressLine,
              landmark: defaultAddress.landmark,
              city: defaultAddress.city,
              state: defaultAddress.state,
              pincode: defaultAddress.pincode,
              contactNumber: defaultAddress.contactNumber || user.phone,
              name: user.name,
            },
            paymentDetails: {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
          };

          try {
            const res = await API.post("/payment/verify-signature", payload);
            navigate("/customer/payment-success", {
              state: { order: res.data.order },
            });
          } catch (err) {
            console.error("❌ Order creation error:", err);
            alert("Order creation failed after payment.");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || "9999999999",
        },
        theme: { color: "#f97316" },
        modal: {
          ondismiss: () => {
            navigate("/customer/payment-failure", {
              state: {
                reason: "Payment cancelled or failed.",
                amount: totalPayable,
              },
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("❌ Payment initiation failed:", err);
      alert("Something went wrong while starting the payment.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden py-12 px-4 md:px-10">
      {/* Gradient Blobs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-orange-400/20 dark:bg-orange-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-orange-600 via-pink-600 to-rose-500 bg-clip-text text-transparent flex items-center gap-3 drop-shadow-sm">
            🧾 Checkout
          </h1>
          <button
            onClick={() => navigate("/customer/cart")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-orange-200 dark:border-white/10 shadow-md hover:shadow-lg transition"
          >
            <FaArrowLeft className="text-orange-500" /> Back
          </button>
        </motion.div>

        {/* Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-xl hover:shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-40"></div>
          <div className="relative">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <FaMapMarkerAlt className="text-orange-500" /> Delivery Address
            </h2>

            {!defaultAddress ? (
              <div className="text-center">
                <p className="text-red-600 text-sm mb-2">
                  ⚠️ No delivery address found.
                </p>
                <button
                  onClick={() => navigate("/customer/addresses")}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold shadow-lg"
                >
                  ➕ Add Address
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <p>{defaultAddress.addressLine}</p>
                <p>
                  {defaultAddress.city}, {defaultAddress.state} -{" "}
                  {defaultAddress.pincode}
                </p>
                <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FaTruck className="text-green-500" /> Estimated Delivery:
                  30–40 mins
                </p>
                <button
                  onClick={() => navigate("/customer/addresses")}
                  className="text-blue-600 text-sm mt-2 hover:underline"
                >
                  ✏️ Change Address
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-xl hover:shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
            <FaCreditCard className="text-orange-500" /> Payment Method
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            💳 Razorpay (UPI / Card / Wallet)
          </p>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-orange-200 dark:border-white/10 shadow-xl hover:shadow-2xl"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaListUl className="text-orange-500" /> Order Summary
          </h2>

          <ul className="text-sm mb-4 space-y-2">
            {cartItems.map((item, index) => (
              <li
                key={index}
                className="flex justify-between text-gray-700 dark:text-gray-300"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <hr className="my-3 border-gray-300 dark:border-gray-700" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            {(appliedDiscount > 0 || premiumSummary.extraDiscount > 0) && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>Discount</span>
                <span>
                  –₹
                  {(
                    appliedDiscount + (premiumSummary.extraDiscount || 0)
                  ).toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <hr className="my-3 border-gray-300 dark:border-gray-700" />

          <div className="flex justify-between text-lg font-black">
            <span>Total Payable</span>
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              ₹{totalPayable.toFixed(2)}
            </span>
          </div>
        </motion.div>

        {/* Floating Pay Button */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="sticky bottom-5 flex justify-center"
        >
          <motion.button
            onClick={handlePlaceOrder}
            disabled={placingOrder || !defaultAddress}
            whileHover={{ scale: placingOrder ? 1 : 1.05 }}
            whileTap={{ scale: placingOrder ? 1 : 0.97 }}
            className="w-full max-w-lg py-4 rounded-2xl font-bold text-white text-lg shadow-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 transition-all flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {placingOrder ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                Processing...
              </>
            ) : (
              <>
                <FaClock /> Proceed to Pay ₹{totalPayable.toFixed(2)}
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerCheckout;

//old 
// import React, { useContext, useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import API from "../../api/axios";

// const CustomerCheckout = () => {
//   const { user, token } = useContext(AuthContext);
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [addresses, setAddresses] = useState([]);
//   const [defaultAddress, setDefaultAddress] = useState(null);

//   const {
//     cartItems = [],
//     subtotal = 0,
//     tax = 0,
//     deliveryFee: baseDeliveryFee = 0,
//     appliedDiscount = 0,
//     totalPayable: baseTotalPayable = 0,
//     selectedOfferId = null,
//     offer = null,
//     restaurantId = null,
//     premiumSummary = {},
//   } = location.state || {};

//   // Adjust delivery fee & total with premium perks for UI only
//   const deliveryFee = Math.max(
//     baseDeliveryFee - (premiumSummary.freeDelivery || 0),
//     0
//   );

//   const totalPayable = Math.max(
//     subtotal +
//       tax +
//       deliveryFee -
//       appliedDiscount -
//       (premiumSummary.extraDiscount || 0),
//     0
//   );

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (!location.state || cartItems.length === 0) {
//       navigate("/cart");
//     }
//   }, [location.state, cartItems, navigate]);

//   // Fetch addresses
//   useEffect(() => {
//     const fetchAddresses = async () => {
//       try {
//         const res = await API.get(`/addresses/entity/User/${user._id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const all = res.data.addresses || [];
//         setAddresses(all);
//         const def = all.find((a) => a.isDefault) || all[0];
//         setDefaultAddress(def || null);
//       } catch (err) {
//         console.error("Failed to load addresses:", err);
//       }
//     };

//     if (user?._id) fetchAddresses();
//   }, [user, token]);

//   // Load Razorpay script
//   const loadRazorpayScript = () =>
//     new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });

//   // Handle place order
//   const handlePlaceOrder = async () => {
//     if (placingOrder) return;
//     if (!defaultAddress) {
//       alert("Please add a delivery address first.");
//       return;
//     }

//     setPlacingOrder(true);

//     try {
//       const isRazorpayLoaded = await loadRazorpayScript();
//       if (!isRazorpayLoaded) {
//         alert("❌ Razorpay failed to load.");
//         setPlacingOrder(false);
//         return;
//       }

//       const roundedAmount = Math.round(totalPayable * 100);
//       const razorpayOrderRes = await API.post("/payment/create-order", {
//         amount: roundedAmount / 100,
//       });

//       const { razorpayOrderId, amount } = razorpayOrderRes.data;

//       const options = {
//         key: "rzp_test_GDBH9Rf7wvZ3R6", // Replace with live key in prod
//         amount: amount * 100,
//         currency: "INR",
//         name: "QuickBite",
//         description: "Food Order Payment",
//         order_id: razorpayOrderId,
//         handler: async function (response) {
//           const normalizedPremium = {
//             freeDelivery: premiumSummary.freeDelivery > 0, // Boolean
//             extraDiscount: {
//               type: "FLAT", // or "PERCENT" if your logic uses percentage
//               value: premiumSummary.extraDiscount || 0,
//             },
//             cashback: {
//               type: "FLAT", // or "PERCENT" if your logic uses percentage
//               value: premiumSummary.cashback || 0,
//             },
//           };

//           const payload = {
//             customerId: user._id,
//             restaurantId,
//             items: cartItems.map((item) => ({
//               menuItemId: item.menuItemId || item.id || item._id,
//               name: item.name,
//               price: item.price,
//               quantity: item.quantity,
//               note: item.note || "",
//             })),
//             subtotal,
//             tax,
//             originalDeliveryFee: baseDeliveryFee, // send original fee, backend applies premium
//             discount: appliedDiscount, // only offer discount
//             offerId: selectedOfferId || null,
//             premiumBreakdown: normalizedPremium, // use normalized object
//             paymentMethod: "Razorpay",
//             addressId: defaultAddress._id,
//             deliveryAddress: {
//               addressLine: defaultAddress.addressLine,
//               landmark: defaultAddress.landmark,
//               city: defaultAddress.city,
//               state: defaultAddress.state,
//               pincode: defaultAddress.pincode,
//               contactNumber: defaultAddress.contactNumber || user.phone,
//               name: user.name,
//             },
//             paymentDetails: {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             },
//           };

//           try {
//             const res = await API.post("/payment/verify-signature", payload);
//             navigate("/customer/payment-success", {
//               state: { order: res.data.order },
//             });
//           } catch (err) {
//             console.error("❌ Order creation error:", err);
//             alert("Order creation failed after payment.");
//           }
//         },
//         prefill: {
//           name: user.name,
//           email: user.email,
//           contact: user.phone || "9999999999",
//         },
//         notes: { address: "QuickBite - Test Payment" },
//         theme: { color: "#f97316" },
//         modal: {
//           ondismiss: () => {
//             navigate("/customer/payment-failure", {
//               state: {
//                 reason: "Payment was cancelled or failed.",
//                 amount: totalPayable,
//               },
//             });
//           },
//         },
//       };

//       const razorpay = new window.Razorpay(options);
//       razorpay.open();
//     } catch (err) {
//       console.error("❌ Payment initiation failed:", err);
//       alert("Something went wrong while starting the payment.");
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   return (
//     <div className="p-6 text-gray-800 dark:text-white max-w-3xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">🧾 Checkout</h1>

//       {/* Delivery Address */}
//       <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 mb-6">
//         <h2 className="text-xl font-semibold mb-3">📍 Delivery Address</h2>
//         {!defaultAddress ? (
//           <div>
//             <p className="text-red-600 text-sm mb-2">
//               ⚠️ No delivery address found.
//             </p>
//             <button
//               className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
//               onClick={() => navigate("/customer/addresses")}
//             >
//               ➕ Add Address
//             </button>
//           </div>
//         ) : (
//           <div>
//             <p>
//               {defaultAddress.addressLine},{" "}
//               {defaultAddress.landmark && `${defaultAddress.landmark}, `}
//               {defaultAddress.city}, {defaultAddress.state} -{" "}
//               {defaultAddress.pincode}
//             </p>
//             <button
//               className="mt-2 text-sm text-blue-600 hover:underline"
//               onClick={() => navigate("/customer/addresses")}
//             >
//               ✏️ Change Address
//             </button>
//           </div>
//         )}
//         <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//           🚚 Estimated Delivery: 30–40 mins
//         </div>
//       </div>

//       {/* Payment Method */}
//       <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 mb-6">
//         <h2 className="text-xl font-semibold mb-3">💳 Payment Method</h2>
//         <p>Razorpay (UPI / Card / Wallet)</p>
//       </div>

//       {/* Order Summary */}
//       <div className="bg-white dark:bg-secondary p-5 rounded-xl shadow border dark:border-gray-700 mb-6">
//         <h2 className="text-xl font-semibold mb-3">🧂 Order Summary</h2>

//         {/* Premium Benefits */}
//         {premiumSummary &&
//           (premiumSummary.extraDiscount ||
//             premiumSummary.freeDelivery ||
//             premiumSummary.cashback) && (
//             <div className="mb-2 p-2 bg-green-50 dark:bg-green-900 rounded">
//               <h4 className="font-semibold text-green-800 dark:text-green-300">
//                 💎 Premium Benefits Applied:
//               </h4>
//               {premiumSummary.freeDelivery > 0 && (
//                 <p className="text-green-600 dark:text-green-300">
//                   Free Delivery: ₹{premiumSummary.freeDelivery.toFixed(0)}
//                 </p>
//               )}
//               {premiumSummary.extraDiscount > 0 && (
//                 <p className="text-green-600 dark:text-green-300">
//                   Extra Discount: ₹{premiumSummary.extraDiscount.toFixed(0)}
//                 </p>
//               )}
//               {premiumSummary.cashback > 0 && (
//                 <p className="text-green-600 dark:text-green-300">
//                   Cashback Eligible: ₹{premiumSummary.cashback.toFixed(0)}
//                 </p>
//               )}
//             </div>
//           )}

//         {offer && (
//           <div className="text-sm text-green-700 dark:text-green-400 mb-2">
//             🏷️ Offer Applied: <strong>{offer.title}</strong>
//           </div>
//         )}

//         <ul className="text-sm mb-3 space-y-2">
//           {cartItems.map((item, index) => (
//             <li className="flex justify-between" key={index}>
//               <span>
//                 {item.name} × {item.quantity}
//               </span>
//               <span>₹{(item.price * item.quantity).toFixed(2)}</span>
//             </li>
//           ))}
//         </ul>

//         <div className="space-y-1 text-sm">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>₹{subtotal.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Tax</span>
//             <span>₹{tax.toFixed(2)}</span>
//           </div>
//           <div className="flex justify-between">
//             <span>Delivery Fee</span>
//             <span>
//               ₹{deliveryFee.toFixed(2)}{" "}
//               {deliveryFee === 0 && (
//                 <span className="text-green-600 text-xs">(Free)</span>
//               )}
//             </span>
//           </div>
//           {(appliedDiscount > 0 || premiumSummary.extraDiscount > 0) && (
//             <div className="flex justify-between text-green-600">
//               <span>Discount</span>
//               <span>
//                 –₹
//                 {(
//                   appliedDiscount + (premiumSummary.extraDiscount || 0)
//                 ).toFixed(2)}
//               </span>
//             </div>
//           )}
//         </div>

//         <hr className="my-2 border-gray-300 dark:border-gray-600" />
//         <div className="flex justify-between font-medium text-lg">
//           <span>Total Payable</span>
//           <span>₹{totalPayable.toFixed(2)}</span>
//         </div>
//       </div>

//       {/* Pay Button */}
//       <button
//         onClick={handlePlaceOrder}
//         disabled={placingOrder || !defaultAddress}
//         className="w-full bg-primary hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60 flex justify-center items-center gap-2"
//       >
//         {placingOrder ? (
//           <>
//             <svg
//               className="animate-spin h-5 w-5 text-white"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
//               ></path>
//             </svg>
//             Placing Order...
//           </>
//         ) : (
//           "Proceed to Pay"
//         )}
//       </button>
//     </div>
//   );
// };

// export default CustomerCheckout;
