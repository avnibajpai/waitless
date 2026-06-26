import { getQueueById, venues } from "../data/venues";
import type {
  ActiveToken,
  JoinQueueResponse,
  QueueStatusResponse,
  StaffMetrics,
  StaffToken,
  TokenStatus,
  VerifyRadiusResponse
} from "../types";

const EARTH_RADIUS_METERS = 6371000;
const GRACE_PERIOD_SECONDS = 180;

let tokenCounter = 42;
let activeToken: ActiveToken | null = null;
let graceStartedAt: number | null = null;
let queuePaused = false;
let delayInjectionMinutes = 0;

const staffTokens: StaffToken[] = [
  {
    id: "token-101",
    tokenNumber: 38,
    displayName: "Alex M.",
    status: "serving",
    position: 1,
    estimatedWaitMinutes: 0,
    geofenceStatus: "within_boundary"
  },
  {
    id: "token-102",
    tokenNumber: 39,
    displayName: "Jordan K.",
    status: "in_queue",
    position: 2,
    estimatedWaitMinutes: 8,
    geofenceStatus: "within_boundary"
  },
  {
    id: "token-103",
    tokenNumber: 40,
    displayName: "Sam R.",
    status: "out_of_bounds_warning",
    position: 3,
    estimatedWaitMinutes: 16,
    geofenceStatus: "outside_boundary"
  },
  {
    id: "token-104",
    tokenNumber: 41,
    displayName: "Taylor P.",
    status: "in_queue",
    position: 4,
    estimatedWaitMinutes: 24,
    geofenceStatus: "within_boundary"
  }
];

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const deltaPhi = toRad(lat2 - lat1);
  const deltaLambda = toRad(lon2 - lon1);

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));

  return EARTH_RADIUS_METERS * c;
}

function addMinutes(date: Date, minutes: number): string {
  return new Date(date.getTime() + minutes * 60_000).toISOString();
}

