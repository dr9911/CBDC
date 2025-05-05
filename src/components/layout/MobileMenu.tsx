import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    CreditCard,
    History,
    Settings,
    Banknote,
    ArrowUpDown,
    Landmark,
    Network,
    ScrollText,
    LineChart,
    BadgePercent,
    AlertCircle,
    FileSearch,
    FileText,
    Users,
    User,
    UserCheck,
    Wallet,
    Box,
    HelpCircle,
    Headphones,
    LifeBuoy,
    BookOpen,
    Lock,
    ChevronDown,
    ChevronRight,
    LogOut,
    Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface MobileMenuProps {
    activePage?: string;
}

const MobileMenu = ({ activePage = 'dashboard' }: MobileMenuProps) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const userRole = currentUser?.role || 'user';
    const [open, setOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

    const toggleDropdown = (key: string) => setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    let menuItems: any[] = [];

    if (userRole === 'central_bank') {
        menuItems = [
            { id: 'dashboard', label: 'Dashboard', icon: <Home size={16} />, path: '/dashboard' },
            {
                id: 'monetary-operations',
                label: 'Monetary Operations',
                icon: <Landmark size={16} />,
                isSection: true,
                submenu: [
                    {
                        id: 'issuance-management',
                        label: 'Issuance Management',
                        icon: <Banknote size={16} />,
                        isDropdown: true,
                        submenu: [
                            { id: 'mint', label: 'Mint New Supply', icon: <Banknote size={14} />, path: '/mint' },
                            { id: 'mint-events', label: 'Mint Events', icon: <History size={14} />, path: '/mint/approval' },
                        ],
                    },
                    {
                        id: 'distribution-oversight',
                        label: 'Distribution Oversight',
                        icon: <Network size={16} />,
                        isDropdown: true,
                        submenu: [
                            { id: 'transfer', label: 'Transfer', icon: <ArrowUpDown size={14} />, path: '/transfer' },
                            { id: 'monitor-circulation', label: 'Monitor Circulation', icon: <ScrollText size={14} />, path: '/monitor', isDemo: true },
                        ],
                    },
                ],
            },
            {
                id: 'policy-compliance',
                label: 'Policy & Compliance',
                icon: <AlertCircle size={16} />,
                isSection: true,
                submenu: [
                    {
                        id: 'monetary-policy-tools',
                        label: 'Monetary Policy Tools',
                        icon: <BadgePercent size={16} />,
                        isDropdown: true,
                        submenu: [{ id: 'interest-rate', label: 'Interest Rate', icon: <BadgePercent size={14} />, path: '/interest-rate', isDemo: true }],
                    },
                    {
                        id: 'regulatory-compliance',
                        label: 'Regulatory Compliance',
                        icon: <AlertCircle size={16} />,
                        isDropdown: true,
                        submenu: [
                            { id: 'aml-cft', label: 'AML/CFT Monitoring', icon: <AlertCircle size={14} />, path: '/aml', isDemo: true },
                            { id: 'audit-trails', label: 'Audit Trails', icon: <FileSearch size={14} />, path: '/audit', isDemo: true },
                        ],
                    },
                ],
            },
            {
                id: 'analytics-reporting',
                label: 'Analytics & Reporting',
                icon: <LineChart size={16} />,
                isSection: true,
                submenu: [
                    { id: 'transaction-logs', label: 'Transaction Logs', icon: <ScrollText size={14} />, path: '/logs', isDemo: true },
                    { id: 'economic-impact', label: 'Economic Impact', icon: <LineChart size={14} />, path: '/impact', isDemo: true },
                ],
            },
            { id: 'settings', label: 'Settings', icon: <Settings size={16} />, path: '/settings' },
        ];
    } else if (userRole === 'commercial_bank') {
        menuItems = [
            { id: 'dashboard', label: 'Dashboard', icon: <Home size={16} />, path: '/commercial' },
            {
                id: 'financial-operations',
                label: 'Financial Operations',
                icon: <Wallet size={16} />,
                isSection: true,
                submenu: [
                    { id: 'view-balance', label: 'View Balance', icon: <CreditCard size={14} />, path: '/home' },
                    { id: 'history', label: 'Transaction History', icon: <History size={14} />, path: '/history' },
                ],
            },
            {
                id: 'customer-distribution',
                label: 'Customer Distribution',
                icon: <Users size={16} />,
                isSection: true,
                submenu: [
                    { id: 'distribute-cbdc', label: 'Transfer', icon: <ArrowUpDown size={14} />, path: '/home' },
                    { id: 'monitor-distributions', label: 'Monitor Distributions', icon: <ScrollText size={14} />, path: '/distributions', isDemo: true },
                    { id: 'internal-transfers', label: 'Internal Transfers', icon: <ArrowUpDown size={14} />, path: '/internal', isDemo: true },
                    { id: 'liquidity-management', label: 'Liquidity Management', icon: <Box size={14} />, path: '/liquidity', isDemo: true },
                ],
            },
            {
                id: 'customer-management',
                label: 'Customer Management',
                icon: <UserCheck size={16} />,
                isSection: true,
                submenu: [
                    { id: 'kyc-verification', label: 'KYC Verification', icon: <AlertCircle size={14} />, path: '/kyc', isDemo: true },
                    { id: 'account-management', label: 'Account Management', icon: <User size={14} />, path: '/accounts/manage', isDemo: true },
                ],
            },
            {
                id: 'compliance-reporting',
                label: 'Compliance & Reporting',
                icon: <ScrollText size={16} />,
                isSection: true,
                submenu: [
                    { id: 'regulatory-reports', label: 'Regulatory Reports', icon: <FileText size={14} />, path: '/reports', isDemo: true },
                    { id: 'suspicious-activity', label: 'Suspicious Activity Monitoring', icon: <AlertCircle size={14} />, path: '/suspicious', isDemo: true },
                ],
            },
            { id: 'settings', label: 'Settings', icon: <Settings size={16} />, path: '/settings' },
            {
                id: 'support',
                label: 'Support',
                icon: <LifeBuoy size={16} />,
                isSection: true,
                submenu: [
                    { id: 'helpdesk', label: 'Helpdesk', icon: <HelpCircle size={14} />, path: '/help', isDemo: true },
                    { id: 'tech-support', label: 'Technical Support', icon: <Headphones size={14} />, path: '/tech', isDemo: true },
                ],
            },
        ];
    } else {
        menuItems = [
            { id: 'home', label: 'Home', icon: <Home size={16} />, path: '/' },
            { id: 'accounts', label: 'My Accounts', icon: <Wallet size={16} />, path: '/accounts' },
            { id: 'history', label: 'Transaction History', icon: <History size={16} />, path: '/history' },
            {
                id: 'profile-settings',
                label: 'Profile & Settings',
                icon: <User size={16} />,
                isDropdown: true,
                submenu: [
                    { id: 'profile-info', label: 'Profile Information', icon: <BookOpen size={14} />, path: '/profile' },
                    { id: 'security-settings', label: 'Security Settings', icon: <Lock size={14} />, path: '/security' },
                ],
            },
            {
                id: 'support',
                label: 'Support',
                icon: <LifeBuoy size={16} />,
                isDropdown: true,
                submenu: [
                    { id: 'help-center', label: 'Help Center', icon: <HelpCircle size={14} />, path: '/help-center', isDemo: true },
                    { id: 'contact-support', label: 'Contact Support', icon: <LifeBuoy size={14} />, path: '/contact', isDemo: true },
                ],
            },
        ];
    }

    const renderItems = (items: any[], depth = 0) =>
        items.map((item) => {
            const hasSubmenu = Array.isArray(item.submenu) && item.submenu.length > 0;
            const isDropdown = hasSubmenu && depth > 0;

            return (
                <div key={item.id || item.label} className={depth === 0 ? 'mt-4' : ''}>
                    {hasSubmenu && depth === 0 ? (
                        <>
                            <div className="flex items-center gap-1.5 px-2 py-1.5 mt-4 text-sm">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                            <div className="pl-4">{renderItems(item.submenu, depth + 1)}</div>
                        </>
                    ) : isDropdown ? (
                        <>
                            <Button variant="ghost" className="w-full justify-between text-xs px-2 py-1.5 mt-2" onClick={() => toggleDropdown(item.id)}>
                                <div className="flex items-center gap-1.5">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                {dropdownOpen[item.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            </Button>
                            {dropdownOpen[item.id] && <div className="pl-5">{renderItems(item.submenu, depth + 1)}</div>}
                        </>
                    ) : (
                        <Button
                            variant={activePage === item.id ? 'secondary' : 'ghost'}
                            className={`w-full justify-start text-xs px-2 py-1.5 ${depth === 1 ? 'mt-2' : ''}`}
                            onClick={() => {
                                if (item.isDemo) toast.info('This section is for demonstration purposes only.');
                                else navigate(item.path);
                                setOpen(false);
                            }}
                        >
                            <div className="flex items-center gap-1.5">
                                {item.icon}
                                <span className="truncate">{item.label}</span>
                                {item.isDemo && (
                                    <span className="ml-auto text-[7px] bg-muted px-1.5 py-0.5 rounded-full uppercase" style={{ color: '#1f0d68' }}>
                                        demo
                                    </span>
                                )}
                            </div>
                        </Button>
                    )}
                </div>
            );
        });

    return (
        <div className="block md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px]">
                    <div className="flex flex-col h-full bg-background border-r p-4 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center mr-3">
                                    <CreditCard className="text-primary-foreground" size={20} />
                                </div>
                                <h1 className="text-lg sm:text-xl font-semibold ml-2">TND</h1>
                            </div>
                        </div>

                        <div className="mb-4 px-2">
                            <Badge variant="outline" className="w-full justify-center py-1 text-xs">
                                {userRole === 'central_bank'
                                    ? 'Central Bank Access'
                                    : userRole === 'commercial_bank'
                                      ? 'Commercial Bank Access'
                                      : 'User Access'}
                            </Badge>
                        </div>

                        <nav className="space-y-1 mb-6">{renderItems(menuItems)}</nav>

                        <Separator className="my-4" />

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
