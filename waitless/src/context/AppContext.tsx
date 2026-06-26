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
import { queuesByVenue } from "../data/venues";
import {
  getActiveToken,
  getVenues,
  joinQueue,
  pauseQueue,
  releaseToken,
  setSimulatedDistance,
  simulatePositionTick,
  verifyRadius
} from "../services/mockApi";
import type { ActiveToken, User, Venue } from "../types";

type AppContextValue = {
  user: User | null;
  venues: Venue[];
  activeToken: ActiveToken | null;
  distanceMeters: number;
  signIn: (email: string, password: string) => boolean;
  signOut: () => void;
  joinQueueAt: (queueId: string) => void;
  refreshGeofence: () => void;
  moveOutsideRadius: () => void;
  moveInsideRadius: () => void;
  releaseActiveToken: () => void;
  pauseActiveQueue: (minutes: number) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [venues, setVenues] = useState<Venue[]>(getVenues());
  const [activeToken, setActiveToken] = useState<ActiveToken | null>(
    getActiveToken()
  );
  const [distanceMeters, setDistanceMeters] = useState(45);

  const signIn = useCallback((email: string, password: string) => {
    const account = authenticate(email, password);
    if (!account) return false;
    setUser(account);
    return true;
  }, []);

  const signOut = useCallback(() => {
    releaseToken();
    setUser(null);
    setActiveToken(null);
    setDistanceMeters(45);
  }, []);

  const joinQueueAt = useCallback((queueId: string) => {
    const allQueues = Object.values(queuesByVenue).flat();
    const queue = allQueues.find((q) => q.id === queueId);
    const venue = getVenues().find((v) => v.id === queue?.venueId) ?? getVenues()[0];
    const token = joinQueue(queueId, venue.latitude, venue.longitude);
    setActiveToken({ ...token });
    setVenues(getVenues());
    setDistanceMeters(45);
  }, []);

  const refreshGeofence = useCallback(() => {
    const token = getActiveToken();
    if (!token) return;

    const result = verifyRadius(token.lastKnownLat, token.lastKnownLng);
    setDistanceMeters(result.distanceMeters);
    setActiveToken(getActiveToken() ? { ...getActiveToken()! } : null);
  }, []);

  const moveOutsideRadius = useCallback(() => {
    const token = getActiveToken();
    if (!token) return;
    setSimulatedDistance(280);
    const result = verifyRadius(
      token.initialLat + 0.003,
      token.initialLng + 0.003
    );
    setDistanceMeters(result.distanceMeters);
    setActiveToken(getActiveToken() ? { ...getActiveToken()! } : null);
  }, []);

  const moveInsideRadius = useCallback(() => {
    const token = getActiveToken();
    if (!token) return;
    setSimulatedDistance(45);
    const result = verifyRadius(token.initialLat, token.initialLng);
    setDistanceMeters(result.distanceMeters);
    setActiveToken(getActiveToken() ? { ...getActiveToken()! } : null);
  }, []);

  const releaseActiveToken = useCallback(() => {
    releaseToken();
    setActiveToken(null);
    setDistanceMeters(45);
    setVenues(getVenues());
  }, []);

  const pauseActiveQueue = useCallback((minutes: number) => {
    pauseQueue(minutes);
    setActiveToken(getActiveToken() ? { ...getActiveToken()! } : null);
  }, []);

  useEffect(() => {
    if (!activeToken || activeToken.status !== "in_queue") return;

    const positionInterval = setInterval(() => {
      simulatePositionTick();
      setActiveToken(getActiveToken() ? { ...getActiveToken()! } : null);
    }, 8000);

    const geofenceInterval = setInterval(() => {
      refreshGeofence();
    }, 15000);

    return () => {
      clearInterval(positionInterval);
      clearInterval(geofenceInterval);
    };
  }, [activeToken?.id, activeToken?.status, refreshGeofence]);

  const value = useMemo(
    () => ({
      user,
      venues,
      activeToken,
      distanceMeters,
      signIn,
      signOut,
      joinQueueAt,
      refreshGeofence,
      moveOutsideRadius,
      moveInsideRadius,
      releaseActiveToken,
      pauseActiveQueue
    }),
    [
      user,
      venues,
      activeToken,
      distanceMeters,
      signIn,
      signOut,
      joinQueueAt,
      refreshGeofence,
      moveOutsideRadius,
      moveInsideRadius,
      releaseActiveToken,
      pauseActiveQueue
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
