import React, { useRef } from "react";
import Lottie from "lottie-react";
import AddLottie from "../../assets/lottie icons/Plus.json";
import RemoveLottie from "../../assets/lottie icons/Minus.json";
import DeleteLottie from "../../assets/lottie icons/Bin side open.json";

const CartItems = ({ item, increment, decrement, removeItem }) => {
  const addRef = useRef();
  const removeRef = useRef();
  const deleteRef = useRef();

  const food = item.foodId;

  return (
    <div className="flex items-center gap-5 p-5 bg-white dark:bg-secondary rounded-2xl shadow hover:shadow-md transition">
      <img
        src={food.image || "/QuickBite.png"}
        alt={food.name}
        className="w-24 h-24 object-cover rounded-xl border dark:border-gray-700"
      />

      <div className="flex-1">
        <h4 className="font-semibold text-lg">{food.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          ₹{food.price} x {item.quantity} ={" "}
          <span className="font-semibold text-black dark:text-white">
            ₹{food.price * item.quantity}
          </span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            if (item.quantity > 1) {
              decrement();
              removeRef.current?.play();
            }
          }}
          disabled={item.quantity === 1}
          className={`rounded-full ${
            item.quantity === 1
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

        <span className="px-2 font-semibold">{item.quantity}</span>

        <button
          onClick={() => {
            increment();
            addRef.current?.play();
          }}
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

      <button
        onClick={() => {
          deleteRef.current?.play();
          setTimeout(() => removeItem(), 600);
        }}
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

export default CartItems;
