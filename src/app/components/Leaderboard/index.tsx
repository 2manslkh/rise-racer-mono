import Image from "next/image";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import { shortenAddress } from "@/app/lib/address";
import { useToast } from "@/app/hooks/useToast";
import { useHotWallet } from "@/app/context/HotWalletContext";
import { checksumAddress } from "viem";

const LEADERBOARD_URL =
  "https://xzojvcgeztikkdxqryko.supabase.co/functions/v1/dynamic-action";

export type Position = {
  rank: number;
  address: string;
  total_velocity: number;
};

const RenderLeaderboardRow = (
  data: Position,
  totalNumber: number,
  index: number
) => {
  return (
    <div
      key={data.address}
      className={`relative w-full flex items-center px-4 py-2 ${index !== totalNumber - 1 ? "border-b border-solid border-white" : ""}`}
    >
      <div className="flex flex-1">
        <p className="font-inter font-bold text-base text-white">{data.rank}</p>
      </div>
      <div className="flex flex-1 gap-1 items-center">
        <p className="font-inter font-bold text-base text-white whitespace-nowrap">
          {shortenAddress(data.address)}
        </p>
      </div>
      <div className="flex flex-1 justify-end">
        <p className="font-inter font-bold text-base text-white">
          {data.total_velocity}
        </p>
      </div>
    </div>
  );
};

const ROWS_PER_PAGE = 6;

const Leaderboard = () => {
  const toast = useToast();
  const { address } = useHotWallet();
  const [data, setData] = useState<Position[]>([]);
  const [selfData, setSelfData] = useState<Position>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${LEADERBOARD_URL}?page=${currentPage}&limit=${ROWS_PER_PAGE}`
        );
        const responseObj = await response.json();
        setData(responseObj.data);

        if (totalCount === 0) {
          setTotalCount(responseObj.totalCount);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to get rankings");
      } finally {
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const fetchSelf = async () => {
      try {
        const response = await fetch(
          `${LEADERBOARD_URL}?address=${checksumAddress(address as `0x${string}`)}`
        );
        const { data: _data } = await response.json();
        if (_data.length) {
          setSelfData(_data[0]);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to get own ranking");
      }
    };

    fetchSelf();
  }, [address]);

  return (
    <div className="relative w-full h-full bg-[#2A004F] flex flex-col py-4 px-2 items-center gap-4">
      <p
        className="font-zen text-white text-[26px] relative"
        style={{
          WebkitTextStroke: "1.5px #74007E",
        }}
      >
        LEADERBOARD
      </p>

      {/* Leaderboard */}
      <div className="relative w-full rounded-xl p-2 bg-[#8322F9] flex flex-col gap-1">
        <div className="relative w-full rounded-xl py-2 px-4 bg-[#2A004F] flex items-center">
          <div className="flex flex-1">
            <p className="font-inter font-bold text-base text-white">Rank</p>
          </div>
          <div className="flex flex-1">
            <p className="font-inter font-bold text-base text-white">Player</p>
          </div>
          <div className="flex flex-1 justify-end">
            <p className="font-inter font-bold text-base text-white">
              Velocity
            </p>
          </div>
        </div>

        {data.map((_data, index) =>
          RenderLeaderboardRow(_data, data.length, index)
        )}

        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalNumberOfData={totalCount}
          pageSize={ROWS_PER_PAGE}
        />
      </div>

      {/* Your ranking */}
      <div className="relative w-full rounded-xl p-2 flex items-center gap-4 bg-[#8322F9]">
        <div className="relative flex-1 flex flex-col justify-between h-full gap-2">
          <div className="relative flex items-center py-1 px-2 bg-[#2A004F] rounded-xl h-[45px] gap-1">
            <div className="w-[42px] flex items-center justify-center">
              <div className="relative w-9 h-9">
                <Image src={"./Trophy.svg"} alt="Ranking" fill />
              </div>
            </div>

            <div className="flex items-center justify-between flex-1">
              <p className="font-inter font-bold text-white text-base">
                Your Ranking
              </p>
              <p className="font-inter font-bold text-[#E833F8] text-base">
                {selfData?.rank || 0}
              </p>
            </div>
          </div>
          <div className="relative flex items-center py-1 px-2 bg-[#2A004F] rounded-xl h-[45px] gap-1">
            <div className="w-[42px] flex items-center justify-center">
              <div className="relative w-[42px] h-[34px]">
                <Image src={"./Badge.svg"} alt="Ranking" fill />
              </div>
            </div>
            <div className="flex items-center justify-between flex-1">
              <p className="font-inter font-bold text-white text-base">
                Current Velocity
              </p>
              <p className="font-inter font-bold text-[#E833F8] text-base">
                {selfData?.total_velocity || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
