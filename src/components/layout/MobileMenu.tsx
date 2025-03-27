import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  CreditCard,
  History,
  Settings,
  LogOut,
  Banknote,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface MobileMenuProps {
  activePage?: string;
}

const MobileMenu = ({ activePage = "dashboard" }: MobileMenuProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = currentUser?.role || "user";
  const [open, setOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setOpen(false);
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

  // Filter menu items based on user role
  const menuItems = baseMenuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <div className="block md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <div className="h-full w-full bg-background border-r border-border flex flex-col p-4 overflow-y-auto">
            {/* Logo and branding */}
            <div className="flex items-center justify-between mb-8 px-2">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3">
                  <CreditCard className="text-primary-foreground" size={20} />
                </div>
                <div>
                  <h1 className="font-bold text-xl">TND Platform</h1>
                  <p className="text-xs text-muted-foreground">
                    CBDC Dashboard
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

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
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setOpen(false)}
                >
                  <Button
                    variant={activePage === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${activePage === item.id ? "font-medium" : ""}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </Button>
                </Link>
              ))}
            </nav>

            <Separator className="my-4" />

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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileMenu;
