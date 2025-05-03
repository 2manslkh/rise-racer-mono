import React from "react";
import { useTMA } from "@/app/context/TelegramContext"; // Adjust path if needed

const TelegramInfo: React.FC = () => {
  const { initData, isAuthenticated, user, jwt, userId, isLoading, error } =
    useTMA();

  if (error) {
    return (
      <div className="p-4 font-mono text-xs text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="font-mono text-xs text-white space-y-1 opacity-70">
      <div>{isAuthenticated ? "Authenticated" : "Not Authenticated"}</div>
      <div>User ID: {userId ?? "N/A"}</div>
      {user && (
        <pre className="p-0 m-0 bg-transparent whitespace-pre-wrap break-all">
          {JSON.stringify(user, null, 2)}
        </pre>
      )}
      <div>JWT: {jwt ?? "N/A"}</div>
      <pre className="p-0 m-0 bg-transparent whitespace-pre-wrap break-all overflow-scroll">
        InitData: {initData ?? "N/A"}
      </pre>
      {isLoading && <div>(Loading...)</div>}
    </div>
  );
};

export default TelegramInfo;
