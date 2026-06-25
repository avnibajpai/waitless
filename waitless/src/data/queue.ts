export type QueueStop = {
  id: string;
  name: string;
  sector: string;
  wait: number;
  position: number;
  serviceRate: string;
  radius: number;
  people: number;
};

export type TimelineItem = {
  label: string;
  time: string;
  state: "done" | "active" | "next";
};

export const nearbyQueues: QueueStop[] = [
  {
    id: "city-care",
    name: "CityCare Hospital OPD",
    sector: "Healthcare",
    wait: 34,
    position: 8,
    serviceRate: "4.2 min/person",
    radius: 500,
    people: 51
  },
  {
    id: "metro-bank",
    name: "Metro Bank KYC Desk",
    sector: "Banking",
    wait: 18,
    position: 5,
    serviceRate: "3.5 min/person",
    radius: 350,
    people: 23
  },
  {
    id: "student-cell",
    name: "College Student Cell",
    sector: "Campus",
    wait: 42,
    position: 12,
    serviceRate: "3.7 min/person",
    radius: 450,
    people: 64
  }
];

export const returnTimeline: TimelineItem[] = [
  { label: "Token scanned", time: "10:05", state: "done" },
  { label: "Move freely", time: "10:08", state: "done" },
  { label: "Return alert", time: "10:31", state: "active" },
  { label: "Serve window", time: "10:39", state: "next" }
];

export const staffQueue = [
  { token: "A-108", name: "Mira K.", status: "Arrived", eta: "Now" },
  { token: "A-109", name: "Rohan S.", status: "Returning", eta: "4 min" },
  { token: "A-110", name: "Dev A.", status: "Inside radius", eta: "9 min" },
  { token: "A-111", name: "Nia P.", status: "Warning sent", eta: "13 min" }
];

export const queueInsights = [
  { label: "Idle waiting saved", value: "126 hrs", color: "mint" },
  { label: "Crowd reduction", value: "42%", color: "blue" },
  { label: "ETA accuracy", value: "91%", color: "gold" },
  { label: "No-show risk", value: "7%", color: "coral" }
] as const;