function buildToken(
  queueId: string,
  latitude: number,
  longitude: number
): ActiveToken {
  const match = getQueueById(queueId);
  if (!match) {
    throw new Error("QUEUE_NOT_FOUND");
  }

  const { venue, queue } = match;
  tokenCounter += 1;
  const position = queue.totalInQueue + 1;
  const waitMinutes =
    position * queue.estimatedServiceTimeMinutes + delayInjectionMinutes;
  const now = new Date();

  return {
    id: `token-${tokenCounter}`,
    queueId: queue.id,
    venueId: venue.id,
    venueName: venue.name,
    queueName: queue.name,
    tokenNumber: tokenCounter,
    status: "in_queue",
    position,
    aheadCount: position - 1,
    totalInQueue: position,
    estimatedServiceTime: addMinutes(now, waitMinutes),
    estimatedWaitMinutes: waitMinutes,
    aiConfidenceWindow: "±7 minutes",
    joinedAt: now.toISOString(),
    geofenceStatus: "within_boundary",
    graceRemainingSeconds: null,
    distanceMeters: 0,
    initialLat: latitude,
    initialLng: longitude,
    lastKnownLat: latitude,
    lastKnownLng: longitude
  };
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockApi = {
  async getVenues() {
    await delay(200);
    return venues.map((venue) => ({
      ...venue,
      totalInQueue: venue.queues.reduce(
        (sum, queue) => sum + queue.totalInQueue,
        activeToken?.venueId === venue.id ? 1 : 0
      )
    }));
  },

  async joinQueue(
    queueId: string,
    latitude: number,
    longitude: number
  ): Promise<JoinQueueResponse> {
    await delay(350);
    activeToken = buildToken(queueId, latitude, longitude);
    graceStartedAt = null;
    return { token: { ...activeToken } };
  },

  async getQueueStatus(tokenId: string): Promise<QueueStatusResponse | null> {
    await delay(120);
    if (!activeToken || activeToken.id !== tokenId) {
      return null;
    }
    return {
      token: { ...activeToken },
      queuePaused
    };
  },

  async getActiveToken(): Promise<ActiveToken | null> {
    await delay(80);
    return activeToken ? { ...activeToken } : null;
  },

  async verifyRadius(
    tokenId: string,
    latitude: number,
    longitude: number
  ): Promise<VerifyRadiusResponse | null> {
    await delay(100);
    if (!activeToken || activeToken.id !== tokenId) {
      return null;
    }

    const match = getQueueById(activeToken.queueId);
    if (!match) {
      return null;
    }

    const distance = haversineDistance(
      activeToken.initialLat,
      activeToken.initialLng,
      latitude,
      longitude
    );
    const radius = match.venue.geofenceRadiusMeters;
    const withinBoundary = distance <= radius;

    activeToken.lastKnownLat = latitude;
    activeToken.lastKnownLng = longitude;
    activeToken.distanceMeters = Math.round(distance);

    let status: TokenStatus = activeToken.status;
    let graceRemainingSeconds: number | null = null;
    let requiresAction = false;

    if (withinBoundary) {
      activeToken.geofenceStatus = "within_boundary";
      if (activeToken.status === "out_of_bounds_warning") {
        status = "in_queue";
        graceStartedAt = null;
      } else if (activeToken.status !== "auto_purged") {
        status = queuePaused ? "paused" : "in_queue";
      }
    } else if (activeToken.status !== "auto_purged") {
      activeToken.geofenceStatus = "outside_boundary";
      requiresAction = true;

      if (activeToken.status !== "out_of_bounds_warning") {
        status = "out_of_bounds_warning";
        graceStartedAt = Date.now();
      } else if (graceStartedAt) {
        const elapsed = Math.floor((Date.now() - graceStartedAt) / 1000);
        graceRemainingSeconds = Math.max(GRACE_PERIOD_SECONDS - elapsed, 0);

        if (graceRemainingSeconds <= 0) {
          status = "auto_purged";
          activeToken.position = 0;
          activeToken.aheadCount = 0;
        }
      }
    }

    activeToken.status = status;
    activeToken.graceRemainingSeconds = graceRemainingSeconds;

    return {
      withinBoundary,
      distanceMeters: Math.round(distance),
      status,
      graceRemainingSeconds,
      requiresAction
    };
  },

  async simulatePositionAdvance(): Promise<ActiveToken | null> {
    if (!activeToken || activeToken.status === "auto_purged") {
      return null;
    }

    if (activeToken.position > 1) {
      activeToken.position -= 1;
      activeToken.aheadCount = activeToken.position - 1;
      activeToken.estimatedWaitMinutes = Math.max(
        activeToken.estimatedWaitMinutes - 3,
        1
      );
      activeToken.estimatedServiceTime = addMinutes(
        new Date(),
        activeToken.estimatedWaitMinutes
      );
    } else {
      activeToken.status = "serving";
      activeToken.estimatedWaitMinutes = 0;
    }

    return { ...activeToken };
  },

  async simulateMoveOutside(): Promise<VerifyRadiusResponse | null> {
    if (!activeToken) {
      return null;
    }
    return mockApi.verifyRadius(
      activeToken.id,
      activeToken.initialLat + 0.003,
      activeToken.initialLng + 0.003
    );
  },

  async releaseToken(): Promise<void> {
    await delay(150);
    activeToken = null;
    graceStartedAt = null;
  },

  async getStaffTokens(): Promise<StaffToken[]> {
    await delay(200);
    return staffTokens;
  },

  async getStaffMetrics(): Promise<StaffMetrics> {
    await delay(150);
    return {
      averageWaitMinutes: 14,
      tokensPerHour: 18,
      geofenceViolationRate: 6,
      totalInQueue: staffTokens.length
    };
  },

  async pauseQueue(reason: string, durationMinutes: number) {
    await delay(300);
    queuePaused = true;
    delayInjectionMinutes += durationMinutes;
    if (activeToken) {
      activeToken.status = "paused";
      activeToken.estimatedWaitMinutes += durationMinutes;
    }
    return {
      status: "active" as const,
      reason,
      durationMinutes,
      smsBroadcastSent: true
    };
  },

  async resumeQueue() {
    await delay(200);
    queuePaused = false;
    if (activeToken && activeToken.status === "paused") {
      activeToken.status = "in_queue";
    }
  },

  async injectDelay(minutes: number, reason: string) {
    await delay(250);
    delayInjectionMinutes += minutes;
    if (activeToken) {
      activeToken.estimatedWaitMinutes += minutes;
      activeToken.estimatedServiceTime = addMinutes(
        new Date(activeToken.estimatedServiceTime),
        minutes
      );
    }
    staffTokens.forEach((token) => {
      token.estimatedWaitMinutes += minutes;
    });
    return { minutes, reason, affectedCount: staffTokens.length };
  }
};
