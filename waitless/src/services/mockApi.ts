import { venues, queuesByVenue } from "../data/venues";
import type { ActiveToken, Queue, TokenStatus, Venue } from "../types";

const EARTH_RADIUS_M = 6371000;

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));

  return EARTH_RADIUS_M * c;
}

let tokenCounter = 41;
let activeToken: ActiveToken | null = null;
let simulatedDistance = 45;
let graceStartedAt: number | null = null;
let queuePaused = false;

export function getVenues(): Venue[] {
  return venues.map((v) => ({
    ...v,
    totalInQueue:
      activeToken?.venueId === v.id ? activeToken.totalInQueue : 0
  }));
}

export function getVenue(id: string): Venue | undefined {
  return getVenues().find((v) => v.id === id);
}

export function getQueuesForVenue(venueId: string): Queue[] {
  return queuesByVenue[venueId] ?? [];
}

export function getActiveToken(): ActiveToken | null {
  return activeToken;
}

export function joinQueue(
  queueId: string,
  latitude: number,
  longitude: number
): ActiveToken {
  const queue = Object.values(queuesByVenue)
    .flat()
    .find((q) => q.id === queueId);
  if (!queue) throw new Error("Queue not found");

  const venue = venues.find((v) => v.id === queue.venueId);
  if (!venue) throw new Error("Venue not found");

  tokenCounter += 1;
  const waitMinutes = Math.max(
    5,
    Math.round(queue.estimatedServiceTimeMinutes * (tokenCounter % 8))
  );
  const eta = new Date(Date.now() + waitMinutes * 60 * 1000);

  activeToken = {
    id: `token-${Date.now()}`,
    queueId: queue.id,
    venueId: venue.id,
    venueName: venue.name,
    queueName: queue.name,
    tokenNumber: tokenCounter,
    status: "in_queue",
    position: tokenCounter % 12 || 1,
    aheadCount: (tokenCounter % 12 || 1) - 1,
    totalInQueue: tokenCounter % 12 || 1,
    estimatedServiceTime: eta.toISOString(),
    estimatedWaitMinutes: waitMinutes,
    aiConfidenceWindow: "±7 minutes",
    joinedAt: new Date().toISOString(),
    initialLat: latitude,
    initialLng: longitude,
    lastKnownLat: latitude,
    lastKnownLng: longitude,
    geofenceStatus: "within_boundary",
    graceRemainingSeconds: null,
    queuePaused: false
  };

  simulatedDistance = 45;
  graceStartedAt = null;
  queuePaused = false;

  return activeToken;
}

export function verifyRadius(
  latitude: number,
  longitude: number
): {
  withinBoundary: boolean;
  distanceMeters: number;
  status: TokenStatus;
  graceRemainingSeconds: number | null;
  requiresAction: boolean;
} {
  if (!activeToken) {
    return {
      withinBoundary: true,
      distanceMeters: 0,
      status: "in_queue",
      graceRemainingSeconds: null,
      requiresAction: false
    };
  }

  const distance = haversineDistance(
    activeToken.initialLat,
    activeToken.initialLng,
    latitude,
    longitude
  );

  simulatedDistance = Math.round(distance);
  activeToken.lastKnownLat = latitude;
  activeToken.lastKnownLng = longitude;

  const venue = venues.find((v) => v.id === activeToken!.venueId);
  const radius = venue?.geofenceRadiusMeters ?? 200;

  if (distance <= radius) {
    if (activeToken.status === "out_of_bounds_warning") {
      activeToken.status = "in_queue";
      activeToken.geofenceStatus = "within_boundary";
      graceStartedAt = null;
      activeToken.graceRemainingSeconds = null;
    }
    return {
      withinBoundary: true,
      distanceMeters: Math.round(distance),
      status: activeToken.status,
      graceRemainingSeconds: null,
      requiresAction: false
    };
  }

  if (activeToken.status !== "out_of_bounds_warning") {
    activeToken.status = "out_of_bounds_warning";
    activeToken.geofenceStatus = "warning";
    graceStartedAt = Date.now();
  }

  const elapsed = graceStartedAt ? (Date.now() - graceStartedAt) / 1000 : 0;
  const remaining = Math.max(0, 180 - elapsed);

  if (remaining <= 0) {
    activeToken.status = "auto_purged";
    activeToken.geofenceStatus = "outside_boundary";
    activeToken.graceRemainingSeconds = null;
    return {
      withinBoundary: false,
      distanceMeters: Math.round(distance),
      status: "auto_purged",
      graceRemainingSeconds: null,
      requiresAction: true
    };
  }

  activeToken.graceRemainingSeconds = Math.round(remaining);
  return {
    withinBoundary: false,
    distanceMeters: Math.round(distance),
    status: "out_of_bounds_warning",
    graceRemainingSeconds: Math.round(remaining),
    requiresAction: true
  };
}

export function simulatePositionTick(): ActiveToken | null {
  if (!activeToken || activeToken.status !== "in_queue") return activeToken;

  if (activeToken.position > 1 && Math.random() > 0.7) {
    activeToken.position -= 1;
    activeToken.aheadCount = Math.max(0, activeToken.aheadCount - 1);
    activeToken.estimatedWaitMinutes = Math.max(
      1,
      activeToken.estimatedWaitMinutes - 2
    );
  }

  return activeToken;
}

export function getSimulatedDistance(): number {
  return simulatedDistance;
}

export function setSimulatedDistance(meters: number): void {
  simulatedDistance = meters;
  if (activeToken) {
    verifyRadius(
      activeToken.initialLat + meters / 111000,
      activeToken.initialLng
    );
  }
}

export function pauseQueue(durationMinutes: number): void {
  queuePaused = true;
  if (activeToken) {
    activeToken.queuePaused = true;
    activeToken.status = "paused";
    activeToken.estimatedWaitMinutes += durationMinutes;
  }
}

export function releaseToken(): void {
  activeToken = null;
  graceStartedAt = null;
  simulatedDistance = 45;
  queuePaused = false;
}

export function isQueuePaused(): boolean {
  return queuePaused;
}

export function formatEta(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}
