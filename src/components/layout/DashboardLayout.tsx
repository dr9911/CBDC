import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
    children?: ReactNode;
    activePage?: string;
    userName?: string;
    userAvatar?: string;
    isAuthenticated?: boolean;
    sessionTimeRemaining?: number;
}

const DashboardLayout = ({ children, activePage: propActivePage, userName, userAvatar, isAuthenticated, sessionTimeRemaining }: DashboardLayoutProps) => {
    const location = useLocation();
    const { currentUser } = useAuth();

    // Determine active page based on route path
    const getActivePageFromPath = () => {
        const path = location.pathname;
        return path === '/' ? 'dashboard' : path.substring(1);
    };

    const activePage = propActivePage || getActivePageFromPath();

    // Generate demo "Last Login" time - 1 day ago, random between 08:00 and 18:59
    const lastLoginTime = (() => {
        const now = new Date();
        const demoDate = new Date(now);
        demoDate.setDate(demoDate.getDate() - 1);

        const randomHour = Math.floor(Math.random() * (18 - 8 + 1)) + 8;
        const randomMinute = Math.floor(Math.random() * 60);

        demoDate.setHours(randomHour, randomMinute, 0, 0);

        return demoDate.toLocaleString();
    })();

    return (
        <div className="flex h-screen w-full bg-background overflow-hidden">
            {/* Sidebar (visible on md and up) */}
            <aside className="hidden md:flex md:w-64 flex-shrink-0 border-r border-border">
                <Sidebar activePage={activePage} />
            </aside>

            {/* Main layout area */}
            <div className="flex flex-col flex-1 min-h-0">
                {/* Header */}
                <Header
                    userName={userName}
                    userAvatar={userAvatar}
                    isAuthenticated={isAuthenticated}
                    sessionTimeRemaining={sessionTimeRemaining}
                    activePage={activePage}
                />

                {/* Main content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0">
                    {children || (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Welcome to TND Platform</h2>
                                <p className="text-muted-foreground text-base sm:text-lg">Select an option from the sidebar to get started</p>
                            </div>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer className="border-t border-border p-4 text-xs sm:text-sm text-muted-foreground">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                        <div>© 2025 TND Platform. All rights reserved.</div>
                        <div className="flex items-center space-x-4">
                            <span>Last Login: {lastLoginTime}</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;
