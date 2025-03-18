import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  CreditCard,
  Send,
  QrCode,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  AlertTriangle,
  Banknote,
  Users,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  activePage?: string;
}

const Sidebar = ({ activePage = "dashboard" }: SidebarProps) => {
  const { currentUser, logout, sessionTimeRemaining, refreshSession } =
    useAuth();
  const navigate = useNavigate();
  const userRole = currentUser?.role || "user";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Base menu items for all users
  const baseMenuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      path: "/",
      roles: ["user", "commercial_bank", "central_bank"],
    },
    {
      id: "cbdc",
      label: "DUAL Info",
      icon: <Banknote size={20} />,
      path: "/cbdc",
      roles: ["user", "commercial_bank", "central_bank"],
    },
    {
      id: "history",
      label: "Transaction History",
      icon: <History size={20} />,
      path: "/history",
      roles: ["user", "commercial_bank", "central_bank"],
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
      roles: ["user", "commercial_bank", "central_bank"],
    },
  ];

  // Role-specific menu items
  const roleSpecificItems = [
    {
      id: "accounts",
      label: "Manage Accounts",
      icon: <CreditCard size={20} />,
      path: "/accounts",
      roles: ["commercial_bank", "central_bank"],
    },
    {
      id: "mint",
      label: "Mint New Supply",
      icon: <Banknote size={20} />,
      path: "/mint",
      roles: ["central_bank"],
    },
    {
      id: "user-management",
      label: "User Management",
      icon: <Users size={20} />,
      path: "/user-management",
      roles: ["central_bank"],
    },
    {
      id: "user-documentation",
      label: "Documentation",
      icon: <FileText size={20} />,
      path: "/user-documentation",
      roles: ["central_bank"],
    },
  ];

  // Filter menu items based on user role
  const menuItems = [
    ...baseMenuItems,
    ...roleSpecificItems.filter((item) => item.roles.includes(userRole)),
  ];

  // Support and security items
  // const supportItems = [
  //   {
  //     id: "help",
  //     label: "Help & Support",
  //     icon: <HelpCircle size={20} />,
  //     path: "/help",
  //   },
  //   {
  //     id: "security",
  //     label: "Security Center",
  //     icon: <Shield size={20} />,
  //     path: "/security",
  //   },
  // ];

  return (
    <aside className="h-full w-[280px] bg-background border-r border-border flex flex-col p-4">
      {/* Logo and branding */}
      <div className="flex items-center mb-8 px-2">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3">
          <CreditCard className="text-primary-foreground" size={20} />
        </div>
        <div>
          <h1 className="font-bold text-xl">DUAL Platform</h1>
          <p className="text-xs text-muted-foreground">
            Digital Currency Dashboard
          </p>
        </div>
      </div>

      {/* Security status indicator */}
      {/* <div className="mb-6 bg-muted rounded-lg p-3">
        <div className="flex items-center">
          <Shield className="text-green-500 mr-2" size={18} />
          <span className="text-sm font-medium">Secure Connection</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            Active
          </Badge>
        </div>
        <div className="mt-2 flex items-center">
          <AlertTriangle className="text-amber-500 mr-2" size={18} />
          <span
            className="text-xs text-muted-foreground cursor-pointer hover:text-foreground"
            onClick={refreshSession}
          >
            Session expires in {sessionTimeRemaining} min
          </span>
        </div>
      </div> */}

      {/* User role indicator */}
      <div className="mb-4 px-2">
        <Badge variant="outline" className="w-full justify-center py-1">
          {userRole === "central_bank"
            ? "Central Bank Access"
            : userRole === "commercial_bank"
              ? "Commercial Bank Access"
              : "User Access"}
        </Badge>
      </div>

      {/* Main navigation */}
      <nav className="space-y-1 mb-6">
        {menuItems.map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={item.path}>
                  <Button
                    variant={activePage === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${activePage === item.id ? "font-medium" : ""}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>

      <Separator className="my-4" />

      {/* Support and security section */}
      {/* <div className="space-y-1 mb-6">
        {supportItems.map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={item.path}>
                  <Button
                    variant={activePage === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${activePage === item.id ? "font-medium" : ""}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div> */}

      {/* Spacer to push logout to bottom */}
      <div className="flex-grow" />

      {/* Logout button */}
      <Button
        variant="outline"
        className="w-full justify-start mt-auto"
        onClick={handleLogout}
      >
        <LogOut size={20} className="mr-3" />
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;
