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

export type Venue = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  geofenceRadiusMeters: number;
  imageUrl: string;
  queueCount: number;
  totalInQueue: number;
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
  initialLat: number;
  initialLng: number;
  lastKnownLat: number;
  lastKnownLng: number;
  geofenceStatus: GeofenceStatus;
  graceRemainingSeconds: number | null;
  queuePaused: boolean;
};

export type StaffToken = {
  token: string;
  name: string;
  status: string;
  eta: string;
  tokenStatus: TokenStatus;
};

export type QueueInsight = {
  label: string;
  value: string;
  color: "mint" | "blue" | "gold" | "coral";
};
