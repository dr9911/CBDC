import React, { useState } from 'react';
import { Bell, Settings, User, Shield, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import MobileMenu from './MobileMenu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Notification from '../profile/Notifications';
import TrustNoteDLogo2 from '../../../public/logos/TND2.png';

interface HeaderProps {
    userName?: string;
    userAvatar?: string;
    isAuthenticated?: boolean;
    sessionTimeRemaining?: number;
    notificationCount?: number;
    activePage?: string;
}

const Header = ({ userName, userAvatar, isAuthenticated: propIsAuthenticated, sessionTimeRemaining: propSessionTimeRemaining, activePage }: HeaderProps) => {
    const { isAuthenticated, currentUser, sessionTimeRemaining, logout, refreshSession } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Use props if provided, otherwise use context values
    const effectiveIsAuthenticated = propIsAuthenticated !== undefined ? propIsAuthenticated : isAuthenticated;
    const effectiveSessionTimeRemaining = propSessionTimeRemaining !== undefined ? propSessionTimeRemaining : sessionTimeRemaining;
    const effectiveUserName = userName || currentUser?.name || 'Guest';
    const effectiveUserAvatar = userAvatar || currentUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${effectiveUserName}`;
    const userRole = currentUser?.role || 'user';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleRefreshSession = () => {
        refreshSession();
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            console.log(`Searching for: ${searchQuery}`);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <header className="w-full h-20 px-4 md:px-6 bg-background border-b border-border flex items-center justify-between">
            {/* Left: Logo and mobile menu */}
            <div className="flex items-center flex-1">
                <MobileMenu activePage={activePage} />
                <h1 className="text-lg sm:text-xl font-semibold ml-2">TND Platform</h1>
            </div>

            {/* Right: User actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Status badges */}
                <div className="hidden sm:flex items-center space-x-2">
                    <Badge variant={effectiveIsAuthenticated ? 'default' : 'destructive'}>
                        {effectiveIsAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                    </Badge>

                    {effectiveIsAuthenticated && <Badge variant="outline">{userRole.replace('_', ' ')}</Badge>}

                    {effectiveIsAuthenticated && effectiveSessionTimeRemaining <= 5 && (
                        <Badge variant="destructive" className="animate-pulse cursor-pointer" onClick={handleRefreshSession}>
                            Session expires in {effectiveSessionTimeRemaining} min
                        </Badge>
                    )}

                    {effectiveIsAuthenticated && effectiveSessionTimeRemaining > 5 && effectiveSessionTimeRemaining <= 10 && (
                        <Badge variant="secondary" className="cursor-pointer" onClick={handleRefreshSession}>
                            Session: {effectiveSessionTimeRemaining} min
                        </Badge>
                    )}
                </div>

                {/* Notifications */}
                <Notification />

                {/* Settings */}
                {/* <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Settings</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/settings')}>Account Settings</DropdownMenuItem>
                        <DropdownMenuItem>Appearance</DropdownMenuItem>
                        <DropdownMenuItem>Notifications</DropdownMenuItem>
                        <DropdownMenuItem>Security</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Help & Support</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}

                {/* User avatar + name */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center space-x-2 p-1">
                            <Avatar>
                                <AvatarImage src={effectiveUserAvatar} alt={effectiveUserName} />
                                <AvatarFallback>{effectiveUserName.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline-block">{effectiveUserName}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem onClick={() => navigate('/profile')}>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem> */}
                        <DropdownMenuItem onClick={() => navigate('/settings')}>
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default Header;
