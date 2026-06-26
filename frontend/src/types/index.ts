export type UserRole = "consumer" | "staff";

export type TokenStatus =
  | "in_queue"
  | "out_of_bounds_warning"
  | "serving"
  | "auto_purged"
  | "vip_priority_boost"
  | "paused"
  | "completed";

export type GeofenceStatus = "within_boundary" | "outside_boundary" | "warning";

export type User = {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber: string;
};

export type Queue = {
  id: string;
  venueId: string;
  name: string;
  description: string;
  queueType: "standard" | "vip" | "priority";
  estimatedServiceTimeMinutes: number;
  isActive: boolean;
  currentPosition: number;
  totalInQueue: number;
  isPaused: boolean;
};

export type Venue = {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  imageUrl: string;
  queueCount: number;
  totalInQueue: number;
  queues: Queue[];
};

export type ActiveToken = {
  id: string;
  queueId: string;
  venueId: string;
  venueName: string;
  queueName: string;
  tokenNumber: number;
  status: TokenStatus;
  position: number;
  aheadCount: number;
  totalInQueue: number;
  estimatedServiceTime: string;
  estimatedWaitMinutes: number;
  aiConfidenceWindow: string;
  joinedAt: string;
  geofenceStatus: GeofenceStatus;
  graceRemainingSeconds: number | null;
  distanceMeters: number;
  initialLat: number;
  initialLng: number;
  lastKnownLat: number;
  lastKnownLng: number;
};

export type JoinQueueResponse = {
  token: ActiveToken;
};

export type QueueStatusResponse = {
  token: ActiveToken;
  queuePaused: boolean;
};

export type VerifyRadiusResponse = {
  withinBoundary: boolean;
  distanceMeters: number;
  status: TokenStatus;
  graceRemainingSeconds: number | null;
  requiresAction: boolean;
};

export type StaffToken = {
  id: string;
  tokenNumber: number;
  displayName: string;
  status: TokenStatus;
  position: number;
  estimatedWaitMinutes: number;
  geofenceStatus: GeofenceStatus;
};

export type StaffMetrics = {
  averageWaitMinutes: number;
  tokensPerHour: number;
  geofenceViolationRate: number;
  totalInQueue: number;
};
