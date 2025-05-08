"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  retrieveRawInitData,
  retrieveLaunchParams,
  // mockTelegramEnv,
} from "@telegram-apps/sdk";

// Define types
interface TelegramUser {
  telegram_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string;
}

interface TelegramAuthContextType {
  initData: string | null;
  initDataRaw: string | null;
  isAuthenticated: boolean;
  user: TelegramUser | null;
  jwt: string | null;
  userId: number | null;
  isLoading: boolean;
  error: string | null;
  player: TelegramAuthResponse;
  authenticate: () => Promise<void>;
}

interface TelegramAuthResponse {
  boundAddress: string;
  pk: string;
  address: string;
}

// Create context
const TelegramAuthContext = createContext<TelegramAuthContextType | undefined>(
  undefined
);

// Provider component
interface TelegramAuthProviderProps {
  children: ReactNode;
}

export const TelegramAuthProvider: React.FC<TelegramAuthProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user /* setUser */] = useState<TelegramUser | null>(null); // Commented out setUser
  const [jwt /* setJwt */] = useState<string | null>(null); // Commented out setJwt
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initDataRaw, setInitDataRaw] = useState<string | null>(null);
  const [initData, setInitData] = useState<unknown>(null);
  const [player, setPlayer] = useState<TelegramAuthResponse>({
    boundAddress: "",
    pk: "",
    address: "",
  });

  const authenticate = async () => {
    try {
      // const initDataRaw = retrieveRawInitData();
      const launchParams = retrieveLaunchParams();
      console.log("🚀 | authenticate | launchParams:", launchParams);
      const rawParams = retrieveRawInitData();
      if (rawParams) {
        setInitDataRaw(rawParams);
      } else {
        setError("Not running in a Telegram Mini App");
        setIsLoading(false);
        // return;
      }

      setInitData(launchParams);
      // setInitDataRaw(rawParams);
      const response = await fetch(
        "https://xzojvcgeztikkdxqryko.supabase.co/functions/v1/hotwallet-bind",
        {
          method: "POST",
          headers: {
            Authorization: `tma ${rawParams}`,
          },
        }
      );
      const responseText = (await response.json()) as TelegramAuthResponse;

      setPlayer(responseText);
    } catch (err: unknown) {
      // Changed type from any to unknown
      // Type check for error message
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || "Failed to authenticate");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    authenticate();
  }, []);

  const userId = user ? user.telegram_id : null;

  return (
    <TelegramAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        jwt,
        userId,
        isLoading,
        error,
        initData: initData as string | null,
        initDataRaw,
        player,
        authenticate,
      }}
    >
      {children}
    </TelegramAuthContext.Provider>
  );
};

// Combined hook
export const useTMA = (): TelegramAuthContextType => {
  const context = useContext(TelegramAuthContext);
  if (!context) {
    throw new Error("useTMA must be used within a TelegramAuthProvider");
  }
  return context;
};
