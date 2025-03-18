import React from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  // Menu items for the sidebar
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home size={20} />,
      path: "/",
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: <CreditCard size={20} />,
      path: "/accounts",
    },
    {
      id: "cbdc",
      label: "DUAL Info",
      icon: <Banknote size={20} />,
      path: "/cbdc",
    },
    {
      id: "mint",
      label: "Mint New Supply",
      icon: <Banknote size={20} />,
      path: "/mint",
    },
    {
      id: "history",
      label: "Transaction History",
      icon: <History size={20} />,
      path: "/history",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

  // Support and security items
  const supportItems = [
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle size={20} />,
      path: "/help",
    },
    {
      id: "security",
      label: "Security Center",
      icon: <Shield size={20} />,
      path: "/security",
    },
  ];

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
      <div className="mb-6 bg-muted rounded-lg p-3">
        <div className="flex items-center">
          <Shield className="text-green-500 mr-2" size={18} />
          <span className="text-sm font-medium">Secure Connection</span>
          <Badge variant="secondary" className="ml-auto text-xs">
            Active
          </Badge>
        </div>
        <div className="mt-2 flex items-center">
          <AlertTriangle className="text-amber-500 mr-2" size={18} />
          <span className="text-xs text-muted-foreground">
            Session expires in 15:00
          </span>
        </div>
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
      <div className="space-y-1 mb-6">
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
      </div>

      {/* Spacer to push logout to bottom */}
      <div className="flex-grow" />

      {/* Logout button */}
      <Button variant="outline" className="w-full justify-start mt-auto">
        <LogOut size={20} className="mr-3" />
        Logout
      </Button>
    </aside>
  );
};

export default Sidebar;
