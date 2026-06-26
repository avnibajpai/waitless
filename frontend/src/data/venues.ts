import type { Venue } from "../types";

export const venues: Venue[] = [
  {
    id: "venue-riverside",
    name: "Riverside Family Clinic",
    address: "120 Riverside Dr",
    city: "Portland, OR",
    latitude: 45.5231,
    longitude: -122.6765,
    geofenceRadiusMeters: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    queueCount: 2,
    totalInQueue: 0,
    queues: [
      {
        id: "queue-riverside-general",
        venueId: "venue-riverside",
        name: "General Consultation",
        description: "Walk-in general health visits",
        queueType: "standard",
        estimatedServiceTimeMinutes: 12,
        isActive: true,
        currentPosition: 0,
        totalInQueue: 0,
        isPaused: false
      },
      {
        id: "queue-riverside-lab",
        venueId: "venue-riverside",
        name: "Lab Results Pickup",
        description: "Collect lab reports and prescriptions",
        queueType: "standard",
        estimatedServiceTimeMinutes: 5,
        isActive: true,
        currentPosition: 0,
        totalInQueue: 0,
        isPaused: false
      }
    ]
  },
  {
    id: "venue-mossbrook",
    name: "Mossbrook Café",
    address: "88 Oak St",
    city: "Portland, OR",
    latitude: 45.5152,
    longitude: -122.6784,
    geofenceRadiusMeters: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    queueCount: 1,
    totalInQueue: 0,
    queues: [
      {
        id: "queue-mossbrook-counter",
        venueId: "venue-mossbrook",
        name: "Counter Service",
        description: "Order pickup and seating",
        queueType: "standard",
        estimatedServiceTimeMinutes: 8,
        isActive: true,
        currentPosition: 0,
        totalInQueue: 0,
        isPaused: false
      }
    ]
  },
  {
    id: "venue-pinecrest",
    name: "Pinecrest Adventure Park",
    address: "400 Park Blvd",
    city: "Portland, OR",
    latitude: 45.5122,
    longitude: -122.6587,
    geofenceRadiusMeters: 200,
    imageUrl:
      "https://images.unsplash.com/photo-1597466599360-3bb1b4c1d203?w=800&q=80",
    queueCount: 3,
    totalInQueue: 0,
    queues: [
      {
        id: "queue-pinecrest-coaster",
        venueId: "venue-pinecrest",
        name: "Thunder Ridge Coaster",
        description: "Main roller coaster line",
        queueType: "standard",
        estimatedServiceTimeMinutes: 18,
        isActive: true,
        currentPosition: 0,
        totalInQueue: 0,
        isPaused: false
      },
      {
        id: "queue-pinecrest-river",
        venueId: "venue-pinecrest",
        name: "River Rapids",
        description: "Water ride queue",
        queueType: "standard",
        estimatedServiceTimeMinutes: 15,
        isActive: true,
        currentPosition: 0,
        totalInQueue: 0,
        isPaused: false
      },
      {
        id: "queue-pinecrest-vip",
        venueId: "venue-pinecrest",
        name: "VIP Fast Lane",
        description: "Priority access for VIP guests",
        queueType: "vip",
        estimatedServiceTimeMinutes: 5,
        isActive: true,
        currentPosition: 0,
        totalInQueue: 0,
        isPaused: false
      }
    ]
  }
];

export function getVenueById(id: string): Venue | undefined {
  return venues.find((venue) => venue.id === id);
}

export function getQueueById(queueId: string) {
  for (const venue of venues) {
    const queue = venue.queues.find((entry) => entry.id === queueId);
    if (queue) {
      return { venue, queue };
    }
  }
  return undefined;
}
