import React, { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuth } from "@/context/AuthContext";

interface DashboardLayoutProps {
  children?: ReactNode;
  activePage?: string;
  userName?: string;
  userAvatar?: string;
  isAuthenticated?: boolean;
  sessionTimeRemaining?: number;
  notificationCount?: number;
}

const DashboardLayout = ({
  children,
  activePage: propActivePage,
  userName,
  userAvatar,
  isAuthenticated,
  sessionTimeRemaining,
}: DashboardLayoutProps) => {
  const location = useLocation();
  const { currentUser } = useAuth();

  // Determine active page based on current path
  const getActivePageFromPath = () => {
    const path = location.pathname;
    if (path === "/") return "dashboard";
    // Remove leading slash and return the path
    return path.substring(1);
  };

  // Use prop if provided, otherwise determine from path
  const activePage = propActivePage || getActivePageFromPath();

  // Format last login time
  const lastLoginTime = currentUser?.lastLogin
    ? new Date(currentUser.lastLogin).toLocaleString()
    : "Never";

  return (
      <div className="flex flex-col md:flex-row h-screen w-full bg-background overflow-hidden">
          {/* Sidebar - visible only on medium and larger screens */}
          <div className="hidden md:block md:w-64">
              <Sidebar activePage={activePage} />
          </div>

          {/* Main content area */}
          <div className="flex flex-col flex-1 overflow-hidden">
              {/* Header */}
              <Header
                  userName={userName}
                  userAvatar={userAvatar}
                  isAuthenticated={isAuthenticated}
                  sessionTimeRemaining={sessionTimeRemaining}
                  activePage={activePage}
              />

              {/* Main section */}
              <main className="flex-1 overflow-auto p-4 sm:p-6">
                  {children || (
                      <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                              <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Welcome to TND Platform</h2>
                              <p className="text-muted-foreground text-base sm:text-lg">Select an option from the sidebar to get started</p>
                          </div>
                      </div>
                  )}
              </main>

              {/* Footer */}
              <footer className="border-t border-border p-4 text-xs sm:text-sm text-muted-foreground">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                      <div>© 2025 TND Platform. All rights reserved.</div>
                      <div className="flex items-center space-x-4">
                          <span>Last Login: {lastLoginTime}</span>
                      </div>
                  </div>
              </footer>
          </div>
      </div>
  );
};

export default DashboardLayout;
