import type { User, UserRole } from "../types";

export type DemoAccount = {
  email: string;
  password: string;
  role: UserRole;
  displayName: string;
  phoneNumber: string;
};

export const demoAccounts: DemoAccount[] = [
  {
    email: "demo@waltless.com",
    password: "Demo123!",
    role: "consumer",
    displayName: "Demo Consumer",
    phoneNumber: "+14155550100"
  },
  {
    email: "staff@waltless.com",
    password: "Staff123!",
    role: "staff",
    displayName: "Staff Admin",
    phoneNumber: "+14155550200"
  }
];

export function authenticate(
  email: string,
  password: string
): User | null {
  const account = demoAccounts.find(
    (a) =>
      a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );
  if (!account) return null;

  return {
    id: account.role === "staff" ? "staff-001" : "user-001",
    email: account.email,
    displayName: account.displayName,
    role: account.role,
    phoneNumber: account.phoneNumber
  };
}
