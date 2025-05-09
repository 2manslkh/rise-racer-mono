import { Dispatch, SetStateAction } from "react";

const RebirthModal = ({
  handleShow,
}: {
  handleShow: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 z-40 h-screen md:max-h-[750px]"></div>

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-[350px] h-content">
        <div
          className={`bg-white shadow-xl rounded-[12px] transition-all duration-500 ease-in-out origin-center`}
        >
          <div className="relative w-full h-full p-2 flex flex-col gap-2 items-center">
            <div className="flex justify-between items-center">
              <p
                className="font-zen text-white text-2xl relative"
                style={{
                  WebkitTextStroke: "1.5px #74007E",
                }}
              >
                Congratulations
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-2">
            <p className="font-inter text-black text-center">
              You&apos;ve rebirthed
            </p>
            <button
              onClick={() => handleShow(false)}
              className="relative w-full bg-[#5700A3] py-2 rounded-xl"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RebirthModal;
