import React, { useRef } from "react";
import Lottie from "lottie-react";
import AddLottie from "../../assets/lottie icons/Plus.json";
import RemoveLottie from "../../assets/lottie icons/Minus.json";
import DeleteLottie from "../../assets/lottie icons/Bin side open.json";

const CustomerCartItems = ({ item, increment, decrement, removeItem }) => {
  const addRef = useRef();
  const removeRef = useRef();
  const deleteRef = useRef();

  const food = item; // item contains { id, name, price, quantity, image, note }

  const handleIncrement = () => {
    increment();
    addRef.current?.stop(); // Reset animation
    addRef.current?.play();
  };

  const handleDecrement = () => {
    if (food.quantity > 1) {
      decrement();
      removeRef.current?.stop(); // Reset animation
      removeRef.current?.play();
    }
  };

  const handleRemove = () => {
    deleteRef.current?.stop(); // Reset animation
    deleteRef.current?.play();
    // Remove item after animation completes
    setTimeout(() => removeItem(), 600); // Adjust to match Lottie duration
  };

  return (
    <div className="flex items-center gap-5 p-5 bg-white dark:bg-secondary rounded-2xl shadow hover:shadow-md transition">
      {/* Food Image */}
      <img
        src={food.image || "/QuickBite.png"}
        alt={food.name}
        className="w-24 h-24 object-cover rounded-xl border dark:border-gray-700"
      />

      {/* Food Details */}
      <div className="flex-1">
        <h4 className="font-semibold text-lg">{food.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ₹{food.price} × {food.quantity} ={" "}
          <span className="font-semibold text-black dark:text-white">
            ₹{food.price * food.quantity}
          </span>
        </p>
        {food.note && (
          <p className="text-xs text-gray-400 mt-1">Note: {food.note}</p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrement}
          disabled={food.quantity === 1}
          className={`rounded-full ${
            food.quantity === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-110 transition-transform"
          }`}
          aria-label="Decrease quantity"
        >
          <Lottie
            lottieRef={removeRef}
            animationData={RemoveLottie}
            style={{ width: 26, height: 26 }}
            autoplay={false}
            loop={false}
          />
        </button>

        <span className="px-2 font-semibold">{food.quantity}</span>

        <button
          onClick={handleIncrement}
          className="rounded-full hover:scale-110 transition-transform"
          aria-label="Increase quantity"
        >
          <Lottie
            lottieRef={addRef}
            animationData={AddLottie}
            style={{ width: 26, height: 26 }}
            autoplay={false}
            loop={false}
          />
        </button>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="ml-4 text-red-500 hover:text-red-600 transition rounded-full hover:scale-110"
        aria-label="Remove item"
      >
        <Lottie
          lottieRef={deleteRef}
          animationData={DeleteLottie}
          style={{ width: 28, height: 28 }}
          autoplay={false}
          loop={false}
        />
      </button>
    </div>
  );
};

export default CustomerCartItems;
