import type { User, UserRole } from "../types";

export type DemoAccount = {
  email: string;
  password: string;
  role: UserRole;
  label: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    email: "demo@waltless.com",
    password: "Demo123!",
    role: "consumer",
    label: "Consumer"
  },
  {
    email: "staff@waltless.com",
    password: "Staff123!",
    role: "staff",
    label: "Staff"
  }
];

export function authenticate(
  email: string,
  password: string
): User | null {
  const account = demoAccounts.find(
    (entry) =>
      entry.email.toLowerCase() === email.trim().toLowerCase() &&
      entry.password === password
  );

  if (!account) {
    return null;
  }

  return {
    id: account.role === "staff" ? "staff-001" : "user-001",
    email: account.email,
    displayName: account.role === "staff" ? "Staff Operator" : "Demo User",
    role: account.role,
    phoneNumber: account.role === "staff" ? "+15551234567" : "+15559876543"
  };
}
