// src/components/navigation/MobileMenu.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, CreditCard, History, Settings, LogOut, Banknote, Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MobileMenuProps {
    activePage?: string;
}

const MobileMenu = ({ activePage = 'dashboard' }: MobileMenuProps) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const userRole = currentUser?.role || 'user';
    const [open, setOpen] = React.useState(false);
    const [liabilitiesOpen, setLiabilitiesOpen] = React.useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setOpen(false);
    };

    // Base menu items for all users, now with a "liabilities" dropdown
    const baseMenuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <Home size={20} />,
            path: '/',
            roles: ['user', 'commercial_bank', 'central_bank'],
        },
        {
            id: 'accounts',
            label: 'Accounts',
            icon: <CreditCard size={20} />,
            path: '/accounts',
            roles: ['user', 'commercial_bank', 'central_bank'],
        },
        {
            id: 'liabilities',
            label: 'Liabilities',
            icon: <Banknote size={20} />,
            path: '/mint',
            roles: ['central_bank'],
            isDropdown: true,
            isOpen: liabilitiesOpen,
            toggle: () => setLiabilitiesOpen(!liabilitiesOpen),
            submenu: [
                {
                    id: 'mint',
                    label: 'Mint New Supply',
                    icon: <Banknote size={20} />,
                    path: '/mint',
                    roles: ['central_bank'],
                },
            ],
        },
        {
            id: 'history',
            label: 'Transaction History',
            icon: <History size={20} />,
            path: '/history',
            roles: ['user', 'commercial_bank', 'central_bank'],
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: <Settings size={20} />,
            path: '/settings',
            roles: ['user', 'commercial_bank', 'central_bank'],
        },
    ];

    // Filter based on the logged‑in user's role
    const menuItems = baseMenuItems.filter((item) => item.roles.includes(userRole));

    return (
        <div className="block md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]" style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}>
                    <div className="flex flex-col h-full bg-background border-r border-border p-4 overflow-y-auto">
                        {/* Top: Logo and close */}
                        <div className="flex items-center justify-between mb-8 px-2">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <CreditCard className="text-primary-foreground" size={20} />
                                </div>
                                <div>
                                    <h1 className="text-lg sm:text-xl font-semibold ml-2">TND</h1>
                                    {/* <p className="text-xs text-muted-foreground">CBDC Dashboard</p> */}
                                </div>
                            </div>
                            {/* <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                              <X className="h-5 w-5" />
                          </Button> */}
                        </div>

                        {/* Role badge */}
                        <div className="mb-6 px-2">
                            <Badge variant="outline" className="w-full justify-center py-1">
                                {userRole === 'central_bank'
                                    ? 'Central Bank Access'
                                    : userRole === 'commercial_bank'
                                      ? 'Commercial Bank Access'
                                      : 'User Access'}
                            </Badge>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 space-y-1">
                            {menuItems.map((item) => (
                                <React.Fragment key={item.id}>
                                    {item.isDropdown ? (
                                        <div className="space-y-1">
                                            <Button
                                                variant={activePage === item.id || item.submenu?.some((sub) => activePage === sub.id) ? 'secondary' : 'ghost'}
                                                className="w-full justify-between"
                                                onClick={item.toggle}
                                            >
                                                <span className="flex items-center">
                                                    <span className="mr-3">{item.icon}</span>
                                                    {item.label}
                                                </span>
                                                {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                            </Button>
                                            {item.isOpen && (
                                                <div className="pl-6 space-y-1">
                                                    {item.submenu!.map((sub) => (
                                                        <Link key={sub.id} to={sub.path} onClick={() => setOpen(false)}>
                                                            <Button
                                                                variant={activePage === sub.id ? 'secondary' : 'ghost'}
                                                                className="w-full justify-start text-sm"
                                                            >
                                                                <span className="mr-2">{sub.icon}</span>
                                                                {sub.label}
                                                            </Button>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link to={item.path} onClick={() => setOpen(false)}>
                                            <Button variant={activePage === item.id ? 'secondary' : 'ghost'} className="w-full justify-start">
                                                <span className="mr-3">{item.icon}</span>
                                                {item.label}
                                            </Button>
                                        </Link>
                                    )}
                                </React.Fragment>
                            ))}
                        </nav>

                        {/* Divider */}
                        <Separator className="my-4" />

                        {/* Logout button at bottom */}
                        <Button variant="outline" className="w-full justify-start mt-auto" onClick={handleLogout}>
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
