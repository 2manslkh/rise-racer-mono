import React, { useState, useEffect, useCallback } from "react";

interface LogEntry {
  id: number;
  velocity: number;
  txTime: number;
  timestamp: number; // Added for timeout management
}

let logIdCounter = 0;

const OnScreenLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((velocity: number, txTime: number) => {
    const newLog: LogEntry = {
      id: logIdCounter++,
      velocity,
      txTime,
      timestamp: Date.now(),
    };
    setLogs((prevLogs) => [newLog, ...prevLogs]); // Add new logs to the top

    // Set timeout to remove the log after 1.5 seconds
    setTimeout(() => {
      setLogs((currentLogs) =>
        currentLogs.filter((log) => log.id !== newLog.id)
      );
    }, 1500);
  }, []);

  // Example function to demonstrate adding logs (replace with actual trigger)
  useEffect(() => {
    const interval = setInterval(() => {
      addLog(Math.random() * 10, Math.random() * 500);
    }, 3000); // Add a log every 3 seconds for testing
    return () => clearInterval(interval);
  }, [addLog]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
        display: "flex",
        flexDirection: "column-reverse", // Stack logs upwards from the bottom
        gap: "5px",
        zIndex: 1, // Ensure logs are on top
        color: "white", // Example color
        textShadow: "1px 1px 2px black", // Example text shadow for readability
      }}
    >
      {logs.map((log) => (
        <div
          key={log.id}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            padding: "5px 10px",
            borderRadius: "4px",
          }}
        >
          +{log.velocity.toFixed(2)} m/s tx mined in {log.txTime.toFixed(0)} ms
        </div>
      ))}
    </div>
  );
};

export default OnScreenLogs;
