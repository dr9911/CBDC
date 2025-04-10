import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { authenticateUser } from '@/utils/auth';

interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    refreshSession: () => void;
    setCurrentUser: (user: User) => void;
}

const initialState: AuthState = {
    isAuthenticated: false,
    currentUser: null,
    sessionTimeRemaining: 0,
};

const AuthContext = createContext<AuthContextType>({
    ...initialState,
    login: async () => false,
    logout: () => {},
    refreshSession: () => {},
    setCurrentUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [authState, setAuthState] = useState<AuthState>(initialState);
    const [sessionTimer, setSessionTimer] = useState<NodeJS.Timeout | null>(null);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('dualUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser) as User;
                setAuthState({
                    isAuthenticated: true,
                    currentUser: user,
                    sessionTimeRemaining: 30, // 30 minutes default
                });
            } catch (error) {
                console.error('Failed to parse stored user:', error);
                localStorage.removeItem('dualUser');
            }
        }
    }, []);

    // Set up session timer when authenticated
    useEffect(() => {
        if (authState.isAuthenticated && authState.sessionTimeRemaining > 0) {
            // Clear any existing timer
            if (sessionTimer) {
                clearInterval(sessionTimer);
            }

            // Set up new timer that decrements sessionTimeRemaining every minute
            const timer = setInterval(() => {
                setAuthState((prev) => {
                    const newTimeRemaining = prev.sessionTimeRemaining - 1;

                    // If session expired, log out
                    if (newTimeRemaining <= 0) {
                        clearInterval(timer);
                        localStorage.removeItem('dualUser');
                        return initialState;
                    }

                    return {
                        ...prev,
                        sessionTimeRemaining: newTimeRemaining,
                    };
                });
            }, 60000); // Update every minute

            setSessionTimer(timer);

            // Clean up timer on unmount
            return () => clearInterval(timer);
        }
    }, [authState.isAuthenticated, authState.sessionTimeRemaining]);

    const setCurrentUser = (user: User) => {
        localStorage.setItem('dualUser', JSON.stringify(user));
        setAuthState((prev) => ({
            ...prev,
            currentUser: user,
        }));
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        const user = await authenticateUser(username, password);

        if (user) {
            // Store user in localStorage
            localStorage.setItem('dualUser', JSON.stringify(user));

            // Update auth state
            setAuthState({
                isAuthenticated: true,
                currentUser: user,
                sessionTimeRemaining: 30, // 30 minutes default
            });

            return true;
        }

        return false;
    };

    const logout = () => {
        // Clear session timer
        if (sessionTimer) {
            clearInterval(sessionTimer);
            setSessionTimer(null);
        }

        // Clear stored user
        localStorage.removeItem('dualUser');

        // Reset auth state
        setAuthState(initialState);
    };

    const refreshSession = () => {
        setAuthState((prev) => ({
            ...prev,
            sessionTimeRemaining: 30, // Reset to 30 minutes
        }));
    };

    return (
        <AuthContext.Provider
            value={{
                ...authState,
                login,
                logout,
                refreshSession,
                setCurrentUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
