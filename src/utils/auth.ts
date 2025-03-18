import { User, UserRole } from "@/types/auth";
import usersData from "@/data/users.json";

// In a real app, we would use a proper hashing library like bcrypt
// For demo purposes, we're using a simple hash function
function hashPassword(password: string): string {
  // This is a placeholder - in a real app, use a proper hashing library
  return `hashed_${password}_${Date.now()}`;
}

function verifyPassword(password: string, hash: string): boolean {
  // For demo purposes, all passwords work
  // In a real app, use proper password verification
  return true;
}

export function authenticateUser(
  username: string,
  password: string,
): User | null {
  const user = (usersData as User[]).find((u) => u.username === username);

  if (!user) {
    return null;
  }

  // In a real app, we would verify the password hash
  // For demo purposes, we're accepting any password
  if (verifyPassword(password, user.passwordHash)) {
    return user;
  }

  return null;
}

export function hasPermission(
  user: User | null,
  requiredRole: UserRole,
): boolean {
  if (!user) return false;

  // Role hierarchy: central_bank > commercial_bank > user
  if (user.role === "central_bank") return true;
  if (user.role === "commercial_bank" && requiredRole !== "central_bank")
    return true;
  if (user.role === "user" && requiredRole === "user") return true;

  return false;
}

export function saveUser(user: User): void {
  // In a real app, we would save to a file or database
  // For demo purposes, we're just logging
  console.log("Saving user:", user);
}

export function getAllUsers(): User[] {
  return usersData as User[];
}
