import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { authenticate } from "../data/auth";
import { mockApi } from "../services/mockApi";
import type { ActiveToken, User, Venue } from "../types";

type AppContextValue = {
  user: User | null;
  venues: Venue[];
  activeToken: ActiveToken | null;
  isLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  refreshVenues: () => Promise<void>;
  joinQueue: (
    queueId: string,
    latitude: number,
    longitude: number
  ) => Promise<ActiveToken>;
  refreshToken: () => Promise<void>;
  verifyGeofence: (latitude: number, longitude: number) => Promise<void>;
  releaseToken: () => Promise<void>;
  simulateQueueAdvance: () => Promise<void>;
  simulateMoveOutside: () => Promise<void>;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [activeToken, setActiveToken] = useState<ActiveToken | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const refreshVenues = useCallback(async () => {
    const nextVenues = await mockApi.getVenues();
    setVenues(nextVenues);
  }, []);

  const refreshToken = useCallback(async () => {
    const token = await mockApi.getActiveToken();
    setActiveToken(token);
  }, []);

  useEffect(() => {
    if (user?.role === "consumer") {
      void refreshVenues();
      void refreshToken();
    }
  }, [user, refreshVenues, refreshToken]);

  useEffect(() => {
    if (!activeToken || activeToken.status === "auto_purged") {
      return;
    }

    const interval = setInterval(() => {
      void refreshToken();
    }, 5000);

    return () => clearInterval(interval);
  }, [activeToken?.id, activeToken?.status, refreshToken]);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const nextUser = authenticate(email, password);
    if (!nextUser) {
      setAuthError("Invalid email or password.");
      setIsLoading(false);
      return false;
    }

    setUser(nextUser);
    setIsLoading(false);
    return true;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setActiveToken(null);
    setVenues([]);
    setAuthError(null);
  }, []);

  const joinQueue = useCallback(
    async (queueId: string, latitude: number, longitude: number) => {
      setIsLoading(true);
      const response = await mockApi.joinQueue(queueId, latitude, longitude);
      setActiveToken(response.token);
      await refreshVenues();
      setIsLoading(false);
      return response.token;
    },
    [refreshVenues]
  );

  const verifyGeofence = useCallback(
    async (latitude: number, longitude: number) => {
      if (!activeToken) {
        return;
      }
      await mockApi.verifyRadius(activeToken.id, latitude, longitude);
      await refreshToken();
    },
    [activeToken, refreshToken]
  );

  const releaseToken = useCallback(async () => {
    await mockApi.releaseToken();
    setActiveToken(null);
    await refreshVenues();
  }, [refreshVenues]);

  const simulateQueueAdvance = useCallback(async () => {
    const next = await mockApi.simulatePositionAdvance();
    setActiveToken(next);
  }, []);

  const simulateMoveOutside = useCallback(async () => {
    await mockApi.simulateMoveOutside();
    await refreshToken();
  }, [refreshToken]);

  const value = useMemo(
    () => ({
      user,
      venues,
      activeToken,
      isLoading,
      authError,
      signIn,
      signOut,
      refreshVenues,
      joinQueue,
      refreshToken,
      verifyGeofence,
      releaseToken,
      simulateQueueAdvance,
      simulateMoveOutside
    }),
    [
      user,
      venues,
      activeToken,
      isLoading,
      authError,
      signIn,
      signOut,
      refreshVenues,
      joinQueue,
      refreshToken,
      verifyGeofence,
      releaseToken,
      simulateQueueAdvance,
      simulateMoveOutside
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
