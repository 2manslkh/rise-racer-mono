import { User } from "@/app/page";
import Image from "next/image";
import { useState } from "react";

type Position = {
  rank: number;
  player: string;
  pfp: string;
  score: number;
};

const MOCK_DATA: Position[] = [
  {
    rank: 1,
    player: "Anthony Mega Storm",
    pfp: "./PFP.svg",
    score: 999,
  },
  {
    rank: 2,
    player: "Anthony Mega Storm",
    pfp: "./PFP.svg",
    score: 998,
  },
  {
    rank: 3,
    player: "Anthony Mega Storm",
    pfp: "./PFP.svg",
    score: 997,
  },
  {
    rank: 4,
    player: "Anthony Mega Storm",
    pfp: "./PFP.svg",
    score: 995,
  },
  {
    rank: 5,
    player: "Anthony Mega Storm",
    pfp: "./PFP.svg",
    score: 993,
  },
  {
    rank: 6,
    player: "Anthony Mega Storm",
    pfp: "./PFP.svg",
    score: 992,
  },
  {
    rank: 7,
    player: "Anthony Mega Storm",
    pfp: "./PFP.svg",
    score: 991,
  },
  {
    rank: 8,
    player: "Anthony Mega Storm",
    pfp: "./PFP.svg",
    score: 990,
  },
];

const RenderLeaderboardRow = (data: Position, index: number) => {
  return (
    <div
      className={`relative w-full flex items-center px-4 py-2 ${index !== ROWS_PER_PAGE - 1 ? "border-b border-solid border-white" : ""}`}
    >
      <div className="flex flex-1">
        <p className="font-inter font-bold text-base text-white">{data.rank}</p>
      </div>
      <div className="flex flex-1 gap-1 items-center">
        <div className="relative min-w-[28px] min-h-[28px] rounded-full overflow-hidden border border-solid border-white">
          <Image src={data.pfp} alt={`${data.player}_PFP`} fill />
        </div>
        <p className="font-inter font-bold text-base text-white whitespace-nowrap">
          {data.player}
        </p>
      </div>
      <div className="flex flex-1 justify-end">
        <p className="font-inter font-bold text-base text-white">
          {data.score}
        </p>
      </div>
    </div>
  );
};

const ROWS_PER_PAGE = 6;

const Leaderboard = ({ user }: { user: User }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);

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
      <div className="relative w-full rounded-xl p-2 bg-[#8322F9]">
        <div className="relative w-full rounded-xl py-2 px-4 bg-[#2A004F] flex items-center">
          <div className="flex flex-1">
            <p className="font-inter font-bold text-base text-white">Rank</p>
          </div>
          <div className="flex flex-1">
            <p className="font-inter font-bold text-base text-white">Player</p>
          </div>
          <div className="flex flex-1 justify-end">
            <p className="font-inter font-bold text-base text-white">Scores</p>
          </div>
        </div>

        {MOCK_DATA.slice(
          ROWS_PER_PAGE * (currentPage - 1),
          ROWS_PER_PAGE * currentPage
        ).map((data, index) => RenderLeaderboardRow(data, index))}
      </div>

      {/* Your ranking */}
      <div className="relative w-full rounded-xl p-2 flex items-center gap-4 bg-[#8322F9]">
        <div className="relative w-[100px] h-[100px] rounded-xl overflow-hidden">
          <Image src={user.profilePicture} alt="Profile Picture" fill />
        </div>
        <div className="relative flex-1 flex flex-col justify-between h-full">
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
                01
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
                Current Score
              </p>
              <p className="font-inter font-bold text-[#E833F8] text-base">
                999
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
