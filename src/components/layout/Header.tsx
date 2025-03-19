import React from "react";
import { Bell, Settings, User, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  isAuthenticated?: boolean;
  sessionTimeRemaining?: number;
  notificationCount?: number;
}

const Header = ({
  userName,
  userAvatar,
  isAuthenticated: propIsAuthenticated,
  sessionTimeRemaining: propSessionTimeRemaining,
  notificationCount = 3,
}: HeaderProps) => {
  const {
    isAuthenticated,
    currentUser,
    sessionTimeRemaining,
    logout,
    refreshSession,
  } = useAuth();
  const navigate = useNavigate();

  // Use props if provided, otherwise use context values
  const effectiveIsAuthenticated =
    propIsAuthenticated !== undefined ? propIsAuthenticated : isAuthenticated;
  const effectiveSessionTimeRemaining =
    propSessionTimeRemaining !== undefined
      ? propSessionTimeRemaining
      : sessionTimeRemaining;
  const effectiveUserName = userName || currentUser?.name || "Guest";
  const effectiveUserAvatar =
    userAvatar ||
    currentUser?.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${effectiveUserName}`;
  const userRole = currentUser?.role || "user";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRefreshSession = () => {
    refreshSession();
  };

  return (
    <header className="w-full h-20 px-4 md:px-6 bg-background border-b border-border flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-xl font-semibold">DUAL Platform</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* Authentication Status Indicator */}
        <div className="flex items-center">
          <Badge
            variant={effectiveIsAuthenticated ? "default" : "destructive"}
            className="mr-2"
          >
            {effectiveIsAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>

          {/* User Role Indicator */}
          {effectiveIsAuthenticated && (
            <Badge variant="outline" className="mr-2">
              {userRole.replace("_", " ")}
            </Badge>
          )}

          {/* Session Timeout Warning */}
          {effectiveIsAuthenticated && effectiveSessionTimeRemaining <= 5 && (
            <Badge
              variant="destructive"
              className="animate-pulse cursor-pointer"
              onClick={handleRefreshSession}
            >
              Session expires in {effectiveSessionTimeRemaining} min
            </Badge>
          )}

          {effectiveIsAuthenticated &&
            effectiveSessionTimeRemaining > 5 &&
            effectiveSessionTimeRemaining <= 10 && (
              <Badge
                variant="secondary"
                className="cursor-pointer"
                onClick={handleRefreshSession}
              >
                Session: {effectiveSessionTimeRemaining} min
              </Badge>
            )}
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-[300px] overflow-auto">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">Transaction Completed</p>
                  <p className="text-xs text-muted-foreground">
                    Your transfer of 250 DUAL was successful
                  </p>
                  <p className="text-xs text-muted-foreground">
                    10 minutes ago
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">Security Alert</p>
                  <p className="text-xs text-muted-foreground">
                    New login detected from New York, USA
                  </p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">Account Update</p>
                  <p className="text-xs text-muted-foreground">
                    Your profile information has been updated
                  </p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-center text-primary">
              View All Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Appearance
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Security
            </DropdownMenuItem>
            {userRole === "central_bank" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/user-management")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  User Management
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/user-documentation")}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Documentation
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              Help & Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-1">
              <Avatar>
                <AvatarImage
                  src={effectiveUserAvatar}
                  alt={effectiveUserName}
                />
                <AvatarFallback>
                  {effectiveUserName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block">
                {effectiveUserName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate("/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
