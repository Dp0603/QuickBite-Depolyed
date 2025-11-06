import React, { useRef } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import AddLottie from "../../assets/lottie icons/Plus.json";
import RemoveLottie from "../../assets/lottie icons/Minus.json";
import DeleteLottie from "../../assets/lottie icons/Bin side open.json";

const CustomerCartItems = ({ item, increment, decrement, removeItem }) => {
  const addRef = useRef();
  const removeRef = useRef();
  const deleteRef = useRef();

  const food = item;

  const handleIncrement = () => {
    increment();
    addRef.current?.stop();
    addRef.current?.play();
  };

  const handleDecrement = () => {
    if (food.quantity > 1) {
      decrement();
      removeRef.current?.stop();
      removeRef.current?.play();
    }
  };

  const handleRemove = () => {
    deleteRef.current?.stop();
    deleteRef.current?.play();
    setTimeout(() => removeItem(), 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative overflow-hidden p-5 rounded-3xl border border-orange-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all"
    >
      {/* Gradient Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative flex items-center gap-5">
        {/* Food Image */}
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 shadow-md">
          <img
            src={food.image || "/QuickBite.png"}
            alt={food.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

          {/* Quantity Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white flex items-center justify-center text-xs font-bold shadow-md"
          >
            {food.quantity}
          </motion.div>
        </div>

        {/* Food Details */}
        <div className="flex-1">
          <h4 className="font-extrabold text-lg text-gray-900 dark:text-white mb-1">
            {food.name}
          </h4>

          {food.note && (
            <span className="text-xs text-gray-600 dark:text-gray-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-400/20 px-3 py-1.5 rounded-lg inline-block mb-2">
              📝 {food.note}
            </span>
          )}

          <p className="text-sm text-gray-600 dark:text-gray-400">
            ₹{food.price} × {food.quantity}{" "}
            <span className="text-gray-900 dark:text-white font-bold ml-1">
              = ₹{(food.price * food.quantity).toFixed(2)}
            </span>
          </p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-3">
          {/* Decrease */}
          <motion.button
            onClick={handleDecrement}
            disabled={food.quantity === 1}
            whileHover={{
              scale: food.quantity === 1 ? 1 : 1.15,
              rotate: food.quantity === 1 ? 0 : -10,
            }}
            whileTap={{ scale: food.quantity === 1 ? 1 : 0.9 }}
            className={`rounded-full transition-transform ${
              food.quantity === 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:shadow-lg"
            }`}
          >
            <Lottie
              lottieRef={removeRef}
              animationData={RemoveLottie}
              style={{ width: 30, height: 30 }}
              autoplay={false}
              loop={false}
            />
          </motion.button>

          <span className="font-bold text-base text-gray-800 dark:text-white">
            {food.quantity}
          </span>

          {/* Increase */}
          <motion.button
            onClick={handleIncrement}
            whileHover={{ scale: 1.15, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            className="rounded-full hover:shadow-lg"
          >
            <Lottie
              lottieRef={addRef}
              animationData={AddLottie}
              style={{ width: 30, height: 30 }}
              autoplay={false}
              loop={false}
            />
          </motion.button>
        </div>

        {/* Remove */}
        <motion.button
          onClick={handleRemove}
          whileHover={{ scale: 1.2, rotate: 12 }}
          whileTap={{ scale: 0.9 }}
          className="ml-4 rounded-full text-red-500 hover:text-red-600 transition-all"
        >
          <Lottie
            lottieRef={deleteRef}
            animationData={DeleteLottie}
            style={{ width: 34, height: 34 }}
            autoplay={false}
            loop={false}
          />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CustomerCartItems;

//old
// import React, { useRef } from "react";
// import Lottie from "lottie-react";
// import AddLottie from "../../assets/lottie icons/Plus.json";
// import RemoveLottie from "../../assets/lottie icons/Minus.json";
// import DeleteLottie from "../../assets/lottie icons/Bin side open.json";

// const CustomerCartItems = ({ item, increment, decrement, removeItem }) => {
//   const addRef = useRef();
//   const removeRef = useRef();
//   const deleteRef = useRef();

//   const food = item; // item contains { id, name, price, quantity, image, note }

//   const handleIncrement = () => {
//     increment();
//     addRef.current?.stop(); // Reset animation
//     addRef.current?.play();
//   };

//   const handleDecrement = () => {
//     if (food.quantity > 1) {
//       decrement();
//       removeRef.current?.stop(); // Reset animation
//       removeRef.current?.play();
//     }
//   };

//   const handleRemove = () => {
//     deleteRef.current?.stop(); // Reset animation
//     deleteRef.current?.play();
//     // Remove item after animation completes
//     setTimeout(() => removeItem(), 600); // Adjust to match Lottie duration
//   };

//   return (
//     <div className="flex items-center gap-5 p-5 bg-white dark:bg-secondary rounded-2xl shadow hover:shadow-md transition">
//       {/* Food Image */}
//       <img
//         src={food.image || "/QuickBite.png"}
//         alt={food.name}
//         className="w-24 h-24 object-cover rounded-xl border dark:border-gray-700"
//       />

//       {/* Food Details */}
//       <div className="flex-1">
//         <h4 className="font-semibold text-lg">{food.name}</h4>
//         <p className="text-sm text-gray-500 dark:text-gray-400">
//           ₹{food.price} × {food.quantity} ={" "}
//           <span className="font-semibold text-black dark:text-white">
//             ₹{food.price * food.quantity}
//           </span>
//         </p>
//         {food.note && (
//           <p className="text-xs text-gray-400 mt-1">Note: {food.note}</p>
//         )}
//       </div>

//       {/* Quantity Controls */}
//       <div className="flex items-center gap-2">
//         <button
//           onClick={handleDecrement}
//           disabled={food.quantity === 1}
//           className={`rounded-full ${
//             food.quantity === 1
//               ? "opacity-50 cursor-not-allowed"
//               : "hover:scale-110 transition-transform"
//           }`}
//           aria-label="Decrease quantity"
//         >
//           <Lottie
//             lottieRef={removeRef}
//             animationData={RemoveLottie}
//             style={{ width: 26, height: 26 }}
//             autoplay={false}
//             loop={false}
//           />
//         </button>

//         <span className="px-2 font-semibold">{food.quantity}</span>

//         <button
//           onClick={handleIncrement}
//           className="rounded-full hover:scale-110 transition-transform"
//           aria-label="Increase quantity"
//         >
//           <Lottie
//             lottieRef={addRef}
//             animationData={AddLottie}
//             style={{ width: 26, height: 26 }}
//             autoplay={false}
//             loop={false}
//           />
//         </button>
//       </div>

//       {/* Remove Button */}
//       <button
//         onClick={handleRemove}
//         className="ml-4 text-red-500 hover:text-red-600 transition rounded-full hover:scale-110"
//         aria-label="Remove item"
//       >
//         <Lottie
//           lottieRef={deleteRef}
//           animationData={DeleteLottie}
//           style={{ width: 28, height: 28 }}
//           autoplay={false}
//           loop={false}
//         />
//       </button>
//     </div>
//   );
// };

// export default CustomerCartItems;
