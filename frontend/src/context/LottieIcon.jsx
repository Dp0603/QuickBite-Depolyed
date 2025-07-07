// src/components/LottieIcon.jsx
import React from "react";
import Lottie from "lottie-react";

const LottieIcon = ({
  animationData,
  size = 28,
  loop = true,
  autoplay = true,
  colorClass = "text-primary",
  className = "",
}) => {
  return (
    <div
      className={`inline-block ${colorClass} ${className}`}
      style={{ width: size, height: size }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        className="w-full h-full filter invert brightness-0 dark:invert-0 dark:brightness-200"
      />
    </div>
  );
};

export default LottieIcon;
