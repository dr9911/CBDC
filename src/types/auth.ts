export type UserRole = "central_bank" | "commercial_bank" | "user";

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  email: string;
  avatar?: string;
  lastLogin?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  sessionTimeRemaining: number;
}
