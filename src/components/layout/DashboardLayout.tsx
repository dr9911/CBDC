import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

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
  activePage = "dashboard",
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  isAuthenticated = true,
  sessionTimeRemaining = 15,
  notificationCount = 3,
}: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar activePage={activePage} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header with user info and status indicators */}
        <Header
          userName={userName}
          userAvatar={userAvatar}
          isAuthenticated={isAuthenticated}
          sessionTimeRemaining={sessionTimeRemaining}
          notificationCount={notificationCount}
        />

        {/* Main content with scrolling */}
        <main className="flex-1 overflow-auto p-6">
          {/* If no children are provided, show a placeholder */}
          {children || (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">
                  Welcome to DUAL Platform
                </h2>
                <p className="text-muted-foreground">
                  Select an option from the sidebar to get started
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Footer with security information */}
        <footer className="border-t border-border p-4 text-sm text-muted-foreground">
          <div className="flex justify-between items-center">
            <div>© 2025 DUAL Platform. All rights reserved.</div>
            <div className="flex items-center space-x-4">
              <span>Last Login: Today, 09:45 AM</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
