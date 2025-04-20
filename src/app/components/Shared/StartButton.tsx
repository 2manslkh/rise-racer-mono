import React from "react";

export const BUTTON_STYLES = {
  DEFAULT: {
    width: "300px",
    aspectRatio: "350/115",
    labelTop: "30px",
    labelLeft: "85px",
    top: "-29px",
    left: "37px",
  },
  DISABLED: {
    width: "194px",
    aspectRatio: "204/54",
    labelTop: "5px",
    labelLeft: "33px",
    top: "-3px",
    left: "90px",
  },
};

const StartButton = ({
  disabled,
  handleClick,
}: {
  disabled: boolean;
  handleClick: () => void;
}) => {
  // If disabled is true, render nothing
  if (disabled) {
    return null;
  }

  // Otherwise, render the overlay button
  return (
    <div
      className={`absolute h-screen w-screen z-10 flex justify-center items-center bg-black/20 ${disabled ? "pointer-events-none" : "cursor-pointer"}`}
      onClick={disabled ? undefined : handleClick}
    >
      <div className="flex items-center justify-center text-center pointer-events-none">
        <p className="font-zen text-white text-xs animate-blink">
          Tap anywhere to start
        </p>
      </div>
    </div>
  );
};

export default StartButton;
