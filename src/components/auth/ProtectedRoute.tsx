import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types/auth";
import { hasPermission } from "@/utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute = ({
  children,
  requiredRole = "user",
}: ProtectedRouteProps) => {
  const { isAuthenticated, currentUser } = useAuth();

  if (!isAuthenticated) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (!hasPermission(currentUser, requiredRole)) {
    // User doesn't have permission, redirect to home
    return <Navigate to="/" replace />;
  }

  // User is authenticated and has permission
  return <>{children}</>;
};

export default ProtectedRoute;
