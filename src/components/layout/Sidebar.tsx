import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  CreditCard,
  History,
  Settings,
  Banknote,
  LogOut,
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
  const { currentUser, logout } = useAuth();
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
      roles: ["user", "commercial_bank"],
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: <CreditCard size={20} />,
      path: "/accounts",
      roles: ["commercial_bank"],
    },
    {
      id: "mint",
      label: "Mint New Supply",
      icon: <Banknote size={20} />,
      path: "/mint",
      roles: ["central_bank"],
    },
    {
      id: "history",
      label: "Transaction History",
      icon: <History size={20} />,
      path: "/history",
      roles: ["commercial_bank", "central_bank"],
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
      roles: ["user", "commercial_bank", "central_bank"],
    },
  ];

  // Filter menu items based on user role
  const menuItems = baseMenuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <aside className="h-full w-[280px] bg-background border-r border-border flex flex-col p-4 overflow-y-auto">
      <div className="flex items-center mb-8 px-2">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3">
          <CreditCard className="text-primary-foreground" size={20} />
        </div>
        <div>
          <h1 className="font-bold text-xl">TND Platform</h1>
          <p className="text-xs text-muted-foreground">CBDC Dashboard</p>
        </div>
      </div>
      <div className="mb-4 px-2">
        <Badge variant="outline" className="w-full justify-center py-1">
          {userRole === "central_bank"
            ? "Central Bank Access"
            : userRole === "commercial_bank"
            ? "Commercial Bank Access"
            : "User Access"}
        </Badge>
      </div>
      <nav className="space-y-1 mb-6">
        {menuItems.map((item) => (
          <TooltipProvider key={item.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={item.path}>
                  <Button
                    type="button"
                    variant={activePage === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      activePage === item.id ? "font-medium" : ""
                    }`}
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
      <div className="flex-grow" />
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
