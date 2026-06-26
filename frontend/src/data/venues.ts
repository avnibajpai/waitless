import type { Queue, Venue } from "../types";

export const venues: Venue[] = [
  {
    id: "venue-riverside",
    name: "Riverside Family Clinic",
    address: "120 Riverside Dr, Portland, OR",
    latitude: 45.5231,
    longitude: -122.6765,
    geofenceRadiusMeters: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    queueCount: 2,
    totalInQueue: 0
  },
  {
    id: "venue-mossbrook",
    name: "Mossbrook Café",
    address: "44 Linden Ave, Brooklyn, NY",
    latitude: 40.6782,
    longitude: -73.9442,
    geofenceRadiusMeters: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    queueCount: 1,
    totalInQueue: 0
  },
  {
    id: "venue-pinecrest",
    name: "Pinecrest Adventure Park",
    address: "9001 Pinecrest Rd, Orlando, FL",
    latitude: 28.5383,
    longitude: -81.3792,
    geofenceRadiusMeters: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1594818379496-da2e2f4e8756?w=800&q=80",
    queueCount: 3,
    totalInQueue: 0
  }
];

export const queuesByVenue: Record<string, Queue[]> = {
  "venue-riverside": [
    {
      id: "queue-riverside-general",
      venueId: "venue-riverside",
      name: "General Consultation",
      description: "Walk-in primary care visits",
      queueType: "standard",
      estimatedServiceTimeMinutes: 12,
      isActive: true,
      currentPosition: 0,
      totalInQueue: 0
    },
    {
      id: "queue-riverside-lab",
      venueId: "venue-riverside",
      name: "Lab & Diagnostics",
      description: "Blood work and imaging",
      queueType: "standard",
      estimatedServiceTimeMinutes: 8,
      isActive: true,
      currentPosition: 0,
      totalInQueue: 0
    }
  ],
  "venue-mossbrook": [
    {
      id: "queue-mossbrook-dine",
      venueId: "venue-mossbrook",
      name: "Dine-In Queue",
      description: "Table seating for parties up to 6",
      queueType: "standard",
      estimatedServiceTimeMinutes: 15,
      isActive: true,
      currentPosition: 0,
      totalInQueue: 0
    }
  ],
  "venue-pinecrest": [
    {
      id: "queue-pinecrest-rides",
      venueId: "venue-pinecrest",
      name: "Thrill Rides",
      description: "Roller coasters and high-speed attractions",
      queueType: "standard",
      estimatedServiceTimeMinutes: 20,
      isActive: true,
      currentPosition: 0,
      totalInQueue: 0
    },
    {
      id: "queue-pinecrest-family",
      venueId: "venue-pinecrest",
      name: "Family Zone",
      description: "Kid-friendly rides and games",
      queueType: "standard",
      estimatedServiceTimeMinutes: 10,
      isActive: true,
      currentPosition: 0,
      totalInQueue: 0
    },
    {
      id: "queue-pinecrest-vip",
      venueId: "venue-pinecrest",
      name: "VIP Fast Lane",
      description: "Skip-the-line premium access",
      queueType: "vip",
      estimatedServiceTimeMinutes: 5,
      isActive: true,
      currentPosition: 0,
      totalInQueue: 0
    }
  ]
};

export const staffQueue = [
  {
    token: "#42",
    name: "Mira K.",
    status: "Serving",
    eta: "Now",
    tokenStatus: "serving" as const
  },
  {
    token: "#43",
    name: "Rohan S.",
    status: "Returning",
    eta: "4 min",
    tokenStatus: "in_queue" as const
  },
  {
    token: "#44",
    name: "Dev A.",
    status: "Within boundary",
    eta: "9 min",
    tokenStatus: "in_queue" as const
  },
  {
    token: "#45",
    name: "Nia P.",
    status: "Warning sent",
    eta: "13 min",
    tokenStatus: "out_of_bounds_warning" as const
  }
];

export const queueInsights = [
  { label: "Avg wait time", value: "18m", color: "mint" },
  { label: "Tokens / hour", value: "24", color: "blue" },
  { label: "Geofence violations", value: "3%", color: "gold" },
  { label: "No-show rate", value: "7%", color: "coral" }
] as const;
