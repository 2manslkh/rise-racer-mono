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

  useEffect(() => {
    const authenticate = async () => {
      // mock
      // mockTelegramEnv({
      //   launchParams:
      //     "tgWebAppData=user%3D%257B%2522id%2522%253A279058397%252C%2522first_name%2522%253A%2522Vladislav%2522%252C%2522last_name%2522%253A%2522Kibenko%2522%252C%2522username%2522%253A%2522vdkfrost%2522%252C%2522language_code%2522%253A%2522ru%2522%252C%2522is_premium%2522%253Atrue%252C%2522allows_write_to_pm%2522%253Atrue%252C%2522photo_url%2522%253A%2522https%253A%255C%252F%255C%252Ft.me%255C%252Fi%255C%252Fuserpic%255C%252F320%255C%252F4FPEE4tmP3ATHa57u6MqTDih13LTOiMoKoLDRG4PnSA.svg%2522%257D%26chat_instance%3D-9019086117643313246%26chat_type%3Dsender%26auth_date%3D1747409902%26signature%3DFNWSy6kv5n4kkmYYmfTbrgRtswTvwXgHTRWBVjp-YOv2srtMFSYCWZ9nGr_PohWZeWcooFo_oQgsnTJge3JdBA%26hash%3D4c710b1d446dd4fd301c0efbf7c31627eca193a2e657754c9e0612cb1eb71d90&tgWebAppVersion=8.0&tgWebAppPlatform=tdesktop&tgWebAppThemeParams=%7B%22accent_text_color%22%3A%22%236ab3f2%22%2C%22bg_color%22%3A%22%2317212b%22%2C%22bottom_bar_bg_color%22%3A%22%2317212b%22%2C%22button_color%22%3A%22%235289c1%22%2C%22button_text_color%22%3A%22%23ffffff%22%2C%22destructive_text_color%22%3A%22%23ec3942%22%2C%22header_bg_color%22%3A%22%2317212b%22%2C%22hint_color%22%3A%22%23708599%22%2C%22link_color%22%3A%22%236ab3f3%22%2C%22secondary_bg_color%22%3A%22%23232e3c%22%2C%22section_bg_color%22%3A%22%2317212b%22%2C%22section_header_text_color%22%3A%22%236ab3f3%22%2C%22section_separator_color%22%3A%22%23111921%22%2C%22subtitle_text_color%22%3A%22%23708599%22%2C%22text_color%22%3A%22%23f5f5f5%22%7D",
      // });
      // checkIsTelegramApp();
      // mock end

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
