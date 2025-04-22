// src/components/navigation/Sidebar.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    CreditCard,
    History,
    Settings,
    Banknote,
    Box,
    FileText,
    Users,
    Calendar,
    Gavel,
    TrendingUp,
    ArrowUpDown,
    User,
    LogOut,
    ChevronDown,
    ChevronRight,
    HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

import TrustNoteDLogo from '../../../public/logos/TND2.png';
import OrellFuslliLogo from '../../../public/logos/orell.png';

interface SidebarProps {
    activePage?: string;
}

const Sidebar = ({ activePage = 'dashboard' }: SidebarProps) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const userRole = currentUser?.role || 'user';

    const [liabilitiesOpen, setLiabilitiesOpen] = useState(false);
    const [assetsOpen, setAssetsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const baseMenuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: <Home size={20} />,
            path: userRole === 'central_bank' ? '/dashboard' : '/',
            roles: ['user', 'commercial_bank', 'central_bank'],
        },
        { id: 'accounts', label: 'Accounts', icon: <CreditCard size={20} />, path: '/accounts', roles: ['user'] },
        {
            id: 'liabilities',
            label: 'Liabilities',
            icon: <Banknote size={20} />,
            path: '/mint',
            roles: ['central_bank'],
            isDropdown: true,
            isOpen: liabilitiesOpen,
            toggle: () => setLiabilitiesOpen(!liabilitiesOpen),
            submenu: [{ id: 'mint', label: 'Mint New Supply', icon: <Banknote size={20} />, path: '/mint', roles: ['central_bank'] }],
        },
        { id: 'history', label: 'Transaction History', icon: <History size={20} />, path: '/history', roles: ['commercial_bank', 'central_bank'] },
        {
            id: 'assets',
            label: 'Assets',
            icon: <Box size={20} />,
            path: '/assets',
            roles: ['central_bank'],
            isDropdown: true,
            isOpen: assetsOpen,
            toggle: () => setAssetsOpen(!assetsOpen),
            submenu: [
                { id: 'equity', label: 'Equity', icon: <TrendingUp size={20} />, path: '/assets/equity', roles: ['central_bank'], isDemo: true },
                { id: 'transfer', label: 'Transfer', icon: <ArrowUpDown size={20} />, path: '/assets/transfer', roles: ['central_bank'] },
            ],
        },
        { id: 'documents', label: 'Documents', icon: <FileText size={20} />, path: '/documents', roles: ['central_bank'], isDemo: true },
        { id: 'memberships', label: 'Memberships', icon: <Users size={20} />, path: '/memberships', roles: ['central_bank'], isDemo: true },
        { id: 'events', label: 'Events', icon: <Calendar size={20} />, path: '/events', roles: ['central_bank'], isDemo: true },
        { id: 'governance', label: 'Governance', icon: <Gavel size={20} />, path: '/governance', roles: ['central_bank'], isDemo: true },
        { id: 'markets', label: 'Markets', icon: <TrendingUp size={20} />, path: '/markets', roles: ['central_bank'], isDemo: true },
        { id: 'account', label: 'Account', icon: <User size={20} />, path: '/account', roles: ['central_bank'], isDemo: true },
        { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/settings', roles: ['user', 'commercial_bank', 'central_bank'] },
    ];

    const menuItems = baseMenuItems.filter((item) => item.roles.includes(userRole));
    const settingsItem = menuItems.find((item) => item.id === 'settings');
    const otherItems = menuItems.filter((item) => item.id !== 'settings');

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
                    {userRole === 'central_bank' ? 'Central Bank Access' : userRole === 'commercial_bank' ? 'Commercial Bank Access' : 'User Access'}
                </Badge>
            </div>

            <nav className="space-y-1 mb-6">
                {otherItems.map((item) => (
                    <React.Fragment key={item.id}>
                        {item.isDropdown ? (
                            <div className="space-y-1">
                                <Button
                                    type="button"
                                    variant={activePage === item.id || item.submenu?.some((sub) => activePage === sub.id) ? 'secondary' : 'ghost'}
                                    className={`w-full justify-between ${activePage === item.id ? 'font-medium' : ''}`}
                                    onClick={item.toggle}
                                >
                                    <span className="flex items-center">
                                        <span className="mr-3">{item.icon}</span>
                                        {item.label}
                                    </span>
                                    {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </Button>
                                {item.isOpen && (
                                    <div className="pl-8 space-y-1">
                                        {item.submenu!.map((sub) => (
                                            <Button
                                                key={sub.id}
                                                type="button"
                                                variant={activePage === sub.id ? 'secondary' : 'ghost'}
                                                className="w-full justify-between text-sm"
                                                onClick={() => {
                                                    if (sub.isDemo) {
                                                        toast.info('This section is for demonstration purposes only. Feature not implemented.');
                                                    } else {
                                                        navigate(sub.path);
                                                    }
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <span className="mr-2">{sub.icon}</span>
                                                    <span>{sub.label}</span>
                                                </div>
                                                {sub.isDemo && (
                                                    <span
                                                        className="text-[7px] bg-muted px-1.5 py-0.5 rounded-full uppercase cursor-help"
                                                        style={{ color: '#1f0d68' }}
                                                        title="This demo is not working"
                                                    >
                                                        demo
                                                    </span>
                                                )}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Button
                                type="button"
                                variant={activePage === item.id ? 'secondary' : 'ghost'}
                                className="w-full justify-between"
                                onClick={() => {
                                    if (item.isDemo) {
                                        toast.info('This section is for demonstration purposes only. Feature not implemented.');
                                    } else {
                                        navigate(item.path);
                                    }
                                }}
                            >
                                <div className="flex items-center">
                                    <span className="mr-3">{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                                {item.isDemo && (
                                    <span
                                        className="text-[7px] bg-muted px-1.5 py-0.5 rounded-full uppercase cursor-help"
                                        style={{ color: '#1f0d68' }}
                                        title="This demo is not working"
                                    >
                                        demo
                                    </span>
                                )}
                            </Button>
                        )}
                    </React.Fragment>
                ))}

                <Separator className="my-4" />

                {settingsItem && (
                    <Button
                        type="button"
                        variant={activePage === settingsItem.id ? 'secondary' : 'ghost'}
                        className="w-full justify-between"
                        onClick={() => navigate(settingsItem.path)}
                    >
                        <div className="flex items-center">
                            <span className="mr-3">{settingsItem.icon}</span>
                            <span>{settingsItem.label}</span>
                        </div>
                    </Button>
                )}

                <Button
                    type="button"
                    variant={activePage === 'help' ? 'secondary' : 'ghost'}
                    className="w-full justify-between"
                    onClick={() => {
                        toast.info('This section is for demonstration purposes only. Feature not implemented.');
                    }}
                >
                    <div className="flex items-center">
                        <span className="mr-3">
                            <HelpCircle size={20} />
                        </span>
                        <span>Help and support</span>
                    </div>
                    <span
                        className="text-[7px] bg-muted px-1.5 py-0.5 rounded-full uppercase cursor-help"
                        style={{ color: '#1f0d68' }}
                        title="This demo is not working"
                    >
                        demo
                    </span>
                </Button>
            </nav>

            <Separator className="my-1" />

            <div className="flex items-center justify-center space-x-2 m-6">
                <img src={TrustNoteDLogo} alt="TrustNoteD" className="h-8" />
                <span className="mx-2 font-semibold">×</span>
                <img src={OrellFuslliLogo} alt="Orell Fuslli" className="h-8" />
            </div>

            <div className="flex-grow" />
            <Button variant="outline" className="w-full justify-start mt-auto" onClick={handleLogout}>
                <LogOut size={20} className="mr-3" />
                Logout
            </Button>
        </aside>
    );
};

export default Sidebar;
