import Image from "next/image";

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
    width: "195px",
    aspectRatio: "204/54",
    labelTop: "5px",
    labelLeft: "33px",
    top: "-4px",
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
  return (
    <button
      className="relative"
      style={{
        width: disabled
          ? BUTTON_STYLES.DISABLED.width
          : BUTTON_STYLES.DEFAULT.width,
        aspectRatio: disabled
          ? BUTTON_STYLES.DISABLED.aspectRatio
          : BUTTON_STYLES.DEFAULT.aspectRatio,
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src={
            disabled
              ? "/StartInactiveButtonBackground.svg"
              : "/StartButtonBackground.svg"
          }
          alt="Start Button"
          fill
        />
      </div>

      <div
        className="absolute z-1 flex items-center justify-between"
        onClick={handleClick}
        style={{
          top: disabled
            ? BUTTON_STYLES.DISABLED.labelTop
            : BUTTON_STYLES.DEFAULT.labelTop,
          left: disabled
            ? BUTTON_STYLES.DISABLED.labelLeft
            : BUTTON_STYLES.DEFAULT.labelLeft,
        }}
      >
        <div className="relative w-7 h-7">
          <Image
            src={disabled ? "/StartInactive.svg" : "/StartActive.svg"}
            alt="Start Arrow"
            fill
          />
        </div>

        <p
          className="font-zen text-white text-[28px] relative"
          style={{
            WebkitTextStroke: disabled ? "0 currentColor" : "1.5px #f037ff",
          }}
        >
          Start
        </p>
      </div>
    </button>
  );
};

export default StartButton;
