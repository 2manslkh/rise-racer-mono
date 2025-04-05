"use client";
import { useState } from "react";

const Toggle = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-30 h-8 flex items-center rounded-full p-1 transition-colors duration-300 bg-cover bg-center border border-solid border-toggle-on`}
      style={{
        backgroundImage: enabled
          ? 'url("/SoundOn.svg")'
          : 'url("/SoundOff.svg")',
      }}
    >
      <div
        className={`flex items-center justify-center w-[52px] h-[26px] rounded-full shadow-md transform transition-transform duration-300 border border-solid ${
          enabled
            ? "translate-x-[58px] border-toggle-on bg-toggle-on"
            : "translate-x-0 border-toggle-off bg-toggle-off"
        }`}
      >
        <p
          className={`text-inter font-bold leading-4 ${enabled ? `text-toggle-on` : `text-toggle-off`}`}
        >
          {enabled ? "ON" : "OFF"}
        </p>
      </div>
    </button>
  );
};

export default Toggle;
